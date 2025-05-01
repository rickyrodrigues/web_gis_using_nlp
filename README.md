Web GIS–NLP Geospatial Query System
A lightweight, web-based Geospatial Information System (GIS) that integrates Natural Language Processing (NLP) and interactive mapping to help users intuitively query and visualize spatial data.
Designed as a solution for challenges faced by government bodies, regional planning agencies, and geospatial analysts, particularly within the context of India’s evolving geospatial data ecosystem.

Key Features
Natural Language Query Support
Users can ask plain-language queries like:

“Mark forests in a wide region” — all forests within the specified region (e.g., 200 km) will be highlighted

“Show religious places in Mumbai” — religious sites within 50 km of Mumbai are displayed

“Show transport stations nearby” — transport hubs within 2 km of the user’s location will be visualized

Location-Aware Filtering
Automatically detects the user’s location or a specified reference point and filters geospatial features based on query-defined ranges.

Custom Dataset Support
Regional planning bodies can upload and work with their own  GeoJSON datasets seamlessly into data folder then add then keywords in backend keyword section and theybcan query their own dayasets using that — no hardcoded datasets.

Low Compute Requirement
Optimized to run efficiently on low-power devices (compared to heavyweight GIS platforms), making it accessible to organizations with limited resources.

Architecture Overview
Backend (Python + Flask)

Flask: REST API server

glob, GeoJSON: Dataset handling and filtering

Geospatial filtering and keyword extraction handled server-side

Frontend (Web)

HTML, CSS, JavaScript

Leaflet.js + OpenStreetMap for interactive maps

REST API integration to retrieve filtered data and visualize it dynamically

Example Use Cases
Government & Urban Planning
Regional authorities can upload land use, forest cover, transport infrastructure, or administrative boundary data and query it for decision-making.

Environmental Monitoring
Easily visualize forests, rivers, wetlands, and other features around specific regions or sensitive zones.

Tourism & Infrastructure Development
Locate religious sites, transport hubs, or other POIs within custom distances.

Why This System?
Solves India-specific geospatial data access problems

Customizable for regional datasets and localized queries

Lightweight compared to conventional GIS platforms

Empowers users with NLP — no complex GIS knowledge required

Tech Stack
Layer	Tools / Libraries
Frontend	HTML, CSS, JavaScript, Leaflet.js, OpenStreetMap
Backend	Python (Flask, glob, GeoJSON)
NLP Engine	Gemini (for query parsing)
