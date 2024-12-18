// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import { app } from './app.js';

import connectDB from './db/index.js';

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 3000;

connectDB()
.then(()=>{
    app.on('error', (error)=>{
        console.log("ERROR: ",error);
        throw error
    })
    app.listen(port,()=> {
        console.log(`Server is running at port: ${port}`);
    })
})
.catch(err => {
    console.log("Mongo DB connection failed !! ", err);
})


// it's for generation of secret keys
// const secret = crypto.randomBytes(64).toString('hex');
// console.log(secret);


/*

import express from 'express';
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("ERROR: ",error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
} )();
*/