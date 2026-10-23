import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    username :{
        type:String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password:{
        type: String,
        required: true,  
    }
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
    
});


const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel 



