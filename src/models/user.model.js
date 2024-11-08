import mongoose, {Schema} from "mongoose";
import jsonWebToken from 'json-web-token';
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

// pre: we use async because this pre i.e. a hook, take some time do their task
// function: we use pure function nstead of arrow(=>) function beacuse this pre reuires context of "this" so that this can use data for future and in arrow function we dont't have context
userSchema.pre("save", async function (next) {
    
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10)
    next()
})

// we can make custom methods also
userSchema.methods.isePasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)    //gives true OR false
}

export const User = mongoose.model("User", userSchema)