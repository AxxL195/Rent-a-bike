import mongoose from "mongoose";
import { type } from "os";

const bikeSchema = new mongoose.Schema({
    shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, "Shop is required for booking"],
        index: true
    },
    name:{
        type: String,
        required: [true, "Bike name is required"],
        trim: true,
    },
    type:{
        type: String,
        enum:['bike', 'scooter'],
        required: [true, "Bike type is required"],
    },
    transmission:{
        type: String,
        enum: ['manual', 'automatic'],
        required: [true, "Bike transmission type is required"],
    },
    pricePerDay:{
        type: Number,
        required: [true, "Bike price per day is required"],
        min: [0, "Bike price per day must be a positive number"]
    },
    description:{
        type: String,
        required: [true, "Bike description is required"],
        trim: true,
        minLength: [3, "Bike description must be at least 3 characters long"],
    },
    images:{
        type: [String],
        default: []
    },
    availability:{
        type: String,
        enum: ['available','booked','unavailable'],
        default: 'available',
    },
    specs:{
        engine:{type: String, trim: true},
        mileage:{type: String, trim: true},
        fuelType:{type: String, trim: true},
    },
}, {timestamps: true});

const Bike = mongoose.model('Bike', bikeSchema);

export default Bike;