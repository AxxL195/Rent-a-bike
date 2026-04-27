import "./config/env.js"; 

import express from 'express';
import path from "path";

import { fileURLToPath } from "url";

import {PORT,DB_URL} from './config/env.js';

import loginRouter from './routes/login.routes.js';
import shopRouter from './routes/shop.routes.js';
import bikesRouter from './routes/bikes.routes.js';
import bookingRouter from './routes/booking.routes.js';
import userRouter from "./routes/user.routes.js";

import cors from 'cors';

import connecttoDB from '../database/mongodb.js';
import paymentRouter from "./routes/payment.routes.js";
import { startBookingCleanUp } from "./jobs/bookingCleanup.job.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/v1/auth',loginRouter);
app.use('/api/v1/shops', shopRouter);
app.use('/api/v1/bikes', bikesRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/payment',paymentRouter);

startBookingCleanUp();

app.listen(PORT, async ()=>{
    await connecttoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})