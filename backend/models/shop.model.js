import mongoose from "mongoose";
import { type } from "os";
import { types } from "util";

const shopSchema =  new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Shop owner is required"]
    },
    name:{
        type: String,
        required: [true, "Shop name is required"],
        trim: true,
        minLength: [3, "Shop name must be at least 3 characters long"],
        maxLength: [100, "Shop name must be less than 100 characters long"]
    },
    address:{
        type: String,
        required: [true, "Shop address is required"],
        trim: true,
        minLength: [10, "Shop address must be at least 10 characters long"],
        maxLength: [200, "Shop address must be less than 200 characters long"]
    },
    city:{
        type: String,
        required: [true, "Shop city is required"],
        trim: true,
        minLength: [2, "Shop city must be at least 2 characters long"],
        maxLength: [100, "Shop city must be less than 100 characters long"]
    },
    pincode:{
        type: String,
        required: [true, "Shop pincode is required"],
        trim: true,
        match: [/^\d{6}$/, "Please use a valid 6-digit pincode"]
    },
    phone:{
        type: String,
        required: [true, "Shop phone number is required"],
        trim: true,
        match: [/^\d{10}$/, "Please use a valid 10-digit phone number"]
    },
    email:{
        type: String,
        required: [true, "Shop email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    openingHours:{
        type: String,
        required: [true, "Shop opening hours are required"],
        trim: true
    },
    closingHours:{
        type: String,
        required: [true, "Shop closing hours are required"],
        trim: true
    },
    images:{
        type: [String],
        default: []
    },
    location:{
        type:{
            type: String,
            enum: ['Point'],
            required: [true, "Shop location type is required"],
            default: 'Point'
        },
        coordinates:{
            type: [Number],
            required: [true, "Shop location coordinates are required"],
            index: '2dsphere'
        }
    }
}, {timestamps: true});