import mongoose, { Schema, model, models, Document } from 'mongoose';

 const userSchema = new mongoose.Schema({
    Name:{
        type : String
    }, 
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true,

    },

 },{timestamps:true})
const user =mongoose.models.user|| mongoose.model("user",userSchema);
export default user;