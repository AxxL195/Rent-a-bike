import Razorpay from "razorpay";
import { RAZORPAY_KEY_ID,RAZORPAY_SECRET } from "./env.js";

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret:RAZORPAY_SECRET
});

export default razorpay;