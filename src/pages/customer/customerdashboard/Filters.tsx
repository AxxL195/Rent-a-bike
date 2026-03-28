import {
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

const Filters = () => {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <SlidersHorizontal className="h-4 w-4" /> Filters:
      </span>

      <div className="relative group">
        <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
          Price <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
        Bike
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
        Scooter
      </button>

      <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
        Automatic
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
        Manual
      </button>

      <div className="relative group">
        <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition">
          Rating <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <label className="flex items-center gap-1 text-sm">
        <input
          type="checkbox"
          className="rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span>Available only</span>
      </label>
    </div>
  );
};

export default Filters;
