import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error("please enter the MONGOS_URI in the .env file");
}
async function connectDB(){
    //0- disconnected, 1- connected, 2- connecting, 3- disconnecting
    if(mongoose.connection.readyState !==1){
        try{
            await mongoose.connect(MONGODB_URI as string);
            console.log("MongoDB connected successfully!");
        }catch(error){
            console.error("Connection error:", error);
        }
    }
}
export default connectDB;