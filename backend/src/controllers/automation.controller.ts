import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";

import { generateEventWish } from "../services/automation/automation.service";

export async function generateAutomation(req: AuthRequest, res: Response) {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    const result = await generateEventWish(eventId);

    return res.json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


