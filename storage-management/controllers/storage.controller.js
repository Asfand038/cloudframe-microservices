import Storage from "../modals/storage.modal.js";
import { errorHandler } from "../utils/error.js";

export const getStorage = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await Storage.findOne({ userId });
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }
    // console.log(user)
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
export const newUser = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const newUser = new Storage({ userId });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "new user added",
    });
  } catch (error) {
    return next(error);
  }
};
export const updateStorage = async (req, res, next) => {
  const { userId } = req.params;
  const { storage } = req.body;
  try {
    const user = await Storage.findOne({ userId });
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }

    const newStorage = user._doc.storageRemaining - storage;
    const result = await Storage.updateOne(
      { userId },
      { $set: { storageRemaining: newStorage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
    res.status(201).json({
      success: true,
      data: { storageRemaining: newStorage },
    });
  } catch (error) {
    return next(error);
  }
};
