import mongoose from "mongoose";
const usageSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  usageRemaining: {
    type: Number,
    default: 25,
  },
});

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
