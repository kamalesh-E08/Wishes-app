import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { verifyTransporter } from "./services/email/transporter";
import { startAutomationCron } from "./cron/automation.cron";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    console.log("======================================");
    console.log("Server Timezone");
    console.log("Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log("Offset:", new Date().getTimezoneOffset());
    console.log("Current:", new Date());
    console.log("ISO:", new Date().toISOString());
    console.log("======================================");

    await verifyTransporter();

    startAutomationCron();
    
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed");
    console.error(error);
  }
}

startServer();
