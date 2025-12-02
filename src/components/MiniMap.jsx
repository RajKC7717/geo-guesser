import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-compass/dist/leaflet-compass.min.css";
import "leaflet-compass";

// Component to handle clicks inside the map
const MapClickHandler = ({ setMarkerPosition, onGuessPlaced }) => {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]); // Set marker position
    onGuessPlaced({ lat, lng });   // Pass to parent component
    console.log("Clicked Coordinates:", lat, lng); // Debugging
  });

  return null; // This component does not render anything
};

const MiniMap = ({ onGuessPlaced }) => {
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      // Add compass control
      L.control.compass({ position: "bottomright" }).addTo(mapRef.current);
    }
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Center on India
      zoom={5}
      minZoom={4}
      maxZoom={50}
      style={{ width: "100%", height: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Click handler inside the map */}
      <MapClickHandler setMarkerPosition={setMarkerPosition} onGuessPlaced={onGuessPlaced} />

      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
};

export default MiniMap;
