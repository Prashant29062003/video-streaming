import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cludinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res)=>{
    // Register a user, steps:
    // 1. take the data from the user
    // 2. validate the given data at the server
    // 3. check if user already present at DB
    // 4. if data is present response back to client i.e. user already present use another account or user-name.
    // 5. check images, for avatar.
    // 6. upload them to cloudinary, avatar.
    // 7. if data is not present at DB then - create entry in DB.
    // 8. Remove passoword and Refresh token field in response of client.
    // 9. check for the creation.
    // 10. response back (200 ok) if registered

    const {fullName, username, email, password} = req.body
    console.log("email: ",email);

    if(
        [fullName,username, email,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required.")
    }

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with username or email already exists.")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar image is required.");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url, // this filed is required
        coverImage: coverImage?.url || "",   // this may remais empty as it is compulsry to have coverImage
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(201).json(
        new ApiResonse(200, createdUser, "User registered successfully.")
    )
    
})

export {registerUser}