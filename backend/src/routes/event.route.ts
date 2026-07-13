import express from "express";
import multer from "multer";

import { uploadEvents, getEvents, importJsonEvents, saveGeneratedWish } from "../controllers/event.controller";

const router = express.Router();

const upload = multer();

router.post("/import", upload.single("file"), uploadEvents);

router.get("/", getEvents);

router.post("/import-json", importJsonEvents);

router.put("/:eventId/generated", saveGeneratedWish);

export default router;
