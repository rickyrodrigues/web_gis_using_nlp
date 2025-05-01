// Initialize map and marker data
let map, userMarker, markers = [];
let searchedKeywords = [];

// Type color mappings with distinct colors for each type
const typeColors = {
    // Food & Drink (Distinct Colors for each type)
    'restaurant': '#FF5722', // Deep Orange
    'cafe': '#FF9800',     // Amber
    'bar': '#FFEB3B',      // Yellow
    'bakery': '#FFEE58',   // Light Yellow
    'food': '#FFC107',     // Deep Amber (General Food Type)
    'fast_food': '#FF7043', // Coral
    'pub': '#E64A19',      // Dark Orange

    // Accommodation (Distinct Colors for each type)
    'hotel': '#2196F3',    // Blue
    'hostel': '#42A5F5',   // Lighter Blue
    'motel': '#64B5F6',    // Even Lighter Blue
    'resort': '#90CAF9',   // Lightest Blue
    'lodging': '#BBDEFB',  // Pale Blue (General Lodging Type)

    // Shopping (Distinct Colors for each type)
    'store': '#4CAF50',    // Green
    'shop': '#8BC34A',     // Lime Green
    'mall': '#CDDC39',     // Lime
    'market': '#C0CA33',   // Darker Lime
    'retail': '#A4B42B',   // Even Darker Lime (General Retail Type)
    'market_place': '#9E9D24', // Khaki Green
    'supermarket': '#7CB342',// Darker Lime Green
    'clothes': '#AED581',  // Light Lime Green
    'shoe_shop': '#DCEDC8', // Lightest Green
    'toy_shop': '#FBC02D', // Mustard Yellow (Distinct)
    'bookshop': '#FDD835', // Light Mustard (Distinct)
    'jeweller': '#FFD54F', // Amber 400 (Distinct)

    // Tourism (Distinct Colors for each type)
    'attraction': '#FFD740', // Amber A700
    'tourism': '#FFEA00',  // Yellow A700 (General Tourism Type)
    'tourist': '#FFFF00',  // Pure Yellow
    'landmark': '#FFC400', // Amber A400
    'monument': '#FFA000', // Amber 900

    // Culture (Distinct Colors for each type)
    'museum': '#795548',   // Brown
    'gallery': '#A1887F',  // Light Brown
    'theater': '#5D4037',  // Dark Brown
    'cinema': '#F06292',   // Pink (Distinct Color)
    'cultural': '#6D4C41', // Medium Dark Brown (General Culture Type)
    'arts_centre': '#8D6E63', // Medium Brown
    'theatre': '#5D4037',  // Same as 'theater'
    'library': '#009688',  // Teal (Distinct Color)

    // Outdoors (Distinct Colors for each type)
    'park': '#66BB6A',     // Medium Green
    'garden': '#43A047',   // Green 700
    'trail': '#388E3C',    // Green 800
    'nature': '#2E7D32',   // Green 900 (General Nature Type)
    'outdoor': '#C5E1A5',  // Light Green 200 (General Outdoor Type)
    'peak': '#DCEDC8',     // Light Green 100
    'cliff': '#F1F8E9',    // Light Green 50
    'beach': '#E1F5FE',    // Very Light Blue (Distinct Color)
    'fountain': '#4FC3F7', // Light Blue 400 (Distinct Color)
    'viewpoint': '#80CBC4',// Teal 200 (Distinct Color)
    'bench': '#B2DFDB',    // Teal 100 (Distinct Color)
    'tree': '#C5CAE9',     // Indigo 100 (Distinct Color)
    'playground': '#E1BEE7',// Purple 100 (Distinct Color)

    // Health (Distinct Colors for each type)
    'hospital': '#F44336', // Red
    'clinic': '#E53935',   // Red 600
    'pharmacy': '#D32F2F', // Red 700
    'medical': '#C62828',  // Red 800 (General Medical Type)
    'healthcare': '#B71C1C',// Red 900 (General Healthcare Type)

    // Education (Distinct Colors for each type)
    'school': '#673AB7',   // Deep Purple
    'university': '#5E35B1',// Deep Purple 600
    'college': '#512DA8',  // Deep Purple 700
    'library': '#BA68C8',  // Purple 300 (Distinct Color)
    'education': '#4527A0',// Deep Purple 800 (General Education Type)

    // Transport (Distinct Colors for each type)
    'transport': '#CFD8DC',// Grey Blue 100 (General Transport Type)
    'station': '#B0BEC5',  // Grey Blue 200
    'airport': '#90A4AE',  // Grey Blue 300
    'bus': '#78909C',      // Grey Blue 400
    'train': '#607D8B',    // Grey Blue 500

    // Entertainment (Distinct Colors for each type)
    'entertainment': '#F8BBD0', // Pink 100 (General Entertainment Type)
    'club': '#F48FB1',     // Pink 200
    'casino': '#C2185B',   // Pink 800
    'amusement': '#AD1457',// Pink 900
    'arcade': '#880E4F',   // Pink A700
    'cinema': '#F06292',   // Pink 300 (Distinct Color)
    'zoo': '#EC407A',      // Pink 400 (Distinct Color)
    'golf_course': '#FFECB3',// Amber 100 (Distinct Color)
    'stadium': '#FFCC80',  // Orange 200 (Distinct Color)
    'sports_centre': '#FFA726',// Orange 400 (Distinct Color)

    // Religious (Specific Colors as requested)
    'jewish': '#AB47BC',           // Distinct Purple
    'muslim': '#FFF176',         // Yellow (Base Muslim)
    'christian_protestant': '#64B5F6', // Distinct Light Blue (Christian Shade 1)
    'sikh': '#00BFA5',             // Distinct Teal/Cyan
    'christian': '#42A5F5',        // Medium Blue (Base Christian)
    'muslim_shia': '#FFEE58',      // Darker Yellow (Muslim Shade 1)
    'buddhist': '#7CB342',         // Distinct Lime Green
    'christian_catholic': '#90CAF9', // Lighter Blue (Christian Shade 2)
    'hindu': '#FFB74D',            // Orange
    'muslim_sunni': '#FFEB3B',     // Darkest Yellow (Muslim Shade 2)

    // Historical (Distinct Colors for each type)
    'archaeological': '#9E9E9E',// Grey 500
    'ruins': '#BDBDBD',   // Grey 400
    'memorial': '#616161', // Grey 700
    'monument': '#424242', // Grey 800

    // Water Resources (Distinct Colors for each type)
    'dam': '#004D40',      // Dark Teal 900
    'water_well': '#80CBC4', // Teal 200
    'river': '#4DB6AC',    // Teal 300
    'lake': '#26A69A',     // Teal 400
    'waterfall': '#00796B',// Teal 700
    'canal': '#00695C',    // Teal 800
    'reservoir': '#00BCD4',// Cyan 500

    'default': '#FAFAFA'   // Very Light Grey (Default)
};

// Keywords to color map
const keywordColors = {};

// Base API URL 
const API_BASE_URL = 'http://localhost:5000'

// Load initial user location
loadUserLocation();

function loadUserLocation() {
    fetch(`${API_BASE_URL}/api/user-location`)
        .then(response => {
            if (!response.ok) {
                // Attempt to use Geolocation API as a fallback
                return new Promise((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                });
                            },
                            (error) => {
                                console.error('Geolocation failed:', error);
                                reject(new Error('Geolocation failed: ' + error.message));
                            }
                        );
                    } else {
                        reject(new Error('Geolocation is not supported by this browser.'));
                    }
                });
            }
            return response.json();
        })
        .then(data => {
            initMap(data.latitude, data.longitude);
        })
        .catch(error => {
            console.error('Error loading user location:', error);

            // Default to a generic location if user location can't be obtained via API or Geolocation
            initMap(40.7128, -74.0060); // New York City
            showError('Could not determine your location. Using default location instead.');
        });
}


function initMap(lat, lng) {
    // Check if map already initialized to prevent re-initialization
    if (map) {
        map.remove(); // Remove existing map instance
    }

    // Initialize the map
    map = L.map('map').setView([lat, lng], 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add user marker
    userMarker = L.marker([lat, lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);
    userMarker.bindPopup('Your Location').openPopup();

    // Add map legend
    addMapLegend();

    // Set up event listeners
    setupEventListeners();
}

function addMapLegend() {
    // Create legend control
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<h4>Place Types</h4>';

        // Get a representative set of colors for the legend
        // Selecting a few distinct types from different categories
        const legendItems = [
            { type: 'restaurant', label: 'Restaurant' },
            { type: 'hotel', label: 'Hotel' },
            { type: 'store', label: 'Store/Shop' },
            { type: 'attraction', label: 'Attraction' },
            { type: 'museum', label: 'Museum' },
            { type: 'park', label: 'Park' },
            { type: 'hospital', label: 'Hospital' },
            { type: 'school', label: 'School' },
            { type: 'station', label: 'Transport Station' },
            { type: 'cinema', label: 'Cinema/Theater' },
             { type: 'christian', label: 'Christian Site' }, // Use base religious types
             { type: 'muslim', label: 'Muslim Site' },
             { type: 'hindu', label: 'Hindu Site' },
             { type: 'jewish', label: 'Jewish Site' },
             { type: 'buddhist', label: 'Buddhist Site' },
             { type: 'sikh', label: 'Sikh Site' },
            { type: 'monument', label: 'Monument/Historical' },
            { type: 'lake', label: 'Water Body' }, // Use a representative water type
             { type: 'default', label: 'Other' } // Add default
        ];

        // Add items to legend
        legendItems.forEach(item => {
            const color = typeColors[item.type] || typeColors['default'];
            div.innerHTML += `
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: ${color}"></div>
                        <div>${item.label}</div>
                    </div>
                `;
        });

        // Add 'Your Location' to legend separately
        div.innerHTML += `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #2196F3"></div> <div>Your Location</div>
                </div>
            `;

        return div;
    };

    // Check if legend already exists before adding
     if (!map.hasLayer(legend)) {
         legend.addTo(map);
     }
}


function setupEventListeners() {
    // Add event listener for search button
    document.getElementById('searchButton').addEventListener('click', performSearch);

    // Add event listener for enter key on search input
    document.getElementById('query').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = document.getElementById('query').value.trim();

    if (!query) {
        showError('Please enter a search query');
        return;
    }

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';

    // Clear previous results
    clearResults();

    // Clear previous errors
    clearErrors();

    // Get user's current location from the map
    const userLat = userMarker.getLatLng().lat;
    const userLng = userMarker.getLatLng().lng;

    // Make API request
    fetch(`${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}&lat=${userLat}&lng=${userLng}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Search request failed');
            }
            return response.json();
        })
        .then(data => {
            // Process and display results
            processSearchResults(data);
        })
        .catch(error => {
            console.error('Error during search:', error);
            showError('An error occurred while searching. Please try again. Details: ' + error.message); // Include error message
        })
        .finally(() => {
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
        });
}

function processSearchResults(data) {
    if (!data || !data.places || data.places.length === 0) {
        showError('No results found for your search');
        return;
    }

    // Extract keywords for color assignment (if backend provides them)
    if (data.keywords && data.keywords.length > 0) {
        searchedKeywords = data.keywords;
        assignColorsToKeywords(data.keywords);
        displaySearchKeywords(data.keywords);
    }

    // Display query interpretation if available
    if (data.queryInfo) {
        displayQueryInfo(data.queryInfo);
    }

    // Add places to map and results list
    addPlacesToMap(data.places);
    displayResultsList(data.places);

    // Adjust map bounds to show all results
    fitMapToBounds(data.places);
}

function assignColorsToKeywords(keywords) {
    // Generate colors for keywords - using a small distinct palette
    const keywordPalette = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', // Reds, Pinks, Purples
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', // Indigos, Blues, Cyans
        '#009688', '#4caf50', '#8bc34a', '#cddc39', // Teals, Greens, Limes
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', // Yellows, Ambers, Oranges
        '#795548', '#607d8b', '#9e9e9e', '#616161' // Browns, Grey-Blues, Greys
    ];

    keywords.forEach((keyword, index) => {
        // Ensure uniqueness if possible, cycle through palette
         if (!keywordColors[keyword]) {
             keywordColors[keyword] = keywordPalette[Object.keys(keywordColors).length % keywordPalette.length];
         }
    });
}

function displaySearchKeywords(keywords) {
    const keywordsContainer = document.getElementById('search-keywords');

    if (keywords && keywords.length > 0) {
        let html = '<strong>Search Keywords:</strong> ';
        html += keywords.map(keyword => {
            const color = getKeywordColor(keyword) || '#9E9E9E'; // Fallback to grey
            const textColor = isLightColor(color) ? '#000' : '#fff';
            return `<span class="keyword-tag" style="background-color: ${color}; color: ${textColor}">${keyword}</span>`;
        }).join(' ');

        keywordsContainer.innerHTML = html;
        keywordsContainer.style.display = 'block';
    } else {
        keywordsContainer.style.display = 'none';
    }
}

function displayQueryInfo(queryInfo) {
    const queryInfoContainer = document.getElementById('query-info');

    if (queryInfo) {
        queryInfoContainer.innerHTML = `<strong>We understood your query as:</strong> ${queryInfo}`;
        queryInfoContainer.style.display = 'block';
    } else {
        queryInfoContainer.style.display = 'none';
    }
}

function addPlacesToMap(places) {
    // Clear existing markers and shapes
    clearMarkers();

    places.forEach(place => {
        const type = place.type?.toLowerCase() || 'default';
        const color = getColorForType(type);

        // Function to create a popup
        const createPopupContent = (placeData) => {
            let content = `<strong>${placeData.name}</strong><br>`;
            // Include common properties if they exist
            if (placeData.address) content += `${placeData.address}<br>`;
            if (placeData.distance !== undefined && placeData.distance !== null) content += `${placeData.distance.toFixed(1)} km away<br>`;
            if (placeData.rating !== undefined && placeData.rating !== null) content += `Rating: ${placeData.rating} ⭐<br>`;
             if (placeData.source_file) content += `Source: ${placeData.source_file}<br>`;

            // Add description if available
            if (placeData.description) content += `<div class="place-description">${placeData.description}</div>`;

             // Add any other keys found in the place object, excluding geometry, type, name, address, distance, rating, source_file, description, keywords, id, latitude, longitude
             const excludedKeys = ['geometry', 'type', 'name', 'address', 'distance', 'rating', 'source_file', 'description', 'keywords', 'id', 'latitude', 'longitude'];
             const otherDetails = Object.keys(placeData).filter(key => !excludedKeys.includes(key) && placeData[key] !== undefined && placeData[key] !== null);

             if (otherDetails.length > 0) {
                 content += '<br><strong>Details:</strong><br>';
                 otherDetails.forEach(key => {
                     // Capitalize the key name for display
                     const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                     content += `<em>${displayKey}:</em> ${placeData[key]}<br>`;
                 });
             }


            return content;
        };

        let leafletLayer = null;

        if (place.geometry && place.geometry.type === 'Point' && place.latitude !== null && place.longitude !== null) {
            leafletLayer = L.marker([place.latitude, place.longitude], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                })
            }).addTo(map);
        } else if (place.geometry && (place.geometry.type === 'Polygon' || place.geometry.type === 'MultiPolygon') && place.geometry.coordinates) {
            // GeoJSON coordinates need to be [latitude, longitude] for Leaflet
            // GeoJSON specifies [longitude, latitude] - so we need to flip them
            let leafletCoordinates;
            if (place.geometry.type === 'Polygon') {
                 leafletCoordinates = place.geometry.coordinates.map(ring => ring.map(coord => [coord[1], coord[0]]));
                 leafletLayer = L.polygon(leafletCoordinates, {
                     color: color,
                     fillOpacity: 0.3
                 }).addTo(map);
            } else if (place.geometry.type === 'MultiPolygon') {
                 leafletCoordinates = place.geometry.coordinates.map(polygon => polygon.map(ring => ring.map(coord => [coord[1], coord[0]])));
                 leafletLayer = L.polygon(leafletCoordinates, {
                     color: color,
                     fillOpacity: 0.3
                 }).addTo(map);
            }
        } else if (place.latitude !== undefined && place.longitude !== undefined && place.latitude !== null && place.longitude !== null) {
             // Fallback: If no geometry but lat/lng are available, add as a simple marker
             leafletLayer = L.marker([place.latitude, place.longitude], {
                  icon: L.divIcon({
                     className: 'custom-marker',
                     html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                     iconSize: [14, 14],
                     iconAnchor: [7, 7]
                 })
             }).addTo(map);

        }
        else {
            console.warn("Unsupported geometry type or missing coordinates/lat/lng:", place);
        }


        if (leafletLayer) {
            leafletLayer.bindPopup(createPopupContent(place));
            markers.push({ id: place.id, layer: leafletLayer, originalColor: color }); // Store layer and original color
        }
    });
}


function displayResultsList(places) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    places.forEach(place => {
        const type = place.type?.toLowerCase() || 'default';
        const color = getColorForType(type);
        const textColor = isLightColor(color) ? '#000' : '#fff';

        // Create place card
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.setAttribute('data-id', place.id);
        placeCard.style.borderColor = '#ddd'; // Default border color

        // Prepare keywords HTML if available
        let keywordsHtml = '';
        if (place.keywords && place.keywords.length > 0) {
            keywordsHtml = '<div class="keyword-tags">';
            place.keywords.forEach(keyword => {
                const kwColor = getKeywordColor(keyword); // Use the new keyword color function
                const kwTextColor = isLightColor(kwColor) ? '#000' : '#fff';
                keywordsHtml += `<span class="keyword-tag" style="background-color: ${kwColor}; color: ${kwTextColor}">${keyword}</span>`;
            });
            keywordsHtml += '</div>';
        }

        // Build card HTML
        placeCard.innerHTML = `
                <strong>${place.name}</strong>
                <span class="place-type" style="background-color: ${color}; color: ${textColor}">${capitalizeFirstLetter(type)}</span>
                ${keywordsHtml}
                <div>${place.address || ''}</div>
                ${place.distance !== undefined && place.distance !== null ? `<div>${place.distance.toFixed(1)} km away</div>` : ''}
                ${place.rating !== undefined && place.rating !== null ? `<div>Rating: ${place.rating} ⭐</div>` : ''}
                ${place.description ? `<div class="place-description">${place.description}</div>` : ''}
            `;

        // Add click event
        placeCard.addEventListener('click', () => {
            // Find the corresponding Leaflet layer
            const layerInfo = markers.find(m => m.id === place.id);
            if (layerInfo && layerInfo.layer) {
                const layer = layerInfo.layer;
                let latLng;

                if (layer.getBounds) { // For polygons and multi-polygons, get the center
                    latLng = layer.getBounds().getCenter();
                     // Open popup for polygons/multipolygons on click
                     layer.openPopup();
                } else if (layer.getLatLng) { // For markers
                    latLng = layer.getLatLng();
                    layer.openPopup(); // Open popup for markers on click
                }

                if (latLng) {
                    map.setView(latLng, Math.max(14, map.getZoom())); // Pan and zoom

                    // Highlight the layer
                    resetHighlight(); // Reset any previous highlights
                    highlightLayer(layer, layerInfo.originalColor); // Pass original color

                    // Highlight the selected card
                    document.querySelectorAll('.place-card').forEach(card => {
                        card.style.border = '1px solid #ddd';
                    });
                    placeCard.style.border = '2px solid #4CAF50'; // Highlight clicked card
                }
            }
        });

        resultsContainer.appendChild(placeCard);
    });
}

// Function to highlight a layer (marker or shape)
let highlightedLayer = null;
let originalLayerStyle = null;

function highlightLayer(layer, originalColor) {
     // Reset previous highlight
     if (highlightedLayer) {
         resetHighlight();
     }

     highlightedLayer = { layer: layer, originalColor: originalColor };

     if (layer.setStyle) { // For polygons/multipolygons
         originalLayerStyle = {
             color: layer.options.color,
             weight: layer.options.weight,
             opacity: layer.options.opacity,
             fillOpacity: layer.options.fillOpacity
         };
         layer.setStyle({
             color: '#00FFFF', // Cyan highlight color
             weight: 4,
             opacity: 1,
             fillOpacity: 0.5
         });
     } else if (layer.getElement) { // For DivIcons (custom markers)
          // Temporarily increase size or add a glow effect via CSS class or direct style
          // Adding a simple pulse animation might be better visually
          // For simplicity, let's just slightly change the border color/width or add a class
          const markerElement = layer.getElement().querySelector('div');
          if (markerElement) {
              // Store original style if needed, but easier to just apply a class
              markerElement.classList.add('pulse-marker'); // Requires CSS for .pulse-marker
              // Or direct style change:
              // markerElement.style.borderColor = '#00FFFF'; // Cyan border
              // markerElement.style.borderWidth = '3px';
          }
     }
     // Note: Default Leaflet markers are harder to restyle directly this way.
     // The custom DivIcon approach is more flexible.
}

function resetHighlight() {
    if (highlightedLayer) {
        const layerInfo = highlightedLayer;
        if (layerInfo.layer.setStyle && originalLayerStyle) { // For polygons/multipolygons
            layerInfo.layer.setStyle(originalLayerStyle);
            originalLayerStyle = null; // Clear stored style
        } else if (layerInfo.layer.getElement) { // For DivIcons
             const markerElement = layerInfo.layer.getElement().querySelector('div');
              if (markerElement) {
                 markerElement.classList.remove('pulse-marker');
                 // Or reset direct style:
                 // markerElement.style.borderColor = 'white';
                 // markerElement.style.borderWidth = '2px';
              }
        }
        highlightedLayer = null; // Clear highlighted layer reference
    }
}


function fitMapToBounds(places) {
    if (places.length === 0 && !userMarker) return;

    // Create bounds object, initialize with user location if available
    const bounds = userMarker ? L.latLngBounds([userMarker.getLatLng()]) : L.latLngBounds();

    // Add all place locations or geometry bounds
    places.forEach(place => {
         if (place.geometry && place.geometry.type === 'Point' && place.latitude !== null && place.longitude !== null) {
              bounds.extend([place.latitude, place.longitude]);
         } else if (place.geometry && (place.geometry.type === 'Polygon' || place.geometry.type === 'MultiPolygon') && place.geometry.coordinates) {
             // Need to convert GeoJSON coords to Leaflet LatLngs to get bounds
             let leafletCoordinates;
             if (place.geometry.type === 'Polygon') {
                  leafletCoordinates = place.geometry.coordinates.map(ring => ring.map(coord => [coord[1], coord[0]]));
             } else if (place.geometry.type === 'MultiPolygon') {
                  leafletCoordinates = place.geometry.coordinates.map(polygon => polygon.map(ring => ring.map(coord => [coord[1], coord[0]]))).flat(2); // Flatten to process all points
             }
              if (leafletCoordinates && leafletCoordinates.length > 0) {
                  bounds.extend(L.latLngBounds(leafletCoordinates.map(coord => L.latLng(coord[0], coord[1]))));
              }
         } else if (place.latitude !== undefined && place.longitude !== undefined && place.latitude !== null && place.longitude !== null) {
              // Fallback for places with just lat/lng
              bounds.extend([place.latitude, place.longitude]);
         }
    });


    // Only fit bounds if it contains valid points (user marker or places)
    if (bounds.isValid()) {
         map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userMarker) {
        // If only user marker is present, just set view to user location
        map.setView(userMarker.getLatLng(), 13);
    }
}


function clearResults() {
    document.getElementById('results').innerHTML = '';
    document.getElementById('search-keywords').style.display = 'none';
    document.getElementById('query-info').style.display = 'none';
    clearMarkers();
    resetHighlight(); // Also clear highlight on results clear
     // Reset card borders in the results list (though clearing results does this)
     document.querySelectorAll('.place-card').forEach(card => {
         card.style.border = '1px solid #ddd';
     });
}

function clearMarkers() {
    // Remove all place layers from the map
    markers.forEach(item => {
        if (map && item.layer) { // Check if map and layer exist
            map.removeLayer(item.layer);
        }
    });
    markers = []; // Clear the markers array
}


function clearErrors() {
    document.getElementById('error-container').innerHTML = '';
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    document.getElementById('loading').style.display = 'none';
}

function getColorForType(type) {
    const lowerType = type?.toLowerCase();
    // Check if exact type exists in our color map
    if (typeColors[lowerType]) {
        return typeColors[lowerType];
    }

     // Optional: Fallback to a color based on a more general type if specific not found
     // This requires mapping specific types to general ones, which isn't in typeColors.
     // Sticking to direct lookup for now as per the distinct color per type requirement.

    // Return default color if no match
    return typeColors['default'];
}

function getKeywordColor(keyword) {
     const lowerKeyword = keyword?.toLowerCase();
     // Return color assigned to the keyword
     return keywordColors[lowerKeyword] || '#9E9E9E'; // Fallback to default grey if no color assigned
}


function isLightColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate relative luminance (more accurate than simple average)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if color is light (threshold 0.5 is common)
    return luminance > 0.5;
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Optional: Add CSS for the pulse-marker class if you want a visual highlight effect on custom markers
/*
// Example CSS in your <style> block:
@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7); } // Cyan glow
  70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
}
.pulse-marker div { // Target the inner div of the custom marker
    animation: pulse 1.5s infinite;
    border-color: #00FFFF !important; // Ensure highlight color
}
*/