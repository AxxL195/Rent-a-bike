import {Router} from 'express';
import { createOrder, verify } from '../controllers/payment.controllers.js';
import { protect } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

paymentRouter.post('/create-order',createOrder);
paymentRouter.post('/verify',protect,verify)

export default paymentRouter;