import express from "express";
import cors from 'cors'
import authRoutes from './routes/auth.routes'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/v1", authRoutes)

app.get('/health',(req,res)=>{
    res.json({
        status: 'OK',
        message: 'StepsTracker server'
    })
})

export default app;
