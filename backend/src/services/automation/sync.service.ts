import axios from "axios";

import Event from "../../models/Event";
import OneDriveConnection from "../../models/OneDriveConnection";
import { parseExcel } from "../excel.service";

interface SyncResult {
  inserted: number;
  updated: number;
  deleted: number;
  unchanged: number;
}

export async function syncOneDriveEvents(
  userId: string,
  accessToken: string,
): Promise<SyncResult> {
  console.log("========================================");
  console.log("OneDrive Synchronization Started");

  const connection = await OneDriveConnection.findOne({
    userId,
    syncEnabled: true,
  });

  if (!connection) {
    throw new Error("No OneDrive connection found.");
  }

  console.log("File :", connection.fileName);

  /*
      Download latest excel
  */

  console.log("Fetching Excel metadata from Graph API...");
  const metadataResponse = await axios.get(
    `https://graph.microsoft.com/v1.0/me/drive/items/${connection.fileId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  console.log("Excel Downloaded");

  const buffer = Buffer.from(response.data);

  const rows = parseExcel(buffer);

  console.log(`${rows.length} rows found`);

  /*
      Existing Events
  */

  const existingEvents = await Event.find({
    userId,
    source: "onedrive",
  });

  const existingMap = new Map();

  existingEvents.forEach((event) => {
    const key = `${event.email}_${event.occasion}`;

    existingMap.set(key, event);
  });

  const excelKeys = new Set<string>();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  /*
      Compare Excel with MongoDB
  */

  // Filter out invalid/incomplete rows from Excel
  const validRows = rows.filter((row: any) => {
    return (
      row.Name &&
      row.Email &&
      row.EventDate &&
      row.EventDate instanceof Date &&
      !isNaN(row.EventDate.getTime())
    );
  });

  for (const row of validRows) {
    const key = `${row.Email}_${row.EventType}`;

    if (excelKeys.has(key)) {
      console.log(`Skipping duplicate key in excel rows: ${key}`);
      continue;
    }

    excelKeys.add(key);

    const dbEvent = existingMap.get(key);

    const eventData = {
      userId,

      name: row.Name,

      email: row.Email,

      photoUrl: row.PhotoURL,

      occasion: row.EventType,

      eventDate: row.EventDate!,

      eventMonth: row.EventDate!.getMonth() + 1,

      eventDay: row.EventDate!.getDate(),

      department: row.Department,

      customMessage: row.CustomMessage,

      source: "onedrive" as const,
    };

    /*
        INSERT
    */

    if (!dbEvent) {
      await Event.create({
        ...eventData,
        status: "pending",
      });

      inserted++;

      continue;
    }

    /*
        Compare fields
    */

    const changed =
      dbEvent.name !== eventData.name ||
      dbEvent.department !== eventData.department ||
      dbEvent.photoUrl !== eventData.photoUrl ||
      dbEvent.customMessage !== eventData.customMessage ||
      dbEvent.eventDate.getTime() !== eventData.eventDate.getTime();

    /*
        UPDATE
    */

    if (changed) {
      await Event.updateOne(
        {
          _id: dbEvent._id,
        },
        {
          $set: {
            ...eventData,

            status: "pending",
          },
        },
      );

      updated++;
    } else {
      unchanged++;
    }
  }

  /*
      DELETE removed employees
  */

  let deleted = 0;

  for (const event of existingEvents) {
    const key = `${event.email}_${event.occasion}`;

    if (!excelKeys.has(key)) {
      await Event.deleteOne({
        _id: event._id,
      });

      deleted++;
    }
  }

  /*
      Save Sync Time
  */

  connection.lastSync = new Date();

  await connection.save();

  console.log("========================================");
  console.log("Synchronization Completed");

  console.table({
    inserted,
    updated,
    deleted,
    unchanged,
  });

  return {
    inserted,
    updated,
    deleted,
    unchanged,
  };
}
