import type { Request, Response } from "express";
import { buildPrompt } from "../services/promptBuilder";
import { generateImage } from "../services/image.service";
import { saveGeneratedImage } from "../services/storage.service";


import Wish from "../models/Wish";

export async function generateWish(req: Request, res: Response) {
  try {
    console.log("================================");
    console.log("REQUEST RECEIVED");
    if (req.body.additionalInformation?.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Additional information must be under 100 characters",
      });
    }
    const prompt = buildPrompt(req.body);

    console.log("Prompt Length:", prompt.length);
    console.log("Uploaded Image Exists:", !!req.body.uploadedImage);
    console.log("Uploaded Image Length:", req.body.uploadedImage?.length);

    console.log("Generating image...");

    const image = await generateImage(prompt, req.body.uploadedImage);

    console.log("Image Generated");
    console.log("Generated Base64 Length:", image.base64.length);
    console.log("Generated Mime Type:", image.mimeType);

    console.log("Saving Wish...");
    const imagePath = await saveGeneratedImage(image.base64, image.mimeType);

    const wish = await Wish.create({
      occasion: req.body.occasion,
      theme: req.body.theme,

      generatedImage: imagePath,

      people: req.body.people,
      decorations: req.body.decorations,
      customMessage: req.body.customMessage,
      animationEnabled: req.body.animationEnabled,

      prompt,
    });

    console.log("Wish Saved:", wish._id);

    res.json({
      success: true,
      imageURL: `http://localhost:5000${imagePath}`,
      mimeType: image.mimeType,
      wishId: wish._id,
    });
  } catch (error) {
    console.log("================================");
    console.log("ERROR OCCURRED");

    if (error instanceof Error) {
      console.log("Message:", error.message);

      console.log("Stack:", error.stack);
    } else {
      console.log(error);
    }

    res.status(500).json({
      success: false,

      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
}
