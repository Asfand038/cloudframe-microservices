import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const connectDatabse = () => {
  mongoose.connect(process.env.DATABASE_URI).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  });
};

export default connectDatabse;
