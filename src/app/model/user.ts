import mongoose, { Schema, model, models, Document } from 'mongoose';

 const userSchema = new mongoose.Schema({
    Name:{
        type : String
    }, 
    email:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,

    },
    password:{
        type: String,
        required: true,

    },
    occupation:{
        type: String

    },
    income:{
        type: String

    },
    contactnumber:{
        type: String

    },
    city:{
        type: String

    },
    State:{
        type: String

    },
    houseno:{
        type: String

    },

 },{timestamps:true})
const user =mongoose.models.user|| mongoose.model("user",userSchema);
export default user;