import mongoose from "mongoose";
const photoSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
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
    default: 10,
  },
  usageRemaining: {
    type: Number,
    default: 25,
  },
});

const Photos = mongoose.model("Photos", photoSchema);
export default Photos;
