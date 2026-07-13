import sharp from "sharp";

export async function compressImageFromUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Failed to download image");
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  const fileSizeMB = buffer.length / 1024 / 1024;

  // Same logic as frontend
  if (fileSizeMB < 1) {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }

  const quality = fileSizeMB >= 2 ? 60 : 80;

  const compressed = await sharp(buffer)
    .jpeg({
      quality,
    })
    .toBuffer();

  return `data:image/jpeg;base64,${compressed.toString("base64")}`;
}
