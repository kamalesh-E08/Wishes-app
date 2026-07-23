import Event from "../../models/Event";
import OneDriveConnection from "../../models/OneDriveConnection";
import { syncOneDriveEvents } from "./sync.service";
import { generateEventWish } from "./automation.service";
import { sendWishMail } from "../email/sendWishMail";

export async function generateTodayEvents() {
  // Sync connected OneDrive Excel sheets before processing events
  try {
    const activeConnections = await OneDriveConnection.find({ syncEnabled: true });
    for (const connection of activeConnections) {
      if (connection.accessToken) {
        try {
          console.log(`Auto-syncing OneDrive file "${connection.fileName}"...`);
          await syncOneDriveEvents(connection.userId, connection.accessToken);
        } catch (syncErr: any) {
          console.error(`Auto-sync failed for ${connection.fileName}:`, syncErr?.message || syncErr);
        }
      }
    }
  } catch (err) {
    console.error("Error during OneDrive auto-sync:", err);
  }

  const today = new Date();

  const month = today.getMonth() + 1;
  const day = today.getDate();

  const events = await Event.find({
    status: "pending",

    eventMonth: month,

    eventDay: day,
  });

  console.log(`Found ${events.length} event(s)`);

  for (const event of events) {
    try {
      console.log("================================");
      console.log(`Generating for ${event.name}`);

      // Optional: mark as generating
      event.status = "generating" as any;
      await event.save();

      const result = await generateEventWish(event._id.toString());

      console.log("Image generated successfully");

      // Optional: mark as sending
      event.status = "sending" as any;
      await event.save();

      const imageUrl = result.event.generatedWishImage;

      if (!imageUrl) {
        throw new Error("Generated image URL is missing");
      }

      await sendWishMail({
        to: event.email,
        name: event.name,
        occasion: event.occasion,
        imageUrl,
        customMessage: event.customMessage,
      });

      event.status = "sent";
      await event.save();

      console.log(`${event.name} completed`);
    } catch (error) {
      console.log("================================");
      console.log(`Automation failed for ${event.name}`);

      event.status = "failed";
      await event.save();

      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      } else {
        console.error(error);
      }
    }
  }

  return events.length;
}
