import * as fs from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";

export async function saveGeneratedImage(base64: string, mimeType: string) {
  const extension = mimeType === "image/png" ? "png" : "jpg";

  const fileName = `${uuid()}.${extension}`;

  const uploadDir = path.join(process.cwd(), "uploads", "generated");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
      recursive: true,
    });
  }

  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

  return `/uploads/generated/${fileName}`;
}
