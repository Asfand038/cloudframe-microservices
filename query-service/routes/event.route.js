import express from "express";
import { eventHandler } from "../controllers/event.controller.js";
import { getUserData } from "../controllers/query.controller.js";
const router = express.Router();

router.post("/events", eventHandler);
router.get("/user-data/:userId", getUserData);

export default router;
