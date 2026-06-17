import dotenv from "dotenv";
dotenv.config();

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
}
export async function generateImage(prompt: string, uploadedImage?: string) {
  try {
    console.log(prompt);
    console.log(uploadedImage);
    console.log("================================");
    console.log("IMAGE SERVICE STARTED");

    const parts: GeminiPart[] = [];

    if (uploadedImage) {
      console.log("Processing uploaded image...");

      const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);

      if (!matches) {
        throw new Error("Invalid base64 image format");
      }

      const mimeType = matches[1];
      const base64Image = matches[2];

      console.log("Mime Type:", mimeType);
      console.log("Base64 Length:", base64Image.length);

      parts.push({
        inlineData: {
          mimeType,
          data: base64Image,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    console.log("Prompt Length:", prompt.length);
    console.log("Sending request to Gemini...");
    console.log("Request sent");
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts,
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      },
    );

    console.log("Gemini Status:", response.status);

    const result = await response.json();

    if (!response.ok) {
      console.log("Gemini Error:", JSON.stringify(result, null, 2));

      throw new Error(result?.error?.message || `HTTP ${response.status}`);
    }

    console.log("Gemini Response Received");

    const candidate = result?.candidates?.[0];

    if (!candidate) {
      throw new Error("No candidate returned");
    }

    const imagePart = candidate.content.parts.find(
      (part: GeminiPart) => part.inlineData,
    );

    if (!imagePart) {
      console.log(JSON.stringify(result, null, 2));

      throw new Error("No image generated");
    }

    console.log("Image Generated Successfully");
    console.log("Output Mime Type:", imagePart.inlineData.mimeType);

    return {
      base64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || "image/png",
    };
  } catch (error) {
    console.log("================================");
    console.log("IMAGE SERVICE ERROR");

    if (error instanceof Error) {
      console.log("Message:", error.message);
      console.log("Stack:", error.stack);
    }

    throw error;
  }
}
