import express from "express";

import { listExcelFiles } from "../controllers/onedrive.controller";

const router = express.Router();

router.get("/files", listExcelFiles);

export default router;
