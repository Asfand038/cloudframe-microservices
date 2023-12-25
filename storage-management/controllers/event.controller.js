import Storage from "../modals/storage.modal.js";
import axios from "axios";
import convertSize from "convert-size";
const handleEvent = async (type, data) => {
  if (type === "userCreated") {
    const newUser = new Storage({ userId: data.userId });
    await newUser.save();
  }
  if (type === "imageUploaded") {
    const userId = data.userId;
    const storage = convertSize(data.imgSize, "MB");
    const user = await Storage.findOne({ userId });
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }

    const newStorage = user._doc.storageRemaining - storage;
    // const newStorage = user._doc.storageRemaining - data.imgSize;
    const result = await Storage.updateOne(
      { userId },
      { $set: { storageRemaining: newStorage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
    const event = {
      type: "storageUpdated",
      data: {
        userId: userId,
        newStorage: newStorage,
      },
    };
    axios.post("http://localhost:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });
  }
  if (type === "imageDeleted") {
    const userId = data.userId;
    const storage = convertSize(data.imgSize, "MB");
    const user = await Storage.findOne({ userId });
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }

    const newStorage = user._doc.storageRemaining + storage;
    // const newStorage = user._doc.storageRemaining + data.imgSize;
    const result = await Storage.updateOne(
      { userId },
      { $set: { storageRemaining: newStorage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
    const event = {
      type: "storageUpdated",
      data: {
        userId: userId,
        newStorage: newStorage,
      },
    };
    axios.post("http://localhost:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });
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
