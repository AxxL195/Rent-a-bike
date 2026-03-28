import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { JWT_SECRET ,JWT_EXPIRES_IN} from "../config/env.js";

export const register = async (req,res) =>{
    const session= await mongoose.startSession();
    session.startTransaction();

    try{
        const {name,email,password} = req.body;

        //check if user already exists
        const existingUser =  await User.findOne({email});

        if(existingUser){
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser= await User.create([{name,email,password: hashedPassword}],{session});

        const token = jwt.sign({userId: newUsers[0].id}, JWT_SECRET,{expiresIn: JWT_EXPIRES_IN}); 


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data:{
                token,
                user: newUser[0]
            }
        })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        console.error(error.message);
    }
}

export const login = async (req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }

    try{

    }catch(err){
        console.error(error.message);
        return res.status(500).json({message: 'Server error'});
    }
}