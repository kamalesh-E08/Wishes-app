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

    console.log("PARSED ROW:");
    console.log(rows[0]);
    console.log("TYPE:", typeof rows[0].EventDate);
    console.log(rows[0].EventDate);

    const userId = req.headers["firebase-uid"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Filter duplicate rows (by Email and Occasion/EventType) inside the excel file
    const seen = new Set<string>();
    const uniqueRows = rows.filter((row: any) => {
      const occasion = row.EventType || row.Occasion || "";
      const key = `${row.Email}_${occasion}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    // Filter out rows with invalid or missing EventDate/Name/Email
    const validRows = uniqueRows.filter((row: any) => {
      return (
        row.Name &&
        row.Email &&
        row.EventDate &&
        row.EventDate instanceof Date &&
        !isNaN(row.EventDate.getTime())
      );
    });

    const events = validRows.map((row: any) => ({
      userId,
      name: row.Name,
      email: row.Email,
      photoUrl: row.PhotoURL,
      occasion: row.EventType || row.Occasion,
      eventDate: row.EventDate,
      eventMonth: row.EventDate.getMonth() + 1,
      eventDay: row.EventDate.getDate(),
      department: row.Department,
      customMessage: row.CustomMessage,
      source: "excel",
      status: "pending",
    }));

    console.log(`${events.length} unique events to insert`);

    // Clean up previous manually uploaded events for the user
    await Event.deleteMany({
      userId,
      source: "excel",
    });

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

    const events = req.body.map((event: any) => {
      const date = new Date(event.eventDate);
      return {
        ...event,
        userId,
        eventDate: date,
        eventMonth: date.getMonth() + 1,
        eventDay: date.getDate(),
      };
    });
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

export const saveGeneratedWish = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const { generatedWishImage, generatedWishText } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        generatedWishImage,
        generatedWishText,
        generatedAt: new Date(),
        status: "generated",
      },
      {
        new: true,
      },
    );

    res.json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};