import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Bike as BikeIcon,
  Loader,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '../customerdashboard/Navbar';

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
  rating: number;
  totalRatings: number;
  images?: string[];
  description?: string;
  establishedYear?: number;
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

const ShopDetailsCustomer: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopAndBikes = async () => {
      if (!shopId) {
        setError('Shop ID is missing');
        setLoading(false);
        return;
      }

      try {
        const shopRes = await axios.get(`http://localhost:5000/api/v1/shops/shopDetails/${shopId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Shop data:', shopRes.data.data);
        setShop(shopRes.data.data);

        const bikesRes = await axios.get(`http://localhost:5000/api/v1/bikes/shopbikes/${shopId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Bikes data:', bikesRes.data);
        setBikes(bikesRes.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndBikes();
  }, [shopId]);

  const handleViewBike = (bikeId: string) => {
    navigate(`/customer/${customerId}/${shopId}/${bikeId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading shop details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !shop) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center gap-2 max-w-md text-center">
            
            <AlertCircle className="h-10 w-10" />
            <p className="text-lg font-semibold">Oops! Something went wrong</p>
            <p>{error || 'Shop not found'}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
            onClick={() => navigate(`/customer/${customerId}/dashboard`)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 h-64 md:h-96">
          <img
            src={shop.images?.[0] ? `http://localhost:5000/uploads/${shop.images[0]}` : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
            alt={shop.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Shop image failed to load:', shop.images?.[0]);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{shop.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                  {bikes.length} bikes available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Shop Info + Highlights Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About the Shop</h2>
              <p className="text-gray-600">
                {shop.description || 'A trusted rental shop offering a wide range of bikes and scooters for daily commutes, weekend getaways, and long rides. All vehicles are well-maintained and sanitized after every rental.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact & Location</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <span className="text-gray-600">{shop.address}, {shop.city} - {shop.pincode}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-600">{shop.phone}</span>
                </div>
                {shop.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-600">{shop.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-600">{shop.openingHours} – {shop.closingHours}</span>
                </div>
              </div>
            </div>

            {/* Bikes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Bikes</h2>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  {bikes.length} bikes
                </span>
              </div>

              {bikes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <BikeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bikes available at this shop yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bikes.map((bike) => (
                    <div
                      key={bike.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
                      onClick={() => handleViewBike(bike.id)}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={bike.images && bike.images.length > 0 && bike.images[0] ? `http://localhost:5000/uploads/${bike.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={bike.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            console.error('Bike image failed to load:', bike.images?.[0]);
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        <span
                          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                            bike.availability === 'available'
                              ? 'bg-green-100 text-green-800'
                              : bike.availability === 'booked'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bike.availability.toUpperCase()}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-xl text-gray-800">{bike.name}</h3>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-emerald-600">₹{bike.pricePerDay}</span>
                            <span className="text-gray-500 text-sm"> / day</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 capitalize">
                          <span>{bike.type}</span>
                          <span>•</span>
                          <span>{bike.transmission}</span>
                        </div>
                        <button className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm text-center w-full">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar – Key Highlights & Stats */}
          {/* <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Key Highlights</h3>
              <div className="space-y-4">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-800 mb-2">Why rent from us?</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li>✓ Well-maintained fleet</li>
                <li>✓ 24/7 roadside assistance</li>
                <li>✓ Flexible rental plans</li>
                <li>✓ No hidden charges</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500">Need help?</p>
              <a href={`tel:${shop.phone}`} className="text-emerald-600 font-semibold hover:underline">
                Call Shop
              </a>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default ShopDetailsCustomer;