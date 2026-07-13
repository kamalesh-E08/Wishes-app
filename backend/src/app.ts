import express from "express";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.routes"
import generateRoutes from "./routes/generate.routes";
import historyRoutes from "./routes/history.routes"
import eventRoutes from "./routes/event.route";
import onedriveRoutes from "./routes/onedrive.routes"
import automationRoutes from "./routes/automation.route";

const app = express();

app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }),
);

app.use("/api/upload", uploadRoutes)
app.use("/api/generate", generateRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/onedrive", onedriveRoutes);
app.use("/api/automation", automationRoutes);

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads",
    ),
  ),
);

export default app;