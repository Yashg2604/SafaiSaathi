'use client';

import { useEffect } from 'react';
import L from 'leaflet';

let mapInstance = null; // Store map outside component

export default function Map() {
  useEffect(() => {
    if (mapInstance) {
      // Avoid re-initialization
      return;
    }

    mapInstance = L.map('map').setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance);

    L.marker([28.6139, 77.2090]).addTo(mapInstance)
      .bindPopup('Hello from Delhi!')
      .openPopup();

    // Cleanup if component unmounts
    return () => {
      mapInstance.remove();
      mapInstance = null;
    };
  }, []);

  return (
    <div
      id="map"
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    />
  );
}
