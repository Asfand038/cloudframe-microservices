import express from "express";
import multer from "multer";
const upload = multer({});
import {
  deleteImage,
  getImageById,
  getImages,
  newUser,
  replaceImage,
  uploadImage,
} from "../controllers/photos.controller.js";
const router = express.Router();

router.get("/user/:userId", getImages);
router.post("/upload/:userId", upload.array("image"), uploadImage);
router.post("/newUser", newUser);
router.delete("/deleteImage/:userId", deleteImage);
// Define the route for replacing an image
router.put("/replaceImage/:userId/:imgId", replaceImage);

// Define the route for getting a specific image by imgId
router.get("/getImage/:userId", getImageById);
// router.post("/delete",deleteImage)
export default router;
