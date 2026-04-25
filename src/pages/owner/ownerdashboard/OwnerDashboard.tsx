// src/pages/owner/OwnerDashboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Store,
  Calendar,
  DollarSign,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  Trash2,
} from "lucide-react";
import OwnerNav from "./OwnerNav";

interface Shop {
  owner: string;
  id: string;
  name: string;
  address: string;
  totalBikes: number;
  totalBookings: number;
}

const OwnerDashboard: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/shops/myshops",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        let shopsData = response.data;
        if (
          shopsData &&
          typeof shopsData === "object" &&
          !Array.isArray(shopsData)
        ) {
          shopsData = shopsData.shops || [];
        }
        if (!Array.isArray(shopsData)) {
          throw new Error("Invalid API response");
        }
        setShops(shopsData);
      } catch (err: any) {
        console.error("API error:", err);
        if (import.meta.env.DEV) {
          setShops([]);
        } else {
          setError(err.response?.data?.message || "Failed to load shops");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleAddShop = () => {
    navigate(`/owner/${ownerId}/shops/create`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading your shops...</div>
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
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <OwnerNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your rental business from one place
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <button
            onClick={handleAddShop}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-gray-500">Add New Shop</p>
              <p className="text-xl font-semibold text-gray-800">Create Shop</p>
            </div>
            <div className="bg-emerald-50 rounded-full p-3 group-hover:bg-emerald-100 transition">
              <PlusCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </button>

          <Link
            to={`/owner/${ownerId}/bookings`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-gray-500">Booking Requests</p>
              <p className="text-xl font-semibold text-gray-800">
                View Requests
              </p>
            </div>
            <div className="bg-emerald-50 rounded-full p-3 group-hover:bg-emerald-100 transition">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </Link>

          <Link
            to="/owner/earnings"
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-gray-500">Earnings</p>
              <p className="text-xl font-semibold text-gray-800">This Month</p>
            </div>
            <div className="bg-emerald-50 rounded-full p-3 group-hover:bg-emerald-100 transition">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </Link>
        </div>

        {/* Shops Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Rental Shops
            </h2>
            {shops.length > 0 && (
              <Link
                to="/owner/shops/all"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {shops.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                No shops yet
              </h3>
              <p className="text-gray-600 mt-2">
                Create your first rental shop to start listing bikes.
              </p>
              <button
                onClick={handleAddShop}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
              >
                <PlusCircle className="h-4 w-4" /> Add Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {shop.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {shop.address}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          axios.delete(
                            `http://localhost:5000/api/v1/shops/shopDelete/${shop.id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            }
                          );
                        }}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full p-2 transition-colors duration-200"
                        aria-label="Delete shop"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">Total Bikes</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {shop.totalBikes}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">Active Bookings</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {shop.totalBookings}
                        </p>
                      </div>
                    </div>

                    {/* Manage link (repositioned from header) */}
                    <div className="mt-3 text-right">
                      <Link
                        to={`/owner/${shop.owner}/shops/${shop.id}/bikes`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        Manage Bikes <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex gap-3">
                      <Link
                        to={`/owner/${ownerId}/${shop.id}/bikes/create`}
                        className="flex-1 text-center border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition"
                      >
                        Add Bike
                      </Link>
                      <Link
                        to={`/owner/${shop.id}/bookings`}
                        className="flex-1 text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
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

        {/* Optional: Recent Activity or Stats (placeholder) */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>
                No recent bookings yet. Your shops will appear here once
                customers book.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
