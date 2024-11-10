// Multer is a middleware for handling multipart/form-data, which is commonly used for file uploads in Node.js. When integrating with Cloudinary, you can use Multer to handle the file upload from the client to your server, then upload the file to Cloudinary from your server using Cloudinary’s API.
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/temp')
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)   // we can make some random unique id with file-name so that same file name is not encounter
    }
  })
  
  export const upload = multer({ 
    storage,
})