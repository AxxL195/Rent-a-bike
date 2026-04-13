import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BikeForm: React.FC = () => {
  const { shopId, bikeId } = useParams<{ shopId: string; bikeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'bike' as 'bike' | 'scooter',
    transmission: 'manual' as 'automatic' | 'manual',
    pricePerDay: '',
    description: '',
    availability: 'available' as 'available' | 'booked' | 'unavailable',
  });
  const [images, setImages] = useState<FileList | null>(null);

  // If editing, fetch existing bike data
  useEffect(() => {
    if (bikeId) {
      const fetchBike = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/bikes/${bikeId}`);
          const bike = response.data;
          setFormData({
            name: bike.name,
            type: bike.type,
            transmission: bike.transmission,
            pricePerDay: bike.pricePerDay.toString(),
            description: bike.description,
            availability: bike.availability,
          });
          setImagePreviews(bike.images);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load bike');
        } finally {
          setLoading(false);
        }
      };
      fetchBike();
    }
  }, [bikeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('type', formData.type);
    submitData.append('transmission', formData.transmission);
    submitData.append('pricePerDay', formData.pricePerDay);
    submitData.append('description', formData.description);
    submitData.append('availability', formData.availability);
    if (shopId) submitData.append('shopId', shopId);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    } else if (imagePreviews.length > 0 && !bikeId) {
      // For new bike without selected images, we might need to handle required field
    }

    console.log(shopId)
    try {
      console.log('📤 Submitting bike form');
      console.log('  shopId:', shopId);
      console.log('  Images count:', images?.length || 0);
      console.log('  Form data:', formData);
      console.log('  bikeId:', bikeId);
      
      if (bikeId) {
        await axios.put(`http://localhost:5000/api/v1/bikes/bikeAdd/${shopId}`, submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        
        });
      } else { 
        console.log('📨 POST request to create bike');
        const response = await axios.post('http://localhost:5000/api/v1/bikes/bikeAdd', submitData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`

          },
        });
        console.log('✓ Bike created successfully:', response.data);
      }
      navigate(`/owner/shop/${shopId}/bikes`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save bike');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">
              {bikeId ? 'Edit Bike' : 'Add New Bike'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bike Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Type and Transmission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (₹) *</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
                min="0"
                step="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="booked">Booked</option>
              </select>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bike Photos *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
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
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(`/owner/shop/${shopId}/bikes`)}
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
                {loading ? 'Saving...' : bikeId ? 'Update Bike' : 'Add Bike'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BikeForm;