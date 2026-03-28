import React, { useState } from 'react';
import {
  Star,
  Map,
  ChevronRight,
} from 'lucide-react';
import Navbar from './Navbar';
import Search from './Search';

const CustomerDashboard = () => {
  

  // Sample data
  const nearbyShops = [
    {
      id: 1,
      name: 'City Bikes',
      distance: '0.8 km',
      rating: 4.8,
      bikesAvailable: 12,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      name: 'Scooty Hub',
      distance: '1.2 km',
      rating: 4.5,
      bikesAvailable: 8,
      image: 'https://images.unsplash.com/photo-1591635809020-1f5a9fc77b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      name: 'Mountain Rentals',
      distance: '2.3 km',
      rating: 4.9,
      bikesAvailable: 5,
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1528&q=80',
    },
  ];

  const availableBikes = [
    {
      id: 1,
      name: 'Activa 6G',
      type: 'Scooter',
      price: 500,
      priceUnit: 'day',
      availability: 'Available',
      shop: 'City Bikes',
      image: 'https://etimg.etb2bimg.com/photo/73269142.cms',
    },
    {
      id: 2,
      name: 'Royal Enfield Himalayan',
      type: 'Bike',
      price: 800,
      priceUnit: 'day',
      availability: 'Limited',
      shop: 'Mountain Rentals',
      image: 'https://imgd.aeplcdn.com/600x600/n/cw/ec/110431/himalayan-right-side-view-7.png?isig=0',
    },
    {
      id: 3,
      name: 'Ntorq 125',
      type: 'Scooter',
      price: 600,
      priceUnit: 'day',
      availability: 'Available',
      shop: 'Scooty Hub',
      image: 'https://cdn.shriramfinance.in/tw-marketplace/model/ntorq-125.webp',
    },
    {
      id: 4,
      name: 'TVS Jupiter',
      type: 'Scooter',
      price: 450,
      priceUnit: 'day',
      availability: 'Available',
      shop: 'City Bikes',
      image: 'https://bd.gaadicdn.com/upload/userfiles/images/2023/03/tvs-jupiter-110.jpg',
    },
  ];

  const bookings = {
    current: { name: 'Activa 6G', shop: 'City Bikes', date: 'Today, 5:00 PM' },
    upcoming: { name: 'Himalayan', shop: 'Mountain Rentals', date: 'Tomorrow, 10:00 AM' },
    past: { name: 'Ntorq 125', shop: 'Scooty Hub', date: '2 days ago' },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Search />
        {/* Nearby Rental Shops Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Nearby Rental Shops</h2>
            <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nearbyShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold shadow">
                    {shop.distance}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{shop.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span>{shop.rating} • {shop.bikesAvailable} bikes</span>
                  </div>
                  <button className="mt-3 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 rounded-xl transition">
                    View Bikes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map & Bookings Combined Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-600" /> Nearby on Map
            </h2>
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default CustomerDashboard;