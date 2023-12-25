import express from "express";

import { getEvents, postEvent } from "../controllers/event.controller.js";
const router = express.Router();

router.get("/events", getEvents);
router.post("/events", postEvent);

// router.post("/delete",deleteImage)
export default router;
