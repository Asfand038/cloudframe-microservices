import express from "express";
// import cors from "cors";
import databseConnect from "./utils/db.js";
import usageRoutes from "./routes/usage.route.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import eventRoutes from "./routes/event.route.js";
import Usage from "./modals/usage.modal.js";
import cron from 'node-cron';
import axios from "axios";
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

cron.schedule('0 0 * * *', async () => {
  try {
    // Update all documents in the collection
    await Usage.updateMany({}, { $set: { usageRemaining: 25 } });
    
    const event = {
      type: "usageUpdatedAtMidnight",
      data: {
        newUsage: 25,
      },
    };
    axios.post("http://localhost:4004/api/events", event).catch((err) => {
      console.log(err.message);
    });

    console.log('Daily update completed.');
  } catch (error) {
    console.error('Error updating thresholdRemaining:', error);
  }
});

const port = process.env.PORT || 5003;
databseConnect();
app.listen(port, () => {
  console.log(`sever is running at port ${port}`);
});
app.use("/api/usage", usageRoutes);
app.use("/api/", eventRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});
