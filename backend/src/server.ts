import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
connectDB();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
