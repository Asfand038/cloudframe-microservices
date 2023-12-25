import Query from "../modals/query.modal.js";
import convertSize from "convert-size";
const handleEvent = async (type, data) => {
  if (type === "userCreated") {
    const newUser = new Query({ userId: data.userId });
    await newUser.save();
  }
  if (type === "imageUploaded") {
    const user = await Query.findOne({ userId: data.userId });
    if (!user) {
      return next(errorHandler(401, "user not found"));
    }
    const newImage = {
      imgId: data.imgId,
      imgUrl: data.imgUrl,
      imgSize: convertSize(data.imgSize),
    };
    user.images.push(newImage);

    // Save the updated user document
    await user.save();
  }
  if (type === "imageDeleted") {
    const { imgId, userId } = data;
    const result = await Query.updateOne(
      { userId: userId },
      { $pull: { images: { imgId: imgId } } }
    );

    if (result.nModified === 0) {
      return next(
        errorHandler(404, "Image not found for the specified user and imgId")
      );
    }
  }
  if (type === "storageUpdated") {
    const result = await Query.updateOne(
      { userId: data.userId },
      { $set: { storageRemaining: data.newStorage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
  }
  if (type === "usageUpdated") {
    const result = await Query.updateOne(
      { userId: data.userId },
      { $set: { usageRemaining: data.newUsage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
  }
  if (type === "usageUpdatedAtMidnight") {
    const result = await Query.updateMany({}, { $set: { usageRemaining: data.newUsage } });
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
  }
};
export const eventHandler = async (req, res, next) => {
  const { type, data } = req.body;

  try {
    handleEvent(type, data);

    res.status(201).json({ message: "event recieved" });
  } catch (error) {
    return next(error);
  }
};
