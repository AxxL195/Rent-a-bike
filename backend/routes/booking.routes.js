import { Router } from "express";
import { bookingAction, createBooking, getMyBookings, getOwnerBookings} from "../controllers/booking.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const bookingRouter = Router();

bookingRouter.post('/book',protect, createBooking)
bookingRouter.get('/mybookings', protect, getMyBookings);
bookingRouter.get('/owner-requests', protect, getOwnerBookings);
bookingRouter.put('/:bookingId', protect, bookingAction);

export default bookingRouter;