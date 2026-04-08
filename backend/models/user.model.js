import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [50, "Name must be less than 50 characters long"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"],
    },
    role:{
        type: String,
        enum: ['customer','admin','owner'],
        default: 'customer',
        required: [true, "Role is required"],
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;