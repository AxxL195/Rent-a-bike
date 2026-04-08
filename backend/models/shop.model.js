import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Shop owner is required"]
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  pincode: {
    type: String,
    required: true,
    match: /^\d{6}$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    trim: true,
    match: /\S+@\S+\.\S+/
  },
  openingHours: {
    type: String,
    required: true
  },
  closingHours: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2 &&
            val[0] >= -180 && val[0] <= 180 &&
            val[1] >= -90 && val[1] <= 90;
        },
        message: "Coordinates must be [lng, lat]"
      }
    }
  }
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;