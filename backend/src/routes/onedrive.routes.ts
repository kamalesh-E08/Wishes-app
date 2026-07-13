import { Router } from "express";

import { auth } from "../middleware/auth";

import {
  importOneDriveExcel,
  syncOneDrive,
} from "../controllers/onedrive.controller";

const router = Router();

router.post("/import", auth, importOneDriveExcel);
router.post("/sync", auth, syncOneDrive);

export default router;
