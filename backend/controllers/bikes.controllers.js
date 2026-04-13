import mongoose from "mongoose"
import Bike from "../models/bike.model.js";
import Shop from "../models/shop.model.js";
import Booking from "../models/booking.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Helper function to find actual image filename (handles both old and new formats)
const findImageFile = (storedFilename) => {
  if (!storedFilename) {
    console.warn('Empty stored filename provided');
    return null;
  }
  
  try {
    // Check if file exists as-is (new format with timestamp)
    const fullPath = path.join(uploadsDir, storedFilename);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ Found image file directly: ${storedFilename}`);
      return storedFilename;
    }
    
    // For old format filenames without timestamps, search for matching file
    const files = fs.readdirSync(uploadsDir);
    const matchedFile = files.find(file => file.endsWith(storedFilename));
    
    if (matchedFile) {
      console.log(`✓ Found matching file for ${storedFilename}: ${matchedFile}`);
      return matchedFile;
    }
    
    console.warn(`✗ No file found for stored filename: ${storedFilename}`);
    console.warn(`  Available files count: ${files.length}`);
    return null;
  } catch (error) {
    console.error('Error finding image file:', error.message);
    return null;
  }
};

export const createBike = async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("user:", req.user);

    try{
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        const {name, type, transmission, pricePerDay, description, availability, shopId} = req.body;

        if(!shopId || !mongoose.isValidObjectId(shopId)) {
            return res.status(400).json({ success: false, message: 'shopId is required and must be valid' });
        }

        const shop = await Shop.findById(shopId);
        console.log("Shop found:", shop);
        console.log("Shop found:", shop._id);
        console.log("Shop found:", shop.owner);

        if(!shop) {
            return res.status(404).json({ success: false, message: 'Shop not found' });
        }

        if(shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not allowed to add bikes to this shop' });
        }

        const imageURLs = (req.files || []).map((file) => file.filename);
        console.log("Creating bike for shop:", shop._id);
        console.log("Image files received:", req.files?.length || 0);
        console.log("Image filenames to save:", imageURLs);
        const newBike = await Bike.create([{ shop: shop._id, name, type, transmission, pricePerDay, description, images: imageURLs, availability }], {session});

        await session.commitTransaction();
        session.endSession();
        console.log("New bike created with ID:", newBike[0]._id);
        console.log("New bike images:", newBike[0].images);
        return res.status(201).json({   
            success: true,
            message: "Bike created successfully",
            data: newBike[0]
        })

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating bike:", error);
        return res.status(500).json({ message: "Failed to create bike" });
    }
}

export const getBikesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log("Fetching bikes for shopId:", shopId);
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
    console.log(`\n========== getBikesByShop Debug ==========`);
    console.log(`Found ${bikes.length} bikes for shop ${shopId}`);
    console.log(`Raw bikes from DB:`, JSON.stringify(bikes.map(b => ({
      id: b._id,
      name: b.name,
      images: b.images,
      imagesCount: b.images?.length || 0
    })), null, 2));
    
    const result = bikes.map(bike => {
      console.log(`\nProcessing bike: "${bike.name}"`);
      console.log(`  Stored images:`, bike.images);
      
      if (!bike.images || bike.images.length === 0) {
        console.log(`  ⚠️  No images stored in DB for this bike!`);
        return {
          id: bike._id,
          name: bike.name,
          type: bike.type,
          transmission: bike.transmission,
          pricePerDay: bike.pricePerDay,
          description: bike.description,
          images: [],
          availability: bike.availability
        };
      }
      
      const processedImages = (bike.images || []).map(img => {
        console.log(`    Processing image: "${img}"`);
        const found = findImageFile(img);
        console.log(`      Result: ${found ? '✓ ' + found : '✗ Not found'}`);
        return found;
      }).filter(img => img !== null);
      
      console.log(`  Final processed images:`, processedImages);
      return {
        id: bike._id,
        name: bike.name,
        type: bike.type,
        transmission: bike.transmission,
        pricePerDay: bike.pricePerDay,
        description: bike.description,
        images: processedImages,
        availability: bike.availability
      };
    });

    console.log(`\n✓ Returning to client:`, JSON.stringify(result.map(b => ({ name: b.name, imageCount: b.images.length })), null, 2));
    console.log(`==========================================\n`);
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
            return res.status(400).json({ success: false, message: 'Invalid bike ID' });
        }

        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        const shop = await Shop.findById(bike.shop);
        if (!shop) {
            return res.status(404).json({ success: false, message: 'Associated shop not found' });
        }

        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this bike' });
        }

        await bike.remove();
        return res.status(200).json({ success: true, message: 'Bike deleted successfully' });
    } catch (error) {
        console.error('Error deleting bike:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete bike' });
    }
};

export const getBikesForCustomer = async (req, res) => {
    try{
        const { shopId } = req.params;
        console.log("Fetching bikes for shopId:", shopId);
        if (!mongoose.isValidObjectId(shopId)) {
            return res.status(400).json({ success: false, message: 'Valid shopId is required' });
        }
        const shop = await Shop.findById(shopId).lean();
        if (!shop) {
            return res.status(404).json({ success: false, message: 'Shop not found' });
        }
        const bikes = await Bike.find({ shop: shopId, availability: { $in: ['available', 'limited', 'booked'] } }).lean();
        const result = await Promise.all(
            bikes.map(async (bike) => {
                const activeBookings = await Booking.countDocuments({ bike: bike._id, status: 'active' });
                const images = (bike.images || []).map(img => findImageFile(img)).filter(img => img !== null);
                return {
                    id: bike._id,
                    name: bike.name,
                    type: bike.type,  
                    transmission: bike.transmission,
                    pricePerDay: bike.pricePerDay,
                    description: bike.description,
                    images: images,  
                    availability: bike.availability,
                    activeBookings
                }
            })
        );
        res.json(result);
    }catch(error){
        console.error("Error fetching bikes for customer:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch bikes' });
    }
}

export const getBikeDetailsForCustomer = async (req, res) => {
  try {
    const { bikeId } = req.params;

    if (!mongoose.isValidObjectId(bikeId)) {
      return res.status(400).json({ success: false, message: 'Valid bikeId is required' });
    }

    const bike = await Bike.findById(bikeId)
      .populate('shop')   // 🔥 IMPORTANT
      .lean();

    if (!bike) {
      return res.status(404).json({ success: false, message: 'Bike not found' });
    }

    const activeBookings = await Booking.countDocuments({
      bike: bike._id,
      status: 'active'
    });

    const images = (bike.images || []).map(img => findImageFile(img)).filter(img => img !== null);

    const result = {
      id: bike._id,
      name: bike.name,
      pricePerDay: bike.pricePerDay,
      images: images,
      description: bike.description,
      availability: bike.availability,
      activeBookings,
      shop: {
        id: bike.shop?._id,
        name: bike.shop?.name,
        address: bike.shop?.address
      }
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching bike details:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch bike details' });
  }
};