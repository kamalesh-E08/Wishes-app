import express from "express";
import multer from "multer";

import { uploadEvents, getEvents, importJsonEvents } from "../controllers/event.controller";

const router = express.Router();

const upload = multer();

router.post("/import", upload.single("file"), uploadEvents);

router.get("/", getEvents);

router.post("/import-json", importJsonEvents);

export default router;
