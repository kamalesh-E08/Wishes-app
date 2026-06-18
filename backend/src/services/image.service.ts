import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateImage(prompt: string, uploadedImage?: string) {
  console.log("================================");
  console.log("IMAGE SERVICE STARTED");

  const parts: any[] = [];

  if (uploadedImage) {
    const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      throw new Error("Invalid image format");
    }

    parts.push({
      inlineData: {
        mimeType: matches[1],
        data: matches[2],
      },
    });
  }

  parts.push({
    text: prompt,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  const candidate = response.candidates?.[0];

  if (!candidate) {
    throw new Error("No candidate returned");
  }

  const imagePart = candidate.content?.parts?.find(
    (part: any) => part.inlineData,
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image generated");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}
