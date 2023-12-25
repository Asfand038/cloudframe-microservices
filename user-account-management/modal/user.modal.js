import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "name is required"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email already registered"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
