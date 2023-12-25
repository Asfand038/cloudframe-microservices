import express from "express";
import { eventHandler } from "../controllers/event.controller.js";
const router = express.Router();

router.post("/events", eventHandler);

export default router;
