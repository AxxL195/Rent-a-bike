import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Bike } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'react-router-dom';

// Fix default icon issue with Leaflet + React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Shop {
  id: string;
  name: string;
  location: {
    coordinates: [number, number];
  };
  address: string;
  rating?: number;
  totalBikes?: number;
}

// Custom emerald pin marker for shops
const createEmeraldMarker = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="position: relative; width: 32px; height: 32px;">
            <svg width="32" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 6 12 20 12 20s12-14 12-20c0-6.63-5.37-12-12-12z" fill="#059669" stroke="white" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="3.5" fill="white"/>
            </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Custom blue dot marker for user location
const createUserLocationMarker = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `<div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
            <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Recenter map when userLocation changes
const RecenterMap = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const NearbyMap: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [userLocation, setUserLocation] = useState<L.LatLngExpression | null>(null);
  const [userAccuracy, setUserAccuracy] = useState<number>(50);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const zoom = 14;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setUserLocation([28.6139, 77.2090]);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation([latitude, longitude]);
        setUserAccuracy(accuracy);
      },
      (err) => {
        console.error(err);
        setError('Unable to get your location. Showing default area.');
        setUserLocation([28.6139, 77.2090]);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchShops = async () => {
      setLoading(true);
      try {
        const [lat, lng] = userLocation as [number, number];
        const response = await axios.get('http://localhost:5000/api/v1/shops/nearby', {
          params: { lat, lng, limit: 10 },
        });
        setShops(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load nearby shops.');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [userLocation]);

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading nearby shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-xl border border-red-200">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 rounded-lg text-sm hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
      <MapContainer
        center={userLocation}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB'
        />
        <RecenterMap center={userLocation} />

        {/* User accuracy circle */}
        <Circle
          center={userLocation}
          radius={userAccuracy}
          pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.15, weight: 1 }}
        />

        {/* User location marker */}
        <Marker position={userLocation} icon={createUserLocationMarker()} />

        {/* Shop markers – now using green pin shape */}
        {shops.map((shop) => {
          const [lng, lat] = shop.location.coordinates;
          const position: L.LatLngExpression = [lat, lng];
          return (
            <Marker key={shop.id} position={position} icon={createEmeraldMarker()}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-800 text-lg">{shop.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{shop.address}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    {shop.rating && (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span> {shop.rating}
                      </span>
                    )}
                    {shop.totalBikes && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Bike className="h-3 w-3" /> {shop.totalBikes} bikes
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => (window.location.href = `/customer/${customerId}/shops/${shop.id}`)}
                    className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-1.5 rounded-lg transition shadow-sm"
                  >
                    View Shop
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="bg-white px-4 py-2 text-xs text-gray-500 border-t border-gray-100 text-center">
        <span className="inline-block w-3 h-3 bg-emerald-600 rounded-full mr-1"></span> Rental shops &nbsp;&nbsp;
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Your location
      </div>
    </div>
  );
};

export default NearbyMap;