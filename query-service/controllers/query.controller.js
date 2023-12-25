import Query from "../modals/query.modal.js";
export const getUserData = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const data = await Query.findOne({ userId });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};
