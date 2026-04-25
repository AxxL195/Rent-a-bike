import { Router } from "express";
import { createShop, myshops, manageShop,nearbyShops, shopDetails, deleteShop, getInfo, update } from "../controllers/shop.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const shopRouter =  Router();

shopRouter.post('/create', protect,upload.array('images', 5), createShop);
shopRouter.get('/myshops', protect, myshops);
shopRouter.get('/myshops/:shopId', protect, manageShop);
shopRouter.get('/nearby', nearbyShops);
shopRouter.get('/shopDetails/:shopId', protect, shopDetails);
shopRouter.get('/shopinfo/:shopId',getInfo);
shopRouter.put('/update/:shopId',protect,upload.array("images",5),update);
shopRouter.delete('/shopDelete/:shopId',protect,deleteShop);

export default shopRouter;