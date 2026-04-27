import { RAZORPAY_KEY_ID, RAZORPAY_SECRET } from "../config/env.js";
import razorpay from "../config/razorpay.js";
import Bike from "../models/bike.model.js";
import Booking from "../models/booking.model.js";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  console.log(req.body);
  try {
    const { bookingId } = req.body;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const days = Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) /
        (1000 * 60 * 60 * 24),
    );

    const bike = await Bike.findById(booking.bike);

    const Totalamount = days * bike.pricePerDay;

    const options = {
      amount: Totalamount * 100,
      currency: "INR",
      receipt: `receipt_${booking._id}`,
      notes: {
        bikeId: bike._id.toString(),
        bookingId,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ order, key: RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid bookingId is required" });
    }

    const booking =await Booking.findById(bookingId)
      .populate('shop')
      .populate('bike');

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const secret = RAZORPAY_SECRET;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      booking.status = "confirmed";
      await booking.save();

      if (booking.status === "confirmed") {
        await Bike.findByIdAndUpdate(booking.bike._id, {
          availability: "booked",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Payment verified",
      });
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Payment Not verified",
    });
  }
};
