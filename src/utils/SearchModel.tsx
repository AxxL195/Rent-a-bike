// src/components/customer/SearchModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, Search, MapPin, Star, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Shop {
  id: string;
  name: string;
  address: string;
  image: string;
  rating?: number;
  totalBikes?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/shops/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shopId: string) => {
    onClose();
    navigate(`/shop/${shopId}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-emerald-50/30">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Search className="h-5 w-5 text-emerald-600" />
            Find Rental Shops
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by shop name..."
              className="w-full px-5 py-3 pl-12 pr-20 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Results */}
          <div className="mt-6">
            {loading && (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {results.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => handleShopClick(shop.id)}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all duration-200"
                  >
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-20 h-20 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{shop.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {shop.address}
                        </span>
                        {shop.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {shop.rating}
                          </span>
                        )}
                        {shop.totalBikes && (
                          <span className="text-emerald-600 font-medium">{shop.totalBikes} bikes</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No shops found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">Try a different name</p>
              </div>
            )}

            {!loading && !query && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">Enter a shop name to search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;