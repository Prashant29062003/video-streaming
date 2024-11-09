import mongoose, {Schema} from "mongoose";
import jwt from 'json-web-token';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // for optimiziation of searching in database || CAUTION: as this make a lot of load on DB so be carefull where we put this index 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    avatar: {
        type: String,   // cloudinary url
        required: true
    },
    coverImage: {
        type: String,   // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: Video
        }
    ],
    refreshToken: {
        type: String,
    },
}, {timestamps: true})

// pre: we use async because this "pre" i.e. a hook, take some time do their task
// function: we use pure function nstead of arrow(=>) function beacuse this pre reuires context of "this" so that this can use data for future and in arrow function we dont't have context

// we use "pre" middleware function to modify OR check OR anything we want before "saving" in data-base(DB)
userSchema.pre("save", async function (next) {

    if(this.isModified("password")) return next();  // "isModified" is predefined function with "pre" that check if password alter OR not and then calls next() for another middleware

    this.password = bcrypt.hash(this.password, 10); // Hashes the password before saving Moves to the next middleware or save operation
    next();
}) 

// we can make custom methods also using 'userShema.methods.--'
userSchema.methods.isePasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)    //gives true OR false
}

// they both are jwt token just use cases are different for authentication OR autherization
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,  // data-base(DB) generate this _id for every user
            email: this.email,
            username: this.uesrname,
            fullName: this.fullNmae,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY  // this ends 3-days
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id,  // data-base(DB) generate this _id for every user
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // this ends 10-days i.e. take more time to expire than access expire
        }
    )
}

export const User = mongoose.model("User", userSchema)