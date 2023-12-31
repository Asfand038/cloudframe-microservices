import Photos from "../modals/photos.modal.js";
import { errorHandler } from "../utils/error.js";
import axios from "axios";
import convertSize from "convert-size";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "cloudProject",
  });
  return res;
}
export const getImages = async (req, res, next) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Find the user by userId and retrieve all images
    const user = await Photos.findOne({ userId });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  const { userId } = req.params;
  const imgSizeToCompare = convertSize(req.files[0].size, "MB");
  // const { imgId, imgUrl, imgSize } = req.body;
  try {
    // const myImage = {};
    // console.log(file);
    // console.log("size:", mySize);imgId
    const user = await Photos.findOne({ userId });
    if (!user) {
      return next(errorHandler(401, "user not found!"));
    }
    if (imgSizeToCompare > user.storageRemaining) {
      return next(errorHandler(405, "Don't have enough storage!"));
    }
    if (imgSizeToCompare > user.usageRemaining) {
      return next(errorHandler(402, "You have crossed today limit!"));
    }
    const b64 = Buffer.from(req.files[0].buffer).toString("base64");
    let dataURI = "data:" + req.files[0].mimetype + ";base64," + b64;
    const result = await handleUpload(dataURI);
    const imgSize = req.files[0].size;
    // Create a new image object
    const newImage = {
      imgId: result.public_id,
      imgUrl: result.secure_url,
      imgSize,
    };
    // const newImage = {
    //   imgId,
    //   imgUrl,
    //   imgSize,
    // };

    // Add the new image to the images array
    user.images.push(newImage);

    // Save the updated user document
    await user.save();
    const event = {
      type: "imageUploaded",
      data: {
        userId: userId,
        imgId: result.public_id,
        imgUrl: result.secure_url,
        imgSize,
      },
    };
    // const event = {
    //   type: "imageUploaded",
    //   data: {
    //     userId,
    //     imgId,
    //     imgUrl,
    //     imgSize,
    //   },
    // };
    axios.post("http://event-handler-srv:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    return next(error);
  }
};

export const newUser = async (req, res, next) => {
  const { userId } = req.body;
  const newUser = new Photos({ userId, images: [] });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "new user added",
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  const { userId } = req.params;
  const { imgId } = req.body;
  // const imgName = imgUrl.split("/").slice(-1)[0].split(".")[0];
  try {
    // console.log(imgName);
    // Find the user before the update
    const userBeforeUpdate = await Photos.findOne({ userId });

    if (!userBeforeUpdate) {
      return next(errorHandler(404, "User not found"));
    }

    // Perform the update and get the updated user
    const updatedUser = await Photos.findOneAndUpdate(
      { userId, "images.imgId": imgId },
      {
        $pull: {
          images: { imgId: imgId },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(
        errorHandler(404, "Image not found for the specified user and imgId")
      );
    }
    cloudinary.uploader.destroy(imgId, (error, result) => {
      console.log(error || result);
    });
    const deletedImage = userBeforeUpdate.images.find(
      (img) => img.imgId === imgId
    );

    const event = {
      type: "imageDeleted",
      data: {
        userId,
        imgId,
        imgSize: parseFloat(deletedImage.imgSize),
      },
    };

    await axios.post("http://event-handler-srv:4004/api/events", event);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      deletedImage: deletedImage,
    });
  } catch (error) {
    return next(error);
  }
};
export const replaceImage = async (req, res, next) => {
  const { userId, imgId } = req.params; // Assuming userId and imgId are passed as URL parameters
  const { newImgId, newImgUrl } = req.body;

  try {
    // Find the user by userId and update the image with the specified imgId
    const result = await Photos.updateOne(
      { userId: userId, "images.imgId": imgId },
      { $set: { "images.$.imgId": newImgId, "images.$.imgUrl": newImgUrl } }
    );

    if (result.nModified === 0) {
      return next(
        errorHandler(404, "Image not found for the specified user and imgId")
      );
    }

    res.status(200).json({
      success: true,
      message: "Image replaced successfully",
      data: { imgId: newImgId, imgUrl: newImgUrl },
    });
  } catch (error) {
    return next(error);
  }
};

export const getImageById = async (req, res, next) => {
  const { userId } = req.params; // Assuming userId and imgId are passed as URL parameters
  const { imgId } = req.body;
  try {
    // Find the user by userId and retrieve the specific image with imgId
    const user = await Photos.findOne({ userId });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const image = user.images.find((img) => img.imgId === imgId);

    if (!image) {
      return next(
        errorHandler(404, "Image not found for the specified user and imgId")
      );
    }

    res.status(200).json({
      success: true,
      message: "Image retrieved successfully",
      data: image,
    });
  } catch (error) {
    return next(error);
  }
};
