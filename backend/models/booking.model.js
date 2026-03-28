import mongoose from "mongoose";
import { type } from "os";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking customer is required"],
      index: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: [true, "Booking bike is required"],
      index: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Booking shop is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Booking start date is required"],
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      required: true,
    },
    ownerConfirmedAt: {
      type: Date,
    },
    customerNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
