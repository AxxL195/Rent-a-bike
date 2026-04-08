import mongoose from "mongoose"
import Bike from "../models/bike.model.js";
import Shop from "../models/shop.model.js";
import Booking from "../models/booking.model.js";

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

        const imageURLs = (req.files || []).map((file) => file.originalname);
        console.log("Creating bike for shop:", shop._id);
        const newBike = await Bike.create([{ shop: shop._id, name, type, transmission, pricePerDay, description, images: imageURLs, availability }], {session});

        await session.commitTransaction();
        session.endSession();
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
    // const responseBikes = {
    //     id: bikes._id,
    //     name: bikes.name,
    //     type: bikes.type,
    //     transmission: bikes.transmission,
    //     pricePerDay: bikes.pricePerDay,
    //     description: bikes.description,
    //     images: bikes.images,
    //     availability: bikes.availability
    // }

    // console.log("Bikes found for shop:", bikes);

    res.json(bikes);
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
                return {
                    id: bike._id,
                    name: bike.name,
                    type: bike.type,  
                    transmission: bike.transmission,
                    pricePerDay: bike.pricePerDay,
                    description: bike.description,
                    images: bike.images,  
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

    const result = {
      id: bike._id,
      name: bike.name,
      pricePerDay: bike.pricePerDay,
      images: bike.images,
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