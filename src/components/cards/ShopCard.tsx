// src/components/cards/ShopCard.tsx
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface ShopCardProps {
  shop: {
    id: string | number;
    name: string;
    distance?: string;
    rating: number;
    bikesAvailable: number;
    image: string;
    address?: string;
  };
  
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const customerId = useParams<{ customerId: string }>().customerId; // Get customerId from URL params
  console.log('ShopCard received shop:', shop);
  console.log('Image path would be:', `http://localhost:5000/uploads/${shop.image}`);
  const onViewBikes = () => {
    window.location.href = `/customer/${customerId}/shops/${shop.id}`; // Replace '1' with actual customer ID
  }
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        {shop.image ? (
          <img
            src={`http://localhost:5000/uploads/${shop.image}`}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              console.error('Image failed to load:', shop.image);
              e.currentTarget.src = 'https://via.placeholder.com/300x150?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
            No image available
          </div>
        )}
        {/* Distance badge (if provided) */}
        {shop.distance && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold shadow-md text-gray-700">
            📍 {shop.distance}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{shop.name}</h3>
        
        {/* Rating & bikes count */}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
            <span>{shop.rating}</span>
          </div>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-sm text-gray-600">{shop.bikesAvailable} bikes</span>
        </div>

        {/* Optional address (if provided) */}
        {shop.address && (
          <div className="flex items-start gap-1 mt-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{shop.address}</span>
          </div>
        )}

        {/* Button */}
        <button
          onClick={onViewBikes}
          className="mt-3 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 rounded-xl transition-colors duration-200"
        >
          View Bikes
        </button>
      </div>
    </div>
  );
};

export default ShopCard;