import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const databseConnect = () => {
  mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log("databse connected successfully");
  });
};

export default databseConnect;
