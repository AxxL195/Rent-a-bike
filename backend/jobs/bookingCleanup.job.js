import cron from "node-cron";
import Booking from "../models/booking.model.js";
import Bike from "../models/bike.model.js";

export const startBookingCleanUp = () =>{
    cron.schedule("* * * * *", async () => {
        console.log("Running booking cleanup job...");
    
        const now = new Date();
    
        const expiredBookings = await Booking.find(
          { expiresAt: { $lte: now }, status: "pending" },
        );

        for (let booking of expiredBookings) {
            booking.status = "cancelled";
            await booking.save();
          
            await Bike.findByIdAndUpdate(booking.bike, {
              availability : 'available'
            });
        }
    });
    
}