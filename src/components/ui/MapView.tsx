import React from 'react';

interface MapViewProps {
  center: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; title: string }>;
  zoom?: number;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  center,
  markers = [],
  zoom = 14,
  className = '',
}) => {
  // In a real implementation, you would use a library like Leaflet or Google Maps.
  // Here we'll use a placeholder image to simulate a map.
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=600x300&markers=color:red%7C${center.lat},${center.lng}&key=YOUR_API_KEY`;

  return (
    <div className={`bg-gray-200 rounded-xl overflow-hidden relative ${className}`}>
      <img
        src={mapUrl}
        alt="Map"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if API key not set
          e.currentTarget.src = 'https://via.placeholder.com/600x300?text=Map+Placeholder';
        }}
      />
      {markers.map((marker, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 bg-emerald-600 rounded-full border-2 border-white shadow"
          style={{ top: `${(marker.lat - center.lat) * 100}%`, left: `${(marker.lng - center.lng) * 100}%` }}
        />
      ))}
    </div>
  );
};

export default MapView;