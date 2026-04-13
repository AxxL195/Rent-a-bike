// src/pages/customer/MyBookings.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  AlertCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../Navbar';

interface Booking {
  _id: string;
  bike?: {
    _id: string;
    name?: string;
    images?: string[];
  };
  shop?: {
    _id: string;
    name?: string;
    address?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/bookings/mybookings',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setBookings(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const isCurrent = (booking: Booking) => {
    const endDate = new Date(booking.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate >= today && booking.status !== 'cancelled';
  };

  const currentBookings = bookings.filter(isCurrent);
  const pastBookings = bookings.filter((b) => !isCurrent(b) || b.status === 'cancelled');

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const StatusIcon = statusConfig[booking.status].icon;
    return (
      <Link to={`/booking/${booking._id}`} className="block">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 mb-5 border border-gray-100 group">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Image */}
            <div className="relative w-full md:w-32 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={
                  booking.bike?.images?.[0] ||
                  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&h=150&fit=crop'
                }
                alt={booking.bike?.name || 'Bike'}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">
                    {booking.bike?.name || 'Unknown Bike'}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{booking.shop?.name || 'Unknown Shop'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' – '}
                      {new Date(booking.endDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${statusConfig[booking.status].color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[booking.status].label}
                  </span>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">
                    ₹{booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="h-10 w-10 animate-spin text-emerald-600" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center gap-2 max-w-md text-center">
            <AlertCircle className="h-10 w-10" />
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Track your rental requests and upcoming rides</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
              activeTab === 'current'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-100'
            }`}
          >
            Current & Upcoming
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
              {currentBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
              activeTab === 'past'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-100'
            }`}
          >
            Past
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
              {pastBookings.length}
            </span>
          </button>
        </div>

        {/* Empty State */}
        {(activeTab === 'current' ? currentBookings.length : pastBookings.length) === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No {activeTab === 'current' ? 'upcoming' : 'past'} bookings
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {activeTab === 'current'
                ? "You don't have any upcoming rentals. Start exploring nearby shops!"
                : "You haven't completed any rentals yet. Your past bookings will appear here."}
            </p>
            {activeTab === 'current' && (
              <Link
                to="/dashboard"
                className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md"
              >
                Browse Shops
              </Link>
            )}
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {(activeTab === 'current' ? currentBookings : pastBookings).map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;