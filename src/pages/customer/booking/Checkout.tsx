import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Bike,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  AlertCircle,
  Loader,
  ChevronLeft,
} from "lucide-react";
import Navbar from "../customerdashboard/Navbar";

interface Bike {
  id: string;
  name: string;
  pricePerDay: number;
  images: string[];
  shop: {
    id: string;
    name: string;
    address: string;
  };
}

const Checkout: React.FC = () => {
  const { customerId, bikeId, shopId } = useParams<{
    customerId: string;
    bikeId: string;
    shopId: string;
  }>();
  const navigate = useNavigate();

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date states
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    if (!bikeId) {
      setError("No bike selected");
      setLoading(false);
      return;
    }

    const fetchBike = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/bikes/shopbikes/${shopId}/${bikeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setBike(res.data);
        console.log("Fetched bike details:", res.data);
      } catch (err) {
        setError("Failed to load bike details");
      } finally {
        setLoading(false);
      }
    };

    const getdetails = async () => {
      // Pre-fill customer info from localStorage if available
      try {
        const userdetails = await axios.get(
          `http://localhost:5000/api/v1/user/customerdetails/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setCustomerName(userdetails.data.name);
        setCustomerEmail(userdetails.data.email);
      } catch (err) {
        setError("Failed to load bike details");
      }
    };

    fetchBike();
    getdetails();
  }, [bikeId]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !bike) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    return days > 0 ? days * bike.pricePerDay : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bike || !startDate || !endDate) return;
    if (!customerName || !customerEmail || !customerPhone) {
      setError("Please fill all contact details");
      return;
    }
    if (startDate >= endDate) {
      setError("End date must be after start date");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        bikeId: bike.id,
        shopId: bike.shop.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        customerName,
        customerEmail,
        customerPhone,
      };

      // console.log('Booking payload:', payload);
      const bookingres = await axios.post(
        "http://localhost:5000/api/v1/bookings/book",
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const bookingId = bookingres.data.data._id;

      const res = await axios.post(
        `http://localhost:5000/api/v1/payment/create-order`,
        { bookingId: bookingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(res.data);

      const { order, key } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Rent-A-Bike",
        description: "Bike booking payment",
        order_id: order.id,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        readonly: {
          contact: true,
          email: true,
        },
        handler: async function (response: any) {
          try {
            await axios.post(
              "http://localhost:5000/api/v1/payment/verify",
              {
                bookingId,
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            navigate(`/customer/${customerId}/my-bookings`);
          } catch (err: any) {
            setError(
              err.response?.data?.message || "Payment verification failed",
            );
          }
        },
        theme: {
          color: "#059669",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      // navigate(`/customer/${customerId}/my-bookings`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </>
    );
  }

  if (error && !bike) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-2" />
            <p>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!bike) return null;

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition"
        >
          <ChevronLeft className="h-5 w-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Complete your booking
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Rental Dates
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <DatePicker
                          selected={startDate}
                          onChange={(date: React.SetStateAction<Date | null>) =>
                            setStartDate(date)
                          }
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={new Date()}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          dateFormat="dd MMM yyyy"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <DatePicker
                          selected={endDate}
                          onChange={(date: React.SetStateAction<Date | null>) =>
                            setEndDate(date)
                          }
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || new Date()}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          dateFormat="dd MMM yyyy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your Email Address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Note */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Pay at pickup
                      </p>
                      <p className="text-xs text-gray-500">
                        You will pay the total amount directly to the shop when
                        you collect the bike.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                    submitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {submitting ? (
                    <Loader className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By confirming, you agree to our rental terms and cancellation
                  policy.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Booking Summary
              </h2>
              <div className="flex gap-4 pb-4 border-b border-gray-100">
                <img
                  src={
                    bike.images[0] ||
                    "https://via.placeholder.com/80x80?text=Bike"
                  }
                  alt={bike.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{bike.name}</h3>
                  <p className="text-sm text-gray-500">{bike.shop.name}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{bike.shop.address}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 py-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rental days</span>
                  <span className="font-medium">
                    {startDate && endDate
                      ? Math.ceil(
                          (endDate.getTime() - startDate.getTime()) /
                            (1000 * 3600 * 24),
                        )
                      : 0}{" "}
                    days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per day</span>
                  <span>₹{bike.pricePerDay}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-emerald-600">₹{total}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Free cancellation up to 24 hours before pickup.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
