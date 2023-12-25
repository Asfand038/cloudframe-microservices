import Usage from "../modals/usage.modal.js";
import { errorHandler } from "../utils/error.js";

export const getUsage = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await Usage.findOne({ userId });
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
    const newUser = new Usage({ userId });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "new user added",
    });
  } catch (error) {
    return next(error);
  }
};
export const updateUsage = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await Usage.findOne({ userId });
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }

    const newUsage = 25;
    const result = await Usage.updateOne(
      { userId },
      { $set: { usageRemaining: newUsage } }
    );
    if (result.nModified === 0) {
      return next(errorHandler(500, "Error updating Usage"));
    }
    res.status(201).json({
      success: true,
      data: { usageRemaining: newUsage },
    });
  } catch (error) {
    return next(error);
  }
};
