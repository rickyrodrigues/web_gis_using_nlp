import os
import glob
import json
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from typing import Dict, List, Union, Optional
from geopy.distance import geodesic
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


GEMINI_API_KEY = ""  # add this as needed
GEOJSON_DIR = 'C:/Users/Asus/OneDrive/Documents/Assassins_Creed_Odyssey/data/json'  # Keeping as requested

# Mount Mary Bandra coordinates (latitude, longitude) - DEFAULT LOCATION
DEFAULT_LOCATION = (19.0434, 72.8198)  # Mount Mary Bandra, Mumbai

# Intent mappings and constants
INTENT_MAPPINGS = {
    "relax": ["park", "beach", "bench", "fountain", "cafe", "spa", "viewpoint", "garden", "playground"],
    "religious": ["jewish", "muslim", "christian_protestant", "sikh", "christian", "muslim_shia",
                  "buddhist", "christian_catholic", "hindu", "muslim_sunni"],
    "fun": ["park", "playground", "cinema", "arts_centre", "sports_centre", "zoo", "golf_course",
            "bar", "attraction", "stadium"],
    "eat": ["restaurant", "cafe", "fast_food", "bakery", "bar", "pub"],
    "shop": ["mall", "supermarket", "market_place", "clothes", "shoe_shop", "toy_shop", "bookshop", "jeweller"],
    "outdoor": ["park", "beach", "peak", "cliff", "viewpoint", "tree", "fountain", "playground", "sports_centre"],
    "culture": ["museum", "arts_centre", "monument", "memorial", "archaeological", "ruins", "library", "theatre"]
}

# Expanded keyword list including all possible feature types
KEYWORD_CATEGORIES = {
    "natural_features": ["cave_entrance", "tree", "peak", "cliff", "beach", "fountain", "archaeological",
                         "ruins", "observation_tower", "tower", "viewpoint", "monument", "bench", "memorial"],
    "water_features": ["dock", "reservoir", "water", "wetland", "riverbank", "swimming_pool", "water_works",
                       "wastewater_plant", "water_well", "water_tower", "drinking_water","lake"],
    "settlements": ["locality", "village", "suburb", "city", "hamlet", "island", "town"],
    "religious_places": ["jewish", "muslim", "christian_protestant", "sikh", "christian", "muslim_shia",
                         "buddhist", "christian_catholic", "hindu", "muslim_sunni"],
    "amenities_and_shops": ["stadium", "graveyard", "market_place", "toy_shop", "supermarket", "mall",
                            "attraction", "bakery", "cafe", "pub", "restaurant", "playground", "park",
                            "sports_centre", "cinema", "bar", "zoo", "golf_course"],
    "land_use": ["farmland", "military", "meadow", "park", "residential", "grass", "industrial", 
                 "commercial", "scrub", "retail", "recreation_ground", "forest", "quarry", "heath"],
    "traffic": ["parking_underground", "parking_bicycle", "pier", "service", "parking_multistorey", 
                "parking", "fuel", "dam"],
    "buildings": ["school", "fast_food", "mall", "castle", "university", "market_place", "restaurant", 
                  "sports_centre", "college", "cafe", "veterinary", "hotel", "swimming_pool", 
                  "chalet", "track", "shelter", "wastewater_plant", "artwork", "bank", "beauty_shop", 
                  "dog_park", "hospital", "clothes", "theatre", "hostel", "pitch"]
}

RANGES = {
    "nearby": 2,      # Walking distance
    "local": 5,       # Short drive/bike ride
    "area": 10,       # Local area
    "district": 30,   # District level
    "region": 50,     # Regional level
    "wide": 100       # Wide area search
}

# Creates Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class LocationSearchSystem:
    def __init__(self, geojson_directory: str):
        """Initialize the search system with GeoJSON data directory."""
        self.geojson_directory = geojson_directory
        self.user_location = DEFAULT_LOCATION
        logger.info(f"Initializing LocationSearchSystem with directory: {geojson_directory}")
        
        # Ensure directory exists- checks the existence of geojson files
        if not os.path.exists(self.geojson_directory):
            logger.warning(f"Directory {self.geojson_directory} does not exist. Creating it...")
            os.makedirs(self.geojson_directory, exist_ok=True)
            
        self.geojson_data = self.load_geojson_files()
        self.configure_genai()
        self.available_features = self.collect_available_features()

    def configure_genai(self):
        """Configure the Gemini API."""
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info("Successfully configured Gemini API")
        except Exception as e:
            logger.error(f"Failed to configure Gemini API: {e}")
            raise

    def load_geojson_files(self) -> List[Dict]:
        """Load all GeoJSON files from the specified directory."""
        geojson_files = glob.glob(os.path.join(self.geojson_directory, "*.geojson"))
        logger.info(f"Found {len(geojson_files)} GeoJSON files")
        
        if not geojson_files:
            logger.warning(f"No GeoJSON files found in {self.geojson_directory}")
            
        geojson_data = []

        for file in geojson_files:
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if "type" in data and data["type"] == "FeatureCollection":
                        # Add filename to track source
                        data["_filename"] = os.path.basename(file)
                        geojson_data.append(data)
                        logger.info(f"Loaded {file} successfully.")
                    else:
                        logger.warning(f"Skipping {file}: Not a valid GeoJSON FeatureCollection.")
            except Exception as e:
                logger.error(f"Error reading {file}: {e}")

        return geojson_data

    def collect_available_features(self) -> Dict[str, List[str]]:
        """Collect all available feature types from loaded GeoJSON files."""
        features_by_file = {}
        
        for geojson in self.geojson_data:
            filename = geojson.get("_filename", "unknown")
            feature_types = set()
            
            if "features" in geojson:
                for feature in geojson["features"]:
                    if isinstance(feature, dict):
                        properties = feature.get("properties", {})
                        if isinstance(properties, dict):
                            fclass = properties.get("fclass")
                            if fclass:
                                feature_types.add(fclass)
            
            features_by_file[filename] = sorted(list(feature_types))
            logger.debug(f"File: {filename} contains feature types: {', '.join(features_by_file[filename])}")
            
        return features_by_file

    def map_intent_to_keywords(self, query: str) -> List[str]:
        """Map user intent to relevant keywords."""
        query = query.lower()
        matched_keywords = set()

        for intent, keywords in INTENT_MAPPINGS.items():
            if any(phrase in query for phrase in [intent, f"place to {intent}", f"places to {intent}"]):
                matched_keywords.update(keywords)

        return list(matched_keywords)

    def create_prompt(self, query: str) -> str:
        """Create a detailed prompt for Gemini API."""
        # Create a flattened list of all available features
        all_features = []
        for file_features in self.available_features.values():
            all_features.extend(file_features)
        all_features = sorted(list(set(all_features)))
        
        return f"""
        Analyze the following query and extract relevant keywords and range information.
        Query: "{query}"

        Task:
        1. Extract relevant keywords from the available categories below.
        2. Determine the appropriate search range.
        3. Suggest related keywords that might be useful.
        4. Consider user intent and map to available keywords.
        5. Use ONLY the feature types available in our system. Do not invent new feature types.

        Available features from our files:
        {json.dumps(all_features, indent=2)}

        Available keywords by category:
        {json.dumps(KEYWORD_CATEGORIES, indent=2)}

        Available ranges (in km):
        {json.dumps(RANGES, indent=2)}

        Intent mappings for common phrases:
        {json.dumps(INTENT_MAPPINGS, indent=2)}

        Return strictly a JSON object with this format:
        {{
            "keywords": ["matched_keyword1", "matched_keyword2"],
            "range": range_in_km,
            "suggested_keywords": ["suggested1", "suggested2"]
        }}
        """

    def process_query(self, query: str) -> Dict:
        """Process the query to extract keywords and range."""
        try:
            intent_keywords = self.map_intent_to_keywords(query)
            prompt = self.create_prompt(query)
            response = self.model.generate_content(prompt)

            try:
                result = json.loads(response.text)
            except json.JSONDecodeError:
                text = response.text
                start_idx = text.find('{')
                end_idx = text.rfind('}') + 1
                if start_idx != -1 and end_idx != 0:
                    result = json.loads(text[start_idx:end_idx])
                else:
                    logger.error(f"Invalid JSON in response: {text}")
                    raise ValueError("Could not find valid JSON in response")

            # Flatten all available keywords for validation
            all_keywords = []
            for category in KEYWORD_CATEGORIES.values():
                all_keywords.extend(category)
            
            # Also include actual feature types found in the files
            for file_features in self.available_features.values():
                all_keywords.extend(file_features)
            
            # Deduplicate
            all_keywords = list(set(all_keywords))
            
            # Validate and clean response
            combined_keywords = list(set(
                [k for k in result.get("keywords", []) if k in all_keywords] +
                [k for k in intent_keywords if k in all_keywords]
            ))

            # Ensure we have a valid range (use lookup or default to numeric value)
            range_value = result.get("range")
            if isinstance(range_value, str) and range_value in RANGES:
                range_km = RANGES[range_value]
            elif isinstance(range_value, (int, float)):
                range_km = range_value
            else:
                range_km = 5  # Default to 5km if no valid range

            return {
                "keywords": combined_keywords,
                "range": range_km,
                "suggested_keywords": [k for k in result.get("suggested_keywords", []) if k in all_keywords]
            }
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return {
                "error": f"Error processing query: {str(e)}",
                "keywords": intent_keywords,
                "range": 5,  # Default to 5km
                "suggested_keywords": []
            }

    # Distance filtering functions
    def is_point_within_radius(self, point: tuple, radius_km: float) -> bool:
        """Check if a point is within the specified radius from user location."""
        distance = geodesic(self.user_location, point).km
        return distance <= radius_km

    def is_geometry_within_radius(self, coordinates: List, geometry_type: str, radius_km: float) -> bool:
        """Check if any part of a geometry is within radius."""
        try:
            if geometry_type == "Point":
                # For Point geometries, check directly
                point = (coordinates[1], coordinates[0])  # Convert to (latitude, longitude)
                return self.is_point_within_radius(point, radius_km)
                
            elif geometry_type == "Polygon":
                # For Polygon geometries, check if any vertex is within the radius
                for coord_pair in coordinates[0]:  # First ring of polygon
                    point = (coord_pair[1], coord_pair[0])  # (latitude, longitude)
                    if self.is_point_within_radius(point, radius_km):
                        return True
                        
            elif geometry_type == "MultiPolygon":
                # For MultiPolygon geometries, check each sub-polygon
                for polygon in coordinates:
                    for ring in polygon:
                        for coord_pair in ring:
                            point = (coord_pair[1], coord_pair[0])  # (latitude, longitude)
                            if self.is_point_within_radius(point, radius_km):
                                return True
        except Exception as e:
            logger.error(f"Error checking geometry distance: {e}")
            return False
        
        return False

    def find_features_by_keywords_and_distance(self, keywords: List[str], radius_km: float) -> List[Dict]:
        """Find features matching keywords and within specified distance."""
        matching_features = []

        for geojson in self.geojson_data:
            if "features" not in geojson:
                continue

            for feature in geojson["features"]:
                try:
                    if not isinstance(feature, dict):
                        continue

                    properties = feature.get("properties", {})
                    if not isinstance(properties, dict):
                        continue

                    # Check if feature matches any keyword
                    fclass = properties.get("fclass")
                    if not fclass or fclass not in keywords:
                        continue
                    
                    # Check if feature is within distance radius
                    geometry = feature.get("geometry", {})
                    if not geometry:
                        continue
                        
                    geometry_type = geometry.get("type")
                    coordinates = geometry.get("coordinates", [])
                    
                    # Add source file info to feature for debugging
                    source_file = geojson.get("_filename", "unknown")
                    feature["_source_file"] = source_file

                    # Check if the feature is within the specified radius
                    if self.is_geometry_within_radius(coordinates, geometry_type, radius_km):
                        matching_features.append(feature)
                except Exception as e:
                    logger.error(f"Error processing feature: {e}")
                    continue

        return matching_features

    def search(self, query: str) -> Dict[str, Union[List[Dict], Dict, str]]:
        """Complete search process: parse query, find & filter matching features by distance."""
        # Process the query to get keywords and range
        query_result = self.process_query(query)

        if "error" in query_result:
            return {
                "error": query_result["error"],
                "features": [],
                "query_analysis": query_result
            }

        # Get the search radius determined by Gemini
        radius_km = query_result["range"]
        
        # Search for features using keywords and filter by distance
        matching_features = self.find_features_by_keywords_and_distance(
            query_result["keywords"], 
            radius_km
        )

        return {
            "features": matching_features,
            "query_analysis": query_result,
            "total_matches": len(matching_features),
            "search_radius_km": radius_km,
            "reference_location": self.user_location
        }


# Initialize search system globally
search_system = None

def get_search_system():
    """Get or initialize the search system."""
    global search_system
    if search_system is None:
        logger.info(f"Initializing search system with directory: {GEOJSON_DIR}")
        search_system = LocationSearchSystem(GEOJSON_DIR)
    return search_system

# API route to get user location
@app.route('/api/user-location', methods=['GET'])
def get_user_location():
    return jsonify({
        "latitude": DEFAULT_LOCATION[0],
        "longitude": DEFAULT_LOCATION[1]
    })

# API route to search for places
@app.route('/api/search', methods=['GET'])
def search_places():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        # Get or initialize search system
        system = get_search_system()
        results = system.search(query)

        # Transform results for the frontend
        places = []
        for feature in results.get("features", []):
            try:
                properties = feature.get("properties", {})
                geometry = feature.get("geometry", {})

                # Skip features without proper geometry
                if not geometry or "type" not in geometry or "coordinates" not in geometry:
                    continue

                place_data = {
                    "name": properties.get("name", f"{properties.get('fclass', 'Unknown').title()} Place"),
                    "type": properties.get("fclass", "unknown"),
                    "description": f"A {properties.get('fclass', 'place')}",
                    "source_file": feature.get("_source_file", "unknown"),
                    "geometry": geometry  # Send the entire geometry object
                }

                # Calculate a representative latitude and longitude (e.g., centroid or first point)
                latitude = None
                longitude = None
                if geometry["type"] == "Point":
                    longitude, latitude = geometry["coordinates"]
                elif geometry["type"] == "Polygon":
                    if geometry["coordinates"] and geometry["coordinates"][0]:
                        longitude, latitude = geometry["coordinates"][0][0]
                elif geometry["type"] == "MultiPolygon":
                    if geometry["coordinates"] and geometry["coordinates"][0] and geometry["coordinates"][0][0]:
                        longitude, latitude = geometry["coordinates"][0][0][0]

                if latitude is not None and longitude is not None:
                    distance = geodesic(DEFAULT_LOCATION, (latitude, longitude)).km
                    place_data["description"] += f" located {distance:.2f}km from your location."
                    place_data["latitude"] = latitude
                    place_data["longitude"] = longitude
                else:
                    place_data["description"] += " with spatial data."
                    place_data["latitude"] = None
                    place_data["longitude"] = None

                places.append(place_data)

            except Exception as e:
                logger.error(f"Error processing feature for response: {e}")
                continue

        response_data = {
            "places": places,
            "user_location": {
                "latitude": DEFAULT_LOCATION[0],
                "longitude": DEFAULT_LOCATION[1]
            },
            "query_info": {
                "keywords": results.get("query_analysis", {}).get("keywords", []),
                "range_km": results.get("search_radius_km", 5),
                "total_results": len(places)
            }
        }

        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Search failed: {e}")
        return jsonify({"error": f"Search failed: {str(e)}"}), 500
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    try:
        # Get or initialize search system
        system = get_search_system()
        results = system.search(query)
        
        # Transform results for the frontend
        places = []
        for feature in results.get("features", []):
            try:
                properties = feature.get("properties", {})
                geometry = feature.get("geometry", {})
                
                # Skip features without proper geometry
                if not geometry or "type" not in geometry or "coordinates" not in geometry:
                    continue
                    
                # Get coordinates based on geometry type
                latitude = None
                longitude = None
                if geometry["type"] == "Point":
                    # GeoJSON format is [longitude, latitude]
                    longitude, latitude = geometry["coordinates"]
                elif geometry["type"] in ["Polygon", "MultiPolygon"]:
                    # For polygons, use the first coordinate as reference
                    if geometry["type"] == "Polygon":
                        longitude, latitude = geometry["coordinates"][0][0]
                    else:  # MultiPolygon
                        longitude, latitude = geometry["coordinates"][0][0][0]
                
                if latitude is None or longitude is None:
                    continue
                    
                # Calculate distance from user location
                distance = geodesic(
                    DEFAULT_LOCATION, 
                    (latitude, longitude)
                ).km
                    
                places.append({
                    "name": properties.get("name", f"{properties.get('fclass', 'Unknown').title()} Place"),
                    "type": properties.get("fclass", "unknown"),
                    "description": f"A {properties.get('fclass', 'place')} located {distance:.2f}km from your location.",
                    "latitude": latitude,
                    "longitude": longitude,
                    "source_file": feature.get("_source_file", "unknown")
                })
            except Exception as e:
                logger.error(f"Error processing feature for response: {e}")
                continue
        
        response_data = {
            "places": places,
            "user_location": {
                "latitude": DEFAULT_LOCATION[0],
                "longitude": DEFAULT_LOCATION[1]
            },
            "query_info": {
                "keywords": results.get("query_analysis", {}).get("keywords", []),
                "range_km": results.get("search_radius_km", 5),
                "total_results": len(places)
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

# Serve the main page - keeping your hardcoded path
@app.route('/', methods=['GET'])
def index():
    try:
        index_path = 'templates/index2.html'#path to the index2file frontend
        if os.path.exists(index_path):
            return flask.send_from_directory(
                os.path.dirname(index_path), 
                os.path.basename(index_path)
            )
        else:
            logger.warning(f"Index file not found at {index_path}")
            return jsonify({
                "error": "index.html not found",
                "message": "API is running correctly. Please use the API endpoints."
            })
    except Exception as e:
        logger.error(f"Error serving index page: {e}")
        return jsonify({"error": f"Error serving index page: {str(e)}"}), 500


if __name__ == "__main__":
    # Set the port from environment variable or use default (5000)
    port = int(os.environ.get('PORT', 5000))
    
    # Get debug mode from environment variable
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Initialize the search system before starting the app
    try:
        search_system = get_search_system()
        logger.info(f"Search system initialized successfully with {len(search_system.geojson_data)} GeoJSON files")
    except Exception as e:
        logger.error(f"Failed to initialize search system: {e}")
        # Continue anyway, we'll try to initialize on first request
    
    logger.info(f"Starting Flask app on port {port} with debug={debug}")
    app.run(host='0.0.0.0', port=port, debug=debug)
