import { Router } from "express";
import { generateWish } from "../controllers/generate.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, generateWish);

export default router;
