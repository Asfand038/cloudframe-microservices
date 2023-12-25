import express from "express";
import connectDatabse from "./utils/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
connectDatabse();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listning at port ${PORT}`);
});
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api", eventRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
