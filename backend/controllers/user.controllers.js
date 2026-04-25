import mongoose from "mongoose";
import User from "../models/user.model.js";

export const customerDetails = async (req,res) => {
    try{
        const {customerId} = req.params;

        if(!mongoose.isValidObjectId(customerId)){
            return res.status(400).json({
                success: false,
                message: "Invalid Id"
            })
        }

        const user = await User.findById(customerId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "No user found"
            })
        }

        const result= {
            name: user.name,
            email: user.email
        }
        console.log(result);
        res.json(result)
    }
    catch(err){
        console.error("error fetching the bike details:",error);
        res.status(500).json({
            success:false,
            message:"faild to get the details"
        })
    }
}