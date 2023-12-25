import express from "express";

import {
  getStorage,
  newUser,
  updateStorage,
} from "../controllers/storage.controller.js";
const router = express.Router();

router.get("/get/:userId", getStorage);
router.post("/newUser", newUser);
router.put("/update/:userId", updateStorage);
// router.post("/delete",deleteImage)
export default router;
