// src/pages/customer/BikeDetailsCustomer.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Bike,
  Settings,
  Fuel,
  Gauge,
  Shield,
  AlertCircle,
  ChevronLeft,
  Loader,
} from 'lucide-react';
    import Navbar from '../Navbar';

interface Bike {
  id: string;
  name: string;
  type: 'bike' | 'scooter';
  transmission: 'automatic' | 'manual';
  pricePerDay: number;
  description: string;
  images: string[];
  availability: 'available' | 'booked' | 'unavailable';
  shop: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
  };
//   specs?: {
//     engine?: string;
//     mileage?: string;
//     fuelType?: string;
//   };
}

const BikeDetailsCustomer: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { bikeId, shopId } = useParams<{ bikeId: string; shopId: string }>();
  
  const navigate = useNavigate();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const fetchBike = async () => {
      if (!bikeId) {
        setError('Bike ID missing');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/v1/bikes/shopbikes/${shopId}/${bikeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        console.log("Bike details response:", res.data);
        setBike(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(`http://localhost:5000/uploads/${res.data.images[0]}`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load bike details');
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [bikeId]);

  const handleBookNow = () => {
    navigate(`/customer/${customerId}/${shopId}/${bikeId}/checkout`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading bike details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !bike) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center gap-2 max-w-md text-center">
            <AlertCircle className="h-10 w-10" />
            <p className="text-lg font-semibold">Oops! Something went wrong</p>
            <p>{error || 'Bike not found'}</p>
            <button
              onClick={() => navigate(-1)}
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
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
        >
          <ChevronLeft className="h-5 w-5" /> Back to shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column – Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
              <img
                src={selectedImage || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={bike.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  console.error('Main bike image failed to load:', selectedImage);
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            </div>
            {bike.images && bike.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {bike.images.map((img, idx) => {
                  const imgUrl = `http://localhost:5000/uploads/${img}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === imgUrl ? 'border-emerald-600' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${bike.name} ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column – Bike Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{bike.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {/* <span className="font-medium">{bike.shop.rating}</span> */}
                <span className="text-gray-400">•</span>
                {/* <Link to={`/shop/${bike.shop.id}`} className="text-emerald-600 hover:underline">
                  {bike.shop.name}
                </Link> */}
              </div>
            </div>

            {/* Price */}
            <div className="bg-emerald-50 rounded-xl p-4 flex items-baseline justify-between">
              <div>
                <span className="text-sm text-gray-600">Rent per day</span>
                <p className="text-3xl font-bold text-emerald-600">${bike.pricePerDay}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">+ taxes</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="capitalize text-sm font-medium">{bike.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="capitalize text-sm font-medium">{bike.transmission}</p>
                  </div>
                </div>
                {/* {bike.specs?.engine && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500">Engine</p>
                      <p className="text-sm font-medium">{bike.specs.engine}</p>
                    </div>
                  </div>
                )} */}
                {/* {bike.specs?.mileage && (
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="text-sm font-medium">{bike.specs.mileage}</p>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{bike.description}</p>
            </div>

            {/* Shop Info Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">Rental Shop</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-gray-600 font-bold text-lg">{bike.shop.name}</span>
                  <span className="text-gray-600">{bike.shop.address}, {bike.shop.city}</span>
                </div>
              </div>
              <Link
                to={`/customer/${customerId}/shops/${bike.shop.id}`}
                className="mt-3 inline-block text-emerald-600 text-sm hover:underline"
              >
                View shop details →
              </Link>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={bike.availability === 'booked'}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                bike.availability === 'booked'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {bike.availability === 'booked' ? 'Currently Booked' : 'Book Now'}
            </button>

            {/* Safety Note */}
            <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Safe & secure booking. Free cancellation up to 24 hours.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BikeDetailsCustomer;