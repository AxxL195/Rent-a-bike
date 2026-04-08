import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Bike } from 'lucide-react';

interface Bike {
  id: string;
  name: string;
  type: 'bike' | 'scooter';
  transmission: 'automatic' | 'manual';
  pricePerDay: number;
  description: string;
  images: string[];
  availability: 'available' | 'booked' | 'unavailable';
}

const ManageBikes: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBikes();
  }, [shopId]);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/bikes?shopId=${shopId}`);
      setBikes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bikes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bikeId: string) => {
    if (!confirm('Are you sure you want to delete this bike?')) return;
    try {
      await axios.delete(`/api/bikes/${bikeId}`);
      setBikes(bikes.filter(b => b.id !== bikeId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Bikes</h1>
          <button
            onClick={() => navigate(`/owner/shop/${shopId}/bikes/new`)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Bike
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
        ) : bikes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No bikes yet</h3>
            <p className="text-gray-600 mt-2">Add your first bike to start listing.</p>
            <button
              onClick={() => navigate(`/owner/shop/${shopId}/bikes/new`)}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Bike
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map(bike => (
              <div key={bike.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={bike.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    bike.availability === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bike.availability === 'booked'
                      ? 'bg-blue-100 text-amber-800'
                      : 'bg-blue-300 text-blue-800'
                  }`}>
                    {bike.availability}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{bike.name}</h3>
                  <div className="text-sm text-gray-500 capitalize">{bike.type} • {bike.transmission}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-emerald-600 font-bold text-xl">₹{bike.pricePerDay}</span>
                    <span className="text-gray-500 text-xs">per day</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/owner/shop/${shopId}/bikes/${bike.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1 border border-emerald-600 text-emerald-600 py-1 rounded-lg hover:bg-emerald-50 transition"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bike.id)}
                      className="flex-1 flex items-center justify-center gap-1 border border-red-600 text-red-600 py-1 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
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

export default ManageBikes;