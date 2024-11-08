import express  from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
//this use methos use for middel-ware and configuration and all
// middel-ware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) 

// configurations
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

export {app}