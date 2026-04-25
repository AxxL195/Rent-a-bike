import {config} from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {PORT,DB_URL,JWT_SECRET,JWT_EXPIRES_IN,RAZORPAY_KEY_ID,RAZORPAY_SECRET} = process.env;