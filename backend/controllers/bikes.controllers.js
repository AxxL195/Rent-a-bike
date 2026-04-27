import mongoose from "mongoose";
import Bike from "../models/bike.model.js";
import Shop from "../models/shop.model.js";
import Booking from "../models/booking.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

// Helper function to find actual image filename (handles both old and new formats)
const findImageFile = (storedFilename) => {
  if (!storedFilename) {
    console.warn("Empty stored filename provided");
    return null;
  }

  try {
    // Check if file exists as-is (new format with timestamp)
    const fullPath = path.join(uploadsDir, storedFilename);
    if (fs.existsSync(fullPath)) {
      return storedFilename;
    }

    // For old format filenames without timestamps, search for matching file
    const files = fs.readdirSync(uploadsDir);
    const matchedFile = files.find((file) => file.endsWith(storedFilename));

    if (matchedFile) {
      return matchedFile;
    }

    return null;
  } catch (error) {
    console.error("Error finding image file:", error.message);
    return null;
  }
};

export const createBike = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name,
      type,
      transmission,
      pricePerDay,
      description,
      availability,
      shopId,
    } = req.body;

    if (!shopId || !mongoose.isValidObjectId(shopId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "shopId is required and must be valid",
        });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    if (shop.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not allowed to add bikes to this shop",
        });
    }

    const imageURLs = (req.files || []).map((file) => file.filename);
    const newBike = await Bike.create(
      [
        {
          shop: shop._id,
          name,
          type,
          transmission,
          pricePerDay,
          description,
          images: imageURLs,
          availability,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      success: true,
      message: "Bike created successfully",
      data: newBike[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating bike:", error);
    return res.status(500).json({ message: "Failed to create bike" });
  }
};

export const getBikesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    if (!mongoose.isValidObjectId(shopId)) {
      return res.status(400).json({
        success: false,
        message: "Valid shopId is required",
      });
    }

    const shop = await Shop.findById(shopId).lean();

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const bikes = await Bike.find({ shop: shopId }).lean();

    const result = bikes.map((bike) => {
      if (!bike.images || bike.images.length === 0) {
        return {
          id: bike._id,
          name: bike.name,
          type: bike.type,
          transmission: bike.transmission,
          pricePerDay: bike.pricePerDay,
          description: bike.description,
          images: [],
          availability: bike.availability,
        };
      }

      const processedImages = (bike.images || [])
        .map((img) => {
          const found = findImageFile(img);

          return found;
        })
        .filter((img) => img !== null);

      return {
        id: bike._id,
        name: bike.name,
        type: bike.type,
        transmission: bike.transmission,
        pricePerDay: bike.pricePerDay,
        description: bike.description,
        images: processedImages,
        availability: bike.availability,
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching bikes by shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bikes",
    });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const { bikeId } = req.params;

    if (!mongoose.isValidObjectId(bikeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bike ID" });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res
        .status(404)
        .json({ success: false, message: "Bike not found" });
    }

    const shop = await Shop.findById(bike.shop);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Associated shop not found" });
    }

    if (shop.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to delete this bike",
        });
    }

    // const booking = await Booking.findById(bikeId);

    await Bike.findByIdAndDelete(bikeId);
    await Booking.deleteMany({ bike: bikeId });
    return res
      .status(200)
      .json({ success: true, message: "Bike deleted successfully" });
  } catch (error) {
    console.error("Error deleting bike:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete bike" });
  }
};

export const getBikesForCustomer = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log("Fetching bikes for shopId:", shopId);
    if (!mongoose.isValidObjectId(shopId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid shopId is required" });
    }
    const shop = await Shop.findById(shopId).lean();
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }
    const bikes = await Bike.find({
      shop: shopId,
      availability: { $in: ["available", "limited", "booked"] },
    }).lean();
    const result = await Promise.all(
      bikes.map(async (bike) => {
        const activeBookings = await Booking.countDocuments({
          bike: bike._id,
          status: "active",
        });
        const images = (bike.images || [])
          .map((img) => findImageFile(img))
          .filter((img) => img !== null);
        return {
          id: bike._id,
          name: bike.name,
          type: bike.type,
          transmission: bike.transmission,
          pricePerDay: bike.pricePerDay,
          description: bike.description,
          images: images,
          availability: bike.availability,
          activeBookings,
        };
      }),
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching bikes for customer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch bikes" });
  }
};

export const getBikeDetailsForCustomer = async (req, res) => {
  try {
    const { bikeId } = req.params;

    if (!mongoose.isValidObjectId(bikeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid bikeId is required" });
    }

    const bike = await Bike.findById(bikeId).populate("shop").lean();

    if (!bike) {
      return res
        .status(404)
        .json({ success: false, message: "Bike not found" });
    }

    const activeBookings = await Booking.countDocuments({
      bike: bike._id,
      status: "active",
    });

    const images = (bike.images || [])
      .map((img) => findImageFile(img))
      .filter((img) => img !== null);

    const result = {
      id: bike._id,
      name: bike.name,
      pricePerDay: bike.pricePerDay,
      type: bike.type,
      transmission: bike.transmission,
      images: images,
      description: bike.description,
      availability: bike.availability,
      activeBookings,
      shop: {
        id: bike.shop?._id,
        name: bike.shop?.name,
        address: bike.shop?.address,
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching bike details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bike details" });
  }
};

export const update = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("bike details", req.body);
  try {
    const { bikeId } = req.params;
    if (!mongoose.isValidObjectId(bikeId)) {
      session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Valid bikeId is required" });
    }

    const bike = await Bike.findById(bikeId).session(session);

    if (!bike) {
      session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "bike not found",
      });
    }

    const allowedUpdates = [
      "name",
      "type",
      "transmission",
      "pricePerDay",
      "description",
      "images",
      "availability",
    ];

    const filteredUpdates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = req.body[key];
      }
    });

    Object.assign(bike, filteredUpdates);

    await bike.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "bike updated successfully",
      bike,
    });
  } catch (error) {
    console.error("error editing the bike details:", error);
    res.status(500).json({
      success: false,
      message: "failed to edit the details",
    });
  } finally {
    session.endSession();
  }
};

export const getInfo = async (req, res) => {
  try {
    const { bikeId } = req.params;

    if (!mongoose.isValidObjectId(bikeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid bikeId is required" });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res
        .status(404)
        .json({ success: false, message: "bike not found" });
    }

    const images = (bike.images || [])
      .map((img) => findImageFile(img))
      .filter((img) => img !== null);

    const result = {
      id: bike._id,
      name: bike.name,
      type: bike.type,
      transmission: bike.transmission,
      pricePerDay: bike.pricePerDay,
      description: bike.description,
      images: images,
      availability: bike.availability,
    };

    res.json(result);
  } catch (error) {
    console.error("error fetching the bike details:", error);
    res.status(500).json({
      success: false,
      message: "faild to get the details",
    });
  }
};
