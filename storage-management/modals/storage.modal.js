import mongoose from "mongoose";
const storageSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  storageRemaining: {
    type: Number,
    default: 10,
  },
});

const Storage = mongoose.model("Storage", storageSchema);
export default Storage;
