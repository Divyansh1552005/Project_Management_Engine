import mongoose from "mongoose";
import dotenv from "dotenv/config"


const connectMongoDB = async () =>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB connected!")
  }catch(error){
    console.log("MongoDB connecction error " , error)
    process.exit(1)
  }
}

export default connectMongoDB

