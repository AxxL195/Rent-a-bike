import Booking from "../models/booking.model.js";
import Shop from "../models/shop.model.js";
import Bike from "../models/bike.model.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    const { bikeId, shopId, startDate, endDate} = req.body;

    if (!bikeId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const days = Math.ceil(
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24),
    );

    const bike=await Bike.findById(bikeId);

    const price=bike.pricePerDay;

    const totalPrice=days*price;

    const newbooking = await Booking.create({
      bike: bikeId,
      shop: shopId,
      startDate,
      endDate,
      totalPrice,
      customer: req.user._id,
    });

    return res.status(201).json({ success: true, data: newbooking });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("bike")
      .populate("shop");
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });

    const shopIds = shops.map((shop) => shop._id);

    const bookings = await Booking.find({
      shop: { $in: shopIds },
    })
      .populate("bike")
      .populate("shop")
      .populate("customer");

    const bookingsData = bookings.map((b) => ({
      id: b._id,
      customerName: b.customer?.name,
      customerEmail: b.customer?.email,
      customerPhone: b.customer?.phone,
      bikeName: b.bike?.name,
      shopName: b.shop?.name,
      startDate: b.startDate,
      endDate: b.endDate,
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: bookingsData,
    });
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const bookingAction = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId)
      .populate("shop")
      .populate("bike");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.shop.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    if (status === "confirmed") {
      await Bike.findByIdAndUpdate(booking.bike._id, {
        availability: "booked",
      });

      await Booking.updateMany(
        {
          bike: booking.bike._id,
          _id: { $ne: booking._id },
          status: { $in: ["pending", "confirmed"] },
        },
        {
          status: "cancelled",
        },
      );
    }

    if (status === "cancelled") {
      await Bike.findByIdAndUpdate(booking.bike._id, {
        availability: "available",
      });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update booking status" });
  }
};
