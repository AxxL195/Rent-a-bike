// src/components/customer/Search.tsx
import React, { useState } from 'react';
import { MapPin, Search as SearchIcon, Loader } from 'lucide-react';
import axios from 'axios';

interface SearchProps {
  onSearchResults: (shops: any[]) => void;
  onLoading: (loading: boolean) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResults, onLoading }) => {
  const [location, setLocation] = useState('');
  const [bikeType, setBikeType] = useState('all');
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleLocationClick = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Optionally reverse geocode to get city name, but we'll use coordinates directly
        setLocation(`${latitude},${longitude}`); // store as string for display
        await performSearch(latitude, longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert('Unable to get your location. Please enter city manually.');
        setGettingLocation(false);
      }
    );
  };

  const performSearch = async (lat?: number, lng?: number) => {
    onLoading(true);
    try {
      console.log('performing search...')
      let url = 'http://localhost:5000/api/v1/shops/nearby';
      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}&limit=10`;
      } else if (location.trim()) {
        // If user typed a city name, we need to geocode it (optional). For now, assume backend handles text search.
        url += `?city=${encodeURIComponent(location)}&limit=10`;
      } else {
        onLoading(false);
        return;
      }
      if (bikeType !== 'all') {
        url += `&bikeType=${bikeType}`;
      }
      const response = await axios.get(url);
      onSearchResults(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch shops. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Location */}
        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-300">
            <span className="pl-3 text-gray-400">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Enter city or area"
              className="w-full p-2.5 outline-none text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={handleLocationClick}
              disabled={gettingLocation}
              className="bg-emerald-50 text-emerald-700 px-3 py-2.5 text-sm font-medium whitespace-nowrap hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {gettingLocation ? <Loader className="h-4 w-4 animate-spin" /> : 'Use My Location'}
            </button>
          </div>
        </div>

        {/* Bike Type */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bike Type (optional)
          </label>
          <select
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-300 outline-none"
            value={bikeType}
            onChange={(e) => setBikeType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <button
            onClick={handleLocationClick}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <SearchIcon className="h-5 w-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;