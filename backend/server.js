import "./config/env.js"; 

import express from 'express';

import {PORT,DB_URL} from './config/env.js';

import loginRouter from './routes/login.routes.js';

import cors from 'cors';

import connecttoDB from '../database/mongodb.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1/auth',loginRouter);

//test api route
app.get('/',(req,res) =>{
    res.send("Welcome to Rent-a-Bike API");
})

app.listen(PORT, async ()=>{
    await connecttoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})