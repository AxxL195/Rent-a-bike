// src/pages/owner/ShopManagement.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Bike,
  Edit,
  Trash2,
  PlusCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Loader,
} from 'lucide-react';
import OwnerNav from '../ownerdashboard/OwnerNav';

interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email?: string;
  openingHours: string;
  closingHours: string;
}

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

const ShopManagement: React.FC = () => {
  const {ownerId, shopId } = useParams<{ ownerId: string; shopId: string }>();
 
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    // Validate shopId
    if (!shopId) {
      setError('Shop ID is missing');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      console.log("Owner ID from params:", ownerId);
      console.log("Shop ID from params:", shopId);
      try {
        const [shopRes, bikesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/shops/myshops/${shopId}`,{
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`http://localhost:5000/api/v1/bikes/myBikes/${shopId}`,{
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        console.log('Shop API response:', shopRes.data);
        console.log('Bikes API response:', bikesRes.data);
        setShop(shopRes.data.data || shopRes.data);
        const bikesData= bikesRes.data.data || bikesRes.data;
        setBikes(
            bikesData.map((bike: any) => ({
              ...bike,
              id: bike._id   
        }))
      );
        setError(null);
      } catch (err: any) {
        console.error('API error:', err);
        if (import.meta.env.DEV) {
          // Use mock data for development
          setShop(null);
          setBikes([]);
          setError(null);
        } else {
          setError(err.response?.data?.message || 'Failed to load shop data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shopId]);

  const handleDeleteBike = async (bikeId: string) => {
    if (!confirm('Are you sure you want to delete this bike?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/bikes/${bikeId}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBikes(bikes.filter(b => b.id !== bikeId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OwnerNav />
        <div className="flex items-center justify-center h-96">
          <Loader className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OwnerNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(`/owner/${ownerId}/dashboard`)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center gap-2">
            <AlertCircle className="h-12 w-12" />
            <p className="text-lg font-semibold">Oops! Something went wrong</p>
            <p>{error || 'Shop not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <OwnerNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(`/owner/${ownerId}/dashboard`)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Shop Information Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
              <p className="text-gray-600 mt-1">Manage shop details and bike inventory</p>
            </div>
            <Link
              to={`/owner/shop/${shop.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
            >
              <Edit className="h-4 w-4" /> Edit Shop
            </Link>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>{shop.address}, {shop.city} - {shop.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>{shop.phone}</span>
              </div>
              {shop.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span>{shop.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>{shop.openingHours} – {shop.closingHours}</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Bikes Management Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bikes in this Shop</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your bike inventory</p>
            </div>
            <Link
              to={`/owner/shop/${shop.id}/bikes/new`}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-md"
            >
              <PlusCircle className="h-4 w-4" /> Add New Bike
            </Link>
          </div>

          {bikes.length === 0 ? (
            <div className="p-12 text-center">
              <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">No bikes yet</h3>
              <p className="text-gray-600 mt-2">Add your first bike to start listing.</p>
              <Link
                to={`/owner/shop/${shop.id}/bikes/new`}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <PlusCircle className="h-4 w-4" /> Add Bike
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bikes.map((bike) => (
                    <tr key={bike.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* <img src={bike.images?.[0] || "https://via.placeholder.com/40"}  alt={bike.name} className="h-10 w-10 rounded-full object-cover" /> */}
                          <div>
                            <div className="font-medium text-gray-900">{bike.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{bike.transmission}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize">{bike.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{bike.pricePerDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          bike.availability === 'available' ? 'bg-green-100 text-green-800' :
                          bike.availability === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bike.availability.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/owner/shop/${shop.id}/bikes/${bike.id}/edit`}
                            className="p-1 text-emerald-600 hover:text-emerald-800 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBike(bike.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;