// src/pages/customer/CustomerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Map, ChevronRight, Loader, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Search from './Search';
import ShopCard from '../../../components/cards/ShopCard';
import NearbyMap from '../../../components/map/NearbyMap';


const CustomerDashboard: React.FC = () => {
  // const {customerId} = useParams<{ customerId: string }>();
  // const navigate = useNavigate();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          setLoading(true);
          setError(null);
          try {
            console.log("calling API...")
            const response = await axios.get(`http://localhost:5000/api/v1/shops/nearby`, 
              {
                params: {
                  lat:latitude,
                  lng:longitude,
                  limit: 10
                }
            });

            console.log('Nearby shops response:', response.data);
            console.log('Shop details:', response.data.map((s: any) => ({ 
              id: s.id,
              name: s.name, 
              image: s.image,
              hasImage: !!s.image
            })));
            setShops(Array.isArray(response.data) ? response.data : []);
            
          } catch (err: any) {
            console.log('Failed to load nearby shops:', err);
            setError('Unable to load shops. Please try searching manually.');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Location access denied. Please search manually.');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleSearchResults = (results: any[]) => {
    setShops(results);
    
    setError(null);
  };

  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Search onSearchResults={handleSearchResults} onLoading={setLoading} />

        {/* Rental Shops Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Rental Shops
            </h2>
            {shops.length > 0 && (
              <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-2xl text-center">
              {error}
            </div>
          ) : shops.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <p className="text-gray-500">No shops found within 10 km of your location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.isArray(shops) && shops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={{
                    id: shop.id,
                    name: shop.name,
                    distance: shop.distance,
                    rating: shop.rating || 0,
                    bikesAvailable: shop.totalBikes || 0,
                    image: shop.image,
                    address: shop.address,
                  }}
                  
                />
              ))}
            </div>
          )}
        </section>

        {/* Map Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-600" /> Nearby on Map
            </h2>
            <NearbyMap />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;