import mongoose from 'mongoose'

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=>{
        console.log("connection established");
    } );

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`); 
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;  
    }
}
export default connectDB