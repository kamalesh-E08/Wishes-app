import { Router } from "express";
import { generateWish } from "../controllers/generate.controller";

const router = Router();

router.post("/", generateWish);

export default router;
