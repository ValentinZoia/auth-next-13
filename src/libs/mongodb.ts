import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1/auth-next-13";

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    }catch(error){
        console.log(error);
    }
};