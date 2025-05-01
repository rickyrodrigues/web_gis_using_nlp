# Web GIS–NLP Geospatial Query System

A lightweight, web-based **Geospatial Information System (GIS)** that integrates **Natural Language Processing (NLP)** and **interactive mapping** to help users intuitively query and visualize spatial data.

This system is designed to address the geospatial data challenges faced by **government bodies**, **regional planning agencies**, and **geospatial analysts**, with a focus on India’s evolving geospatial ecosystem.

---

## Key Features

### 🗺️ Natural Language Query Support
Query spatial data using simple, plain-language commands:
- **“Mark forests in a wide region”** → Highlights all forests within a 200 km radius.
- **“Show religious places in Mumbai”** → Displays religious sites within 50 km of Mumbai.
- **“Show transport stations nearby”** → Visualizes transport hubs within 2 km of the user's location.

### 📍 Location-Aware Filtering
Automatically detects the user’s location (or a specified point) and filters geospatial features within user-defined ranges.

### 📂 Custom Dataset Support
Regional planning bodies and users can:
- Upload their own **GeoJSON datasets** into the `data/` folder.
- Define associated **keywords** in the backend keyword section.
- Seamlessly query their custom datasets — no hardcoded datasets required.

### ⚡ Low Compute Requirement
Optimized to run smoothly on **low-power devices**, making it accessible to organizations without heavy computing infrastructure.

---

## Architecture Overview

| Layer        | Tools / Libraries            |
|--------------|------------------------------|
| **Frontend** | HTML, CSS, JavaScript, Leaflet.js, OpenStreetMap |
| **Backend**  | Python (Flask, glob, GeoJSON) |
| **NLP Engine** | Gemini API (for query parsing) |

### Backend (Python + Flask)
- **Flask:** REST API server
- **glob, GeoJSON:** Dataset handling, filtering, and feature extraction
- **Gemini API:** NLP query parsing

### Frontend (Web)
- Interactive maps with **Leaflet.js** and **OpenStreetMap**
- REST API integration for dynamic visualization

---

## Example Use Cases

- **Government & Urban Planning:** Upload and query land use, forest cover, transport, or administrative boundary data for decision-making.
- **Environmental Monitoring:** Visualize forests, rivers, wetlands, and other features in sensitive or strategic zones.
- **Tourism & Infrastructure Development:** Locate religious sites, transport hubs, and other points of interest within custom distances.

---

## Why This System?

✅ Solves **India-specific** geospatial data challenges  
✅ Easily **customizable** for regional datasets and localized queries  
✅ **Lightweight** alternative to conventional GIS platforms  
✅ Empowers users with **NLP** — no GIS expertise required

---

## Getting Started

Follow these steps to install and run the project locally:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/web-gis-nlp.git
cd web-gis-nlp

### 2️⃣ Install Python Dependencies

Ensure you have **Python 3.x** installed on your system.

Install all required libraries by running:

```bash
pip install -r requirements.txt

###3️⃣ Add Your Gemini API Key
In the backend configuration file config.py, add your Gemini API Key:

python
Copy
Edit
GEMINI_API_KEY = "your_api_key_here"

###4️⃣ Add Your Geospatial Data
Place your GeoJSON datasets into the data/ folder.

In the backend keyword section keywords.py, map relevant keywords to dataset names:

keywords = {
    "forests": "forests.geojson",
    "religious places": "religious_places.geojson",
    "transport stations": "transport_stations.geojson"
}

###5️⃣ Configure Flask Template Path
In index.py, set the path to the frontend folder:

python
Copy
Edit
app = Flask(__name__, template_folder='frontend')

###6️⃣ Run the Application
Run the backend server:

bash
Copy
Edit
python index.py



