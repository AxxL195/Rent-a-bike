import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { customerDetails } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.get('/customerdetails/:customerId',protect,customerDetails)

export default userRouter;