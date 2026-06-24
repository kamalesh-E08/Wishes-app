import type { Request, Response } from "express";
import Event from "../models/Event";
import { parseExcel } from "../services/excel.service";

export const uploadEvents = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const rows = parseExcel(file.buffer);

    const userId = req.headers["firebase-uid"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const events = rows.map((row: any) => ({
      userId,

      name: row.Name,
      email: row.Email,
      occasion: row.EventType || row.Occasion,
      eventDate: new Date(row.EventDate),
      department: row.Department,
      customMessage: row.CustomMessage,
      source: "excel",
      status: "pending",
    }));

    console.log(events[0]);
    const saved = await Event.insertMany(events);

    return res.json({
      success: true,
      count: saved.length,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
    });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const source = req.query.source as "excel" | "onedrive" | undefined;

   const userId = req.headers["firebase-uid"];

   if (!userId) {
     return res.status(401).json({
       success: false,
       message: "User not authenticated",
     });
   }

   const filter: any = {
     userId,
   };

   if (source) {
     filter.source = source;
   }

   const events = await Event.find(filter).sort({
     eventDate: 1,
   });
    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const importJsonEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["firebase-uid"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const events = req.body.map((event: any) => ({
      ...event,
      userId,
    }));

    const saved = await Event.insertMany(events);

    res.json({
      success: true,
      count: saved.length,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};