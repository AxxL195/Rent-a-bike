// src/pages/owner/BookingRequests.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Bike,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface BookingRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bikeName: string;
  shopName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const BookingRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/bookings/owner-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('API response:', response.data.data);
        let data = response.data.data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          data = data.bookings || [];
        }
        if (!Array.isArray(data)) throw new Error('Invalid response');
        setRequests(data);
      } catch (err: any) {
        console.error('API error:', err);
        if (import.meta.env.DEV) {
          setRequests([]);
        } else {
          setError(err.response?.data?.message || 'Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (bookingId: string, action: 'confirm' | 'reject') => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/bookings/${bookingId}`,
        { status: action === 'confirm' ? 'confirmed' : 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === bookingId
              ? { ...req, status: action === 'confirm' ? 'confirmed' : 'cancelled' }
              : req
          )
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading booking requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-1">Manage customer booking requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {requests.filter((r) => tab === 'all' || r.status === tab).length})
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No booking requests</h3>
            <p className="text-gray-600 mt-2">All clear! No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.bikeName}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-600" />
                        <span>{request.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4 text-emerald-600" />
                        <span>{request.shopName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span>
                          {new Date(request.startDate).toLocaleDateString()} -{' '}
                          {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span>₹{request.totalPrice} total</span>
                      </div>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(request.id, 'confirm')}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
                      >
                        <CheckCircle className="h-4 w-4" /> Confirm
                      </button>
                      <button
                        onClick={() => handleAction(request.id, 'reject')}
                        className="flex items-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  Requested on: {new Date(request.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequests;