import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongo.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = process.env.PORT || 8080; 

connectDB()

app.use(
  cors({
    origin: "https://movie-tracker-f-e.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json())

app.use('/api/user', userRouter)

app.get('/', (req, res)=>{
    res.send(`welcome server is working`)
})

export default app;
