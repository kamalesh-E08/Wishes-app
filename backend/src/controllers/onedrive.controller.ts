import axios from "axios";
import type { Response } from "express";
import OneDriveConnection from "../models/OneDriveConnection";
import { syncOneDriveEvents } from "../services/automation/sync.service";
import Event from "../models/Event";
import { parseExcel } from "../services/excel.service";
import type { AuthRequest } from "../middleware/auth";

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
        accessToken: msToken,
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("============================");
    console.log("Downloading Excel...");
    console.log("File Id:", fileId);

    console.log("Fetching Excel metadata from Graph API...");
    const metadataResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${msToken}`,
        },
      }
    );

    const downloadUrl = metadataResponse.data["@microsoft.graph.downloadUrl"];
    if (!downloadUrl) {
      throw new Error("Could not retrieve download URL for the Excel file from Graph API.");
    }

    console.log("Downloading Excel content...");
    const response = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });

    console.log("Excel downloaded successfully");

    const buffer = Buffer.from(response.data);

    console.log("Parsing Excel...");

    const rows = parseExcel(buffer);

    console.log(`${rows.length} rows found`);

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

      source: "onedrive",

      status: "pending",
    }));

    console.log(`Saving ${events.length} unique events...`);

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

    connection.accessToken = accessToken;
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

export async function previewOneDriveExcel(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ success: false, message: "File Id missing" });
    }

    const msToken = req.headers["x-ms-token"] as string;
    if (!msToken) {
      return res.status(400).json({ success: false, message: "Microsoft Access Token missing" });
    }

    console.log("Fetching Excel metadata for preview...");
    const metadataResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      { headers: { Authorization: `Bearer ${msToken}` } }
    );

    const downloadUrl = metadataResponse.data["@microsoft.graph.downloadUrl"];
    if (!downloadUrl) throw new Error("Could not retrieve download URL for preview.");

    console.log("Downloading Excel content for preview...");
    const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    console.log("Parsing Excel for preview...");
    const rows = parseExcel(buffer);

    const previewData = rows.slice(0, 15).map((row: any) => {
      let formattedDate = "";
      if (row.EventDate instanceof Date && !isNaN(row.EventDate.getTime())) {
        formattedDate = row.EventDate.toISOString().split("T")[0];
      }
      return {
        Name: row.Name || row.name || "Unknown",
        Email: row.Email || row.email || "",
        EventType: row.EventType || row.Occasion || "Unknown",
        EventDate: formattedDate || row.EventDate || "",
        photoUrl: row.PhotoURL || row.photoUrl || null
      }
    });

    return res.json(previewData);
  } catch (error: any) {
    console.error("PREVIEW FAILED", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}