import { useState } from 'react';
import {
  Search as SearchIcon,
  Map,
} from 'lucide-react';
import Search from '../Search';
import BikeCard from './BikeCard';


// ---------- Skeleton Card for Loading ----------
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

// ---------- Empty State ----------
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-4">
      <SearchIcon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No bikes available</h3>
    <p className="text-gray-600">Try changing your location or search filters.</p>
  </div>
);

// ---------- Main Search Results Page ----------
const SearchResults = () => {
  const [loading, setLoading] = useState(false); // toggle to see loading state
  const bikes = [
    {
      id: 1,
      name: 'Activa 6G',
      shop: 'City Bikes',
      distance: '0.8 km',
      rating: 4.8,
      price: 500,
      priceUnit: 'day',
      availability: 'available',
      image: 'https://etimg.etb2bimg.com/photo/73269142.cms',
    },
    {
      id: 2,
      name: 'Royal Enfield Himalayan',
      shop: 'Mountain Rentals',
      distance: '2.3 km',
      rating: 4.9,
      price: 800,
      priceUnit: 'day',
      availability: 'unavailable',
      image: 'https://imgd.aeplcdn.com/600x600/n/cw/ec/110431/himalayan-right-side-view-7.png?isig=0',
    },
    {
      id: 3,
      name: 'Ntorq 125',
      shop: 'Scooty Hub',
      distance: '1.2 km',
      rating: 4.5,
      price: 600,
      priceUnit: 'day',
      availability: 'available',
      image: 'https://cdn.shriramfinance.in/tw-marketplace/model/ntorq-125.webp',
    },
    {
      id: 4,
      name: 'TVS Jupiter',
      shop: 'City Bikes',
      distance: '1.5 km',
      rating: 4.6,
      price: 450,
      priceUnit: 'day',
      availability: 'available',
      image: 'https://bd.gaadicdn.com/upload/userfiles/images/2023/03/tvs-jupiter-110.jpg',
    },
    {
      id: 5,
      name: 'Yamaha Fascino',
      shop: 'Scooty Hub',
      distance: '1.2 km',
      rating: 4.7,
      price: 550,
      priceUnit: 'day',
      availability: 'available',
      image: 'https://imgd.aeplcdn.com/600x600/n/cw/ec/40480/fascino-125-right-side-view-3.png',
    },
    {
      id: 6,
      name: 'Honda Dio',
      shop: 'City Bikes',
      distance: '0.8 km',
      rating: 4.4,
      price: 480,
      priceUnit: 'day',
      availability: 'booked',
      image: 'https://imgd.aeplcdn.com/600x600/n/cw/ec/40490/dio-right-side-view-3.png',
    },
  ];

  // For demo, you can set loading=true to see skeletons
  // const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Search/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%]">
            {/* Bike Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : bikes.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {bikes.map(bike => <BikeCard bike={bike} />)}
              </div>
            )}
          </div>

          <div className="lg:w-[30%]">
            <div className="sticky top-24 bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold flex items-center gap-2">
                  <Map className="h-5 w-5 text-emerald-600" /> Rental Shops Near You
                </h3>
              </div>
              <div className="h-96 bg-gray-200 relative">
                {/* Mock Map with Markers */}
                <img
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c7b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                  alt="Map placeholder"
                  className="w-full h-full object-cover opacity-50"
                />
                {/* Simulated Markers */}
              </div>
              <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-100">
                Click markers to see shop details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;