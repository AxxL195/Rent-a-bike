import {
  MapPin,
  Calendar,
  Clock,
  Search as SearchIcon,
} from 'lucide-react';

const Search = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-300 transition-shadow">
            <span className="pl-3 text-gray-400">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Enter city or area"
              className="w-full p-2.5 outline-none text-sm"
            />
            <button className="bg-emerald-50 text-emerald-700 px-3 py-2.5 text-sm font-medium whitespace-nowrap hover:bg-emerald-100 transition-colors">
              Use My Location
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-300 transition-shadow">
            <span className="pl-3 text-gray-400">
              <Calendar className="h-5 w-5" />
            </span>
            <input
              type="date"
              className="w-full p-2.5 outline-none text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-300 transition-shadow">
            <span className="pl-3 text-gray-400">
              <Clock className="h-5 w-5" />
            </span>
            <input
              type="time"
              className="w-full p-2.5 outline-none text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bike Type
          </label>
          <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-300 outline-none">
            <option>All</option>
            <option>Bike</option>
            <option>Scooter</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;