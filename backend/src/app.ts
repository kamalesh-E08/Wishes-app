import express from "express";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.routes"
import generateRoutes from "./routes/generate.routes";
import historyRoutes from "./routes/history.routes"
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