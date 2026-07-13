import { Router } from "express";

import { generateTodayEvents } from "../services/automation/scheduler.service";

const router = Router();

router.post("/run", async (_req, res) => {
  try {
    const count = await generateTodayEvents();

    res.json({
      success: true,
      processed: count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;
