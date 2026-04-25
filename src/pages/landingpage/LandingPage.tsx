import { Bike, Users, MapPin, Calendar, Sparkles, Clock, LayoutDashboard, CheckCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'
import LoginModal from '../../utils/LoginModal';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const[loginOpen,setLoginOpen] = useState(false);

  // Sample bike data for preview cards
  const sampleBikes = [
    {
      id: 1,
      name: 'Activa 6G',
      type: 'Scooter',
      price: 500,
      availability: 'available',
      image: 'https://etimg.etb2bimg.com/photo/73269142.cms',
    },
    {
      id: 2,
      name: 'Royal Enfield Himalayan',
      type: 'Bike',
      price: 800,
      availability: 'unavailable',
      image: 'https://imgd.aeplcdn.com/600x600/n/cw/ec/110431/himalayan-right-side-view-7.png?isig=0',
    },
    {
      id: 3,
      name: 'Ntorq 125',
      type: 'Scooter',
      price: 600,
      availability: 'available',
      image: 'https://cdn.shriramfinance.in/tw-marketplace/model/ntorq-125.webp',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Bike className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
              <span className="ml-2 text-xl font-bold text-gray-900">Rent-A-Bike</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                How It Works
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Rentals
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Contact
              </a>
            </div>

            {/* Login/Signup Button (Desktop) */}
            <div className="hidden md:block">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg" onClick={()=>setLoginOpen(true)}>
                Login / Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-2 px-4 space-y-2">
            <a href="#" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium">Home</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium">How It Works</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium">Rentals</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium">Contact</a>
            <button className="w-full text-left bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium">
              Login / Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your <span className="text-emerald-600">Perfect Ride</span> Anywhere
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl lg:mx-0 mx-auto">
                Centralized bike and scooty rentals. Whether you're a rider looking for your next adventure or an owner wanting to list your fleet, we've got you covered.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={()=>setLoginOpen(true)} className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Bike className="h-5 w-5" />
                  I'm a Customer
                </button>
                <button onClick={()=>setLoginOpen(true)} className="group bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  I'm a Rental Owner
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative h-96">
              <img
                src="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Bike rental"
                className="rounded-2xl object-cover w-full h-full shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Choose Your Role</h3>
              <p className="mt-3 text-gray-600">Select whether you want to rent or list your vehicles.</p>
              <div className="mt-4 flex justify-center gap-2 text-sm">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Customer</span>
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">Owner</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Browse or Add Vehicles</h3>
              <p className="mt-3 text-gray-600">Explore available rides or list your own fleet effortlessly.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Book or Manage Rentals</h3>
              <p className="mt-3 text-gray-600">Instantly book your ride or manage your owner dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Rent-A-Bike</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need in one platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Centralized Listings</h3>
              <p className="mt-2 text-gray-600 text-sm">All bikes and scooties in one place, easy to compare.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Availability</h3>
              <p className="mt-2 text-gray-600 text-sm">See what's available now and book instantly.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Owner Dashboard</h3>
              <p className="mt-2 text-gray-600 text-sm">Manage your fleet, earnings, and bookings easily.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Booking</h3>
              <p className="mt-2 text-gray-600 text-sm">Quick, secure, and hassle-free reservation process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Cards Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Rides</h2>
            <p className="mt-4 text-lg text-gray-600">Check out some of our available vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBikes.map((bike) => (
              <div key={bike.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        bike.availability === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bike.availability}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{bike.name}</h3>
                    <span className="text-sm text-gray-500">{bike.type}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">₹{bike.price}</span>
                    <span className="text-gray-500 text-sm">per day</span>
                  </div>
                  <button className="mt-4 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 rounded-lg transition-colors">
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start your journey today</h2>
          <p className="text-lg text-emerald-100 mb-8">Join thousands of riders and owners on Rent-A-Bike.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>setLoginOpen(true)} className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Bike className="h-5 w-5" />
              Sign up as Customer
            </button>
            <button onClick={()=>setLoginOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-emerald-400">
              <Users className="h-5 w-5" />
              Sign up as Owner
            </button>
          </div>
        </div>
      </section>

      
      <LoginModal isOpen={loginOpen} setIsOpen={setLoginOpen} />
    </div>
  )
}

export default LandingPage