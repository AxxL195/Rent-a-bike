import { Router } from "express";
import { createShop, myshops, manageShop,nearbyShops, shopDetails } from "../controllers/shop.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const shopRouter =  Router();

shopRouter.post('/create', protect,upload.array('images', 5), createShop);
shopRouter.get('/myshops', protect, myshops);
shopRouter.get('/myshops/:shopId', protect, manageShop);
shopRouter.get('/nearby', nearbyShops);
shopRouter.get('/shopDetails/:shopId', protect, shopDetails);

export default shopRouter;