import mongoose from 'mongoose';
import Shop from '../models/shop.model.js';
import Bike from '../models/bike.model.js';
import Booking from '../models/booking.model.js';
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
      console.log(`✓ Found shop image file directly: ${storedFilename}`);
      return storedFilename;
    }
    
    // For old format filenames without timestamps, search for matching file
    const files = fs.readdirSync(uploadsDir);
    const matchedFile = files.find(file => file.endsWith(storedFilename));
    
    if (matchedFile) {
      console.log(`✓ Found matching shop file for ${storedFilename}: ${matchedFile}`);
      return matchedFile;
    }
    
    console.warn(`✗ No file found for stored filename: ${storedFilename}`);
    console.warn(`  Available files count: ${files.length}`);
    return null;
  } catch (error) {
    console.error('Error finding shop image file:', error.message);
    return null;
  }
};

export const createShop = async (req,res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("user:", req.user);

    try{
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        const {name, address, city, pincode, phone, email, openingHours, closingHours, latitude, longitude} = req.body;

        if(!name || !address || !city || !pincode || !phone || !openingHours || !closingHours || !latitude || !longitude) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const imageURLs = (req.files || []).map((file) => file.filename);
        console.log("Creating shop for user:", req.user._id);
        const newShop = await Shop.create([{ owner: req.user._id, name, address, city, pincode, phone, email, openingHours, closingHours, location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }, images: imageURLs }], {session});

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({
            success: true,
            message: "Shop created successfully",
            data: newShop[0]
        })

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating shop:", error);
        return res.status(400).json({
          success: false,
          message: error.message
        });
    }
}

export const myshops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });

    const result = await Promise.all(
      shops.map(async (shop) => {
        const totalBikes = await mongoose
          .model("Bike")
          .countDocuments({ shop: shop._id });

        const totalBookings = await mongoose
          .model("Booking")
          .countDocuments({
            shop: shop._id,
            status: { $in: ["pending", "confirmed"] }, // active only
            endDate: { $gte: new Date() } // not expired
          });

        return {
          owner: shop.owner,
          id: shop._id,
          name: shop.name,
          address: shop.address,
          totalBikes,
          totalBookings,
        };
      })
    );

    res.json(result);

  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({ message: "Failed to fetch shops" });
  }
};

export const manageShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        if (!mongoose.isValidObjectId(shopId)) {
            return res.status(400).json({ success: false, message: 'Invalid shop ID' });
        }

        const shop = await Shop.findById(shopId).lean();
        if (!shop) {
            return res.status(404).json({ success: false, message: 'Shop not found' });
        }

        if (shop.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied to this shop' });
        }

        const totalBikes = await Bike.countDocuments({ shop: shop._id });
        const totalBookings = await Booking.countDocuments({ shop: shop._id });

        const responseShop = {
            id: shop._id,
            owner: shop.owner,
            name: shop.name,
            address: shop.address,
            city: shop.city,
            pincode: shop.pincode,
            phone: shop.phone,
            email: shop.email,
            openingHours: shop.openingHours,
            closingHours: shop.closingHours,
            location: shop.location,
            images: shop.images || [],
            totalBikes,
            totalBookings,
            createdAt: shop.createdAt,
            updatedAt: shop.updatedAt,
        };

        return res.status(200).json({ success: true, data: responseShop });
    } catch (error) {
        console.error('Error fetching shop details:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch shop details' });
    }
};

export const nearbyShops = async (req, res) => {
  try {
    let { lat, lng, limit = 10, bikeType } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and Longitude are required'
      });
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    limit = parseInt(limit);

    if (isNaN(lat) || isNaN(lng) || isNaN(limit)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters'
      });
    }

    let shopsWithBikes = [];

    if (bikeType && bikeType !== 'all') {
      const bikeTypeFilter = bikeType === 'bike' ? 'bike' : 'scooter';
      shopsWithBikes = await Bike.distinct('shop', { type: bikeTypeFilter });
    }

    const pipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          spherical: true,
          key: 'location',
          maxDistance: 10000000
        }
      },
      {
        $lookup: {
          from: 'bikes',
          localField: '_id',
          foreignField: 'shop',
          as: 'bikes'
        }
      },
      {
        $addFields: {
          totalBikes: { $size: '$bikes' }
        }
      },
      {
        $project: {
          bikes: 0
        }
      }
    ];

    // Apply filter AFTER geoNear
    if (bikeType && bikeType !== 'all') {
      pipeline.push({
        $match: {
            _id: { $in: shopsWithBikes.map(id => new mongoose.Types.ObjectId(id)) }
}
      });
    }

    pipeline.push({ $limit: limit });

    const nearbyShops = await Shop.aggregate(pipeline);

    const formattedShops = nearbyShops.map(shop => {
      let imageFilename = null;
      if (shop.images && shop.images.length > 0) {
        imageFilename = findImageFile(shop.images[0]);
      }
      
      return {
        id: shop._id,
        name: shop.name,
        address: shop.address,
        city: shop.city,
        distance: `${(shop.distance / 1000).toFixed(1)} km`,
        rating: shop.rating || 0,
        totalBikes: shop.totalBikes || 0,
        image: imageFilename,
        location: shop.location
      };
    });

    res.status(200).json(formattedShops);

  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby shops'
    });
  }
};

export const shopDetails = async (req, res) => {
  try{
    const { shopId } = req.params;

    if (!mongoose.isValidObjectId(shopId)) {
      return res.status(400).json({ success: false, message: 'Invalid shop ID' });
    }
    const shop = await Shop.findById(shopId).lean();
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    const totalBikes = await Bike.countDocuments({ shop: shop._id });
    const totalBookings = await Booking.countDocuments({ shop: shop._id });
    
    // Map and find correct image filenames
    const images = (shop.images || []).map(img => findImageFile(img)).filter(img => img !== null);
    
    const responseShop = {
      id: shop._id,
      owner: shop.owner,
      name: shop.name,
      address: shop.address,
      city: shop.city,
      pincode: shop.pincode,
      phone: shop.phone,
      email: shop.email,
      openingHours: shop.openingHours,
      closingHours: shop.closingHours,
      location: shop.location,
      images: images,
      totalBikes,
      totalBookings,
      createdAt: shop.createdAt,
      updatedAt: shop.updatedAt,
    };

    return res.status(200).json({ success: true, data: responseShop });
  }catch(error){
    console.error('Error fetching shop details:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch shop details' });
  }
}