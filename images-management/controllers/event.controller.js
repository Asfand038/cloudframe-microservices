import Photos from "../modals/photos.modal.js";

const handleEvent = async (type, data) => {
  if (type === "userCreated") {
    const newUser = new Photos({ userId: data.userId, images: [] });
    await newUser.save();
  }
  if (type === "storageUpdated") {
    const result = await Photos.updateOne(
      { userId: data.userId },
      { $set: { storageRemaining: data.newStorage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
  }
  if (type === "usageUpdated") {
    const result = await Photos.updateOne(
      { userId: data.userId },
      { $set: { usageRemaining: data.newUsage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating storage"));
    }
  }
  if (type === "usageUpdatedAtMidnight") {
    const result = await Photos.updateMany({}, { $set: { usageRemaining: data.newUsage } });
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
