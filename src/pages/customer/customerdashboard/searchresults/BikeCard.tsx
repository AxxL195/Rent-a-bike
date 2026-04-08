import { MapPin, Star } from "lucide-react"

interface Bike {
  id: number;
  name: string;
  shop: string;
  distance: string;
  rating: number;
  price: number;
  priceUnit: string;
  availability: string;
  image: string;
}

interface BikeCardProps {
  bike: Bike;
}
const BikeCard = ({ bike }: BikeCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group">
       <div className="relative h-40 overflow-hidden">
         <img src={bike.image} alt={bike.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
         <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
          bike.availability === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {bike.availability}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{bike.name}</h3>
        <p className="text-sm text-gray-600">{bike.shop}</p>
        <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {bike.distance}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {bike.rating}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-emerald-600 font-bold text-xl">₹{bike.price}</span>
          <span className="text-gray-500 text-xs">per {bike.priceUnit}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium py-2 rounded-lg transition">
            View Details
          </button>
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition shadow-md hover:shadow-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default BikeCard