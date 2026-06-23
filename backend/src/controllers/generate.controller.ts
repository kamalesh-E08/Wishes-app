import type { AuthRequest } from "../middleware/auth";
import type { Response } from "express";
import { buildFluxPrompt } from "../services/promptBuilder";
import { generateImage } from "../services/image.service";
import {uploadToCloudinary} from "../services/cloudinary.service"

import Wish from "../models/Wish";

export async function generateWish(req: AuthRequest, res: Response) {
  try {
    console.log("================================");
    console.log("REQUEST RECEIVED");
    if (req.body.additionalInformation?.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Additional information must be under 100 characters",
      });
    }
    let prompt = "";

    switch (req.body.aiEngine) {
      case "flux":
        prompt = buildFluxPrompt(req.body);
        break;

      case "gemini":
        prompt = buildFluxPrompt(req.body);
        break;
    }

    console.log("Prompt Length:", prompt.length);
    console.log("Uploaded Image Exists:", !!req.body.uploadedImage);
    console.log("Uploaded Image Length:", req.body.uploadedImage?.length);

    console.log("Generating image...");

    const image = await generateImage(prompt, req.body.uploadedImage, req.body.aiEngine);

    console.log("Image Generated");
    console.log("Generated Base64 Length:", image.base64.length);
    console.log("Generated Mime Type:", image.mimeType);

    console.log("Saving Wish...");
    const imageUrl = await uploadToCloudinary(
      `data:${image.mimeType};base64,${image.base64}`,
    );
    const wish = await Wish.create({
      user: req.user?.uid,
      occasion: req.body.occasion,
      theme: req.body.theme,
      generatedImage: imageUrl,
      people: req.body.people,
      decorations: req.body.decorations,
      customMessage: req.body.customMessage,
      animationEnabled: req.body.animationEnabled,
      aiProvider:req.body.aiEngine, 
      prompt,
    });

    console.log("Wish Saved:", wish._id);

    res.json({
      success: true,
      imageURL: imageUrl,
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
