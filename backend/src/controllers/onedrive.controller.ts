import axios from "axios";
import type { Response } from "express";
import OneDriveConnection from "../models/OneDriveConnection";
import { syncOneDriveEvents } from "../services/automation/sync.service";
import Event from "../models/Event";
import { parseExcel } from "../services/excel.service";
import { AuthRequest } from "../middleware/auth";

export async function importOneDriveExcel(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { fileId, fileName } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File Id missing",
      });
    }

    const msToken = req.headers["x-ms-token"] as string;

    if (!msToken) {
      return res.status(400).json({
        success: false,
        message: "Microsoft Access Token missing",
      });
    }

    await OneDriveConnection.findOneAndUpdate(
      { userId },
      {
        fileId,
        fileName,
        syncEnabled: true,
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("============================");
    console.log("Downloading Excel...");
    console.log("File Id:", fileId);

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${msToken}`,
        },
      },
    );

    console.log("Excel downloaded successfully");

    const buffer = Buffer.from(response.data);

    console.log("Parsing Excel...");

    const rows = parseExcel(buffer);

    console.log(`${rows.length} rows found`);

    const events = rows.map((row: any) => ({
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

      source: "onedrive",

      status: "pending",
    }));

    console.log("Saving events...");

    await Event.deleteMany({
      userId,
      source: "onedrive",
    });

    const saved = await Event.insertMany(events);

    console.log(`${saved.length} events imported`);

    return res.json(saved);
  } catch (error: any) {
    console.log("============================");
    console.log("IMPORT FAILED");

    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function syncOneDrive(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const accessToken = req.headers["x-ms-token"] as string;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Microsoft Access Token Missing",
      });
    }

    console.log("======================================");
    console.log("Manual OneDrive Sync Requested");
    console.log("User :", userId);

    const connection = await OneDriveConnection.findOne({
      userId,
      syncEnabled: true,
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "No OneDrive file connected.",
      });
    }

    const result = await syncOneDriveEvents(userId, accessToken);

    connection.lastSync = new Date();

    await connection.save();

    return res.json({
      success: true,

      fileName: connection.fileName,

      lastSync: connection.lastSync,

      summary: result,
    });
  } catch (error: any) {
    console.error("======================================");
    console.error("OneDrive Sync Failed");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}