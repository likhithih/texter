import mongoose from "mongoose";

const connectDb= async (url)=>{
    try{
        await mongoose.connect(url)
        console.log("database connected");
    }
    catch (err){
        console.log("database connection failed", err);
    }
}
export default connectDb