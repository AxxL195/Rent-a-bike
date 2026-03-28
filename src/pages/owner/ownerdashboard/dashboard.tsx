// src/pages/owner/OwnerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store, Bike, Calendar, DollarSign, PlusCircle, ArrowRight } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  address: string;
  totalBikes: number;
  totalBookings: number;
  earnings?: number;
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('/api/shops/owner'); // endpoint to get owner's shops
        setShops(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load shops');
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleAddShop = () => {
    navigate('/owner/shop/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your rental business</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleAddShop}
            className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition group"
          >
            <div>
              <p className="text-sm text-gray-500">Add New Shop</p>
              <p className="text-lg font-semibold">Create Shop</p>
            </div>
            <PlusCircle className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition" />
          </button>

          <Link
            to="/owner/bookings"
            className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition group"
          >
            <div>
              <p className="text-sm text-gray-500">Booking Requests</p>
              <p className="text-lg font-semibold">View Requests</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition" />
          </Link>

          <Link
            to="/owner/earnings"
            className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition group"
          >
            <div>
              <p className="text-sm text-gray-500">Earnings</p>
              <p className="text-lg font-semibold">This Month</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition" />
          </Link>
        </div>

        {/* Shops List */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rental Shops</h2>
        {shops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No shops yet</h3>
            <p className="text-gray-600 mt-2">Create your first rental shop to start listing bikes.</p>
            <button
              onClick={handleAddShop}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              <PlusCircle className="h-4 w-4" /> Add Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{shop.address}</p>
                    </div>
                    <Link
                      to={`/owner/shop/${shop.id}/bikes`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
                    >
                      Manage <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Bikes</p>
                      <p className="text-xl font-bold text-gray-800">{shop.totalBikes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Bookings</p>
                      <p className="text-xl font-bold text-gray-800">{shop.totalBookings}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link
                      to={`/owner/shop/${shop.id}/bikes/new`}
                      className="flex-1 text-center border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition"
                    >
                      Add Bike
                    </Link>
                    <Link
                      to={`/owner/shop/${shop.id}/bookings`}
                      className="flex-1 text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                      View Bookings
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;