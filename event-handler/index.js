import express from "express";
// import cors from "cors";
// import databseConnect from "./utils/db.js";
import eventRoutes from "./routes/event.route.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

const port = process.env.PORT || 5004;
// databseConnect();
app.listen(port, () => {
  console.log(`sever is running at port ${port}`);
});
app.use("/api", eventRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});
