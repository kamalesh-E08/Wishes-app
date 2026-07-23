import { Router } from "express";

import { auth } from "../middleware/auth";

import {
  importOneDriveExcel,
  syncOneDrive,
  previewOneDriveExcel,
} from "../controllers/onedrive.controller";

const router = Router();

router.post("/import", auth, importOneDriveExcel);
router.post("/sync", auth, syncOneDrive);
router.post("/preview", auth, previewOneDriveExcel);

export default router;
