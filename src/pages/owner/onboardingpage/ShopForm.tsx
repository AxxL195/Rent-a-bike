// src/pages/owner/ShopForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShopForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: '',
    openingHours: '',
    closingHours: '',
    latitude: '12.9716',
    longitude: '77.5946',
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('address', formData.address);
    submitData.append('city', formData.city);
    submitData.append('pincode', formData.pincode);
    submitData.append('phone', formData.phone);
    if (formData.email) submitData.append('email', formData.email);
    submitData.append('openingHours', formData.openingHours);
    submitData.append('closingHours', formData.closingHours);
    submitData.append('location[coordinates]', JSON.stringify([parseFloat(formData.longitude), parseFloat(formData.latitude)]));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    }

    try {
      const response = await axios.post('/api/shops', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/owner/shop/${response.data.id}/bikes`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Set up your rental shop</h1>
            <p className="text-gray-600 mt-1">Tell us about your business</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* City and Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  title="6-digit pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="10-digit mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Opening and Closing Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Time *
                </label>
                <input
                  type="time"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Time *
                </label>
                <input
                  type="time"
                  name="closingHours"
                  value={formData.closingHours}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Shop Location</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              {/* Map placeholder */}
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <span>Map preview will appear here</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You can use a tool like <a href="https://www.latlong.net/" target="_blank" rel="noreferrer" className="text-emerald-600">latlong.net</a> to find coordinates.
              </p>
            </div>

            {/* Images */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Photos *
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                      <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/owner/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Shop'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopForm;