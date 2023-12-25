import mongoose from "mongoose";
const querySchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  username: {
    type: String,
  },
  images: [
    {
      imgId: {
        type: String,
      },
      imgUrl: {
        type: String,
      },
      imgSize: {
        type: String,
      },
    },
  ],
  storageRemaining: {
    type: Number,
  },
  usageRemaining: {
    type: Number,
  },
});

const Query = mongoose.model("Query", querySchema);
export default Query;
