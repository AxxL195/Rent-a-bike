import "./config/env.js"; 

import express from 'express';
import path from "path";

import {PORT,DB_URL} from './config/env.js';

import loginRouter from './routes/login.routes.js';
import shopRouter from './routes/shop.routes.js';
import bikesRouter from './routes/bikes.routes.js';
import bookingRouter from './routes/booking.routes.js';

import cors from 'cors';

import connecttoDB from '../database/mongodb.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1/auth',loginRouter);
app.use('/api/v1/shops', shopRouter);
app.use('/api/v1/bikes', bikesRouter);
app.use('/api/v1/bookings', bookingRouter);

//test api route
app.get('/',(req,res) =>{
    res.send("Welcome to Rent-a-Bike API");
})

app.listen(PORT, async ()=>{
    await connecttoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})