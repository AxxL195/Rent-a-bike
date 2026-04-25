import {Router} from "express";
import { createBike, getBikesByShop, deleteBike, getBikesForCustomer, getBikeDetailsForCustomer, update, getInfo } from "../controllers/bikes.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const bikesRouter = Router();

bikesRouter.post('/bikeAdd', protect, upload.array('images', 5), createBike);
bikesRouter.get('/myBikes/:shopId', protect, getBikesByShop);
bikesRouter.get('/shopbikes/:shopId', protect, getBikesForCustomer);
bikesRouter.get('/shopbikes/:shopId/:bikeId', protect, getBikeDetailsForCustomer);
bikesRouter.get('/bikeinfo/:bikeId',getInfo);
bikesRouter.put('/update/:bikeId',protect,upload.array('images',5),update)
bikesRouter.delete('/:bikeId', protect, deleteBike);

export default bikesRouter;