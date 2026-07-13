import Event from "../../models/Event";
import Wish from "../../models/Wish";

import { getCompressedEmployeeImage } from "./employeeImage.service";
import { buildAutomationPrompt } from "./automationPrompt.service";
import { generateImage } from "../image.service";
import { uploadToCloudinary } from "../cloudinary.service";

export async function generateEventWish(eventId: string) {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.photoUrl) {
    throw new Error(`Photo URL missing for ${event.name}`);
  }

  console.log("Downloading employee image...");

  const uploadedImage = await getCompressedEmployeeImage(event.photoUrl);

  console.log("Building prompt...");

  const prompt = buildAutomationPrompt(event);

  console.log("Generating AI image...");

  const image = await generateImage(prompt, uploadedImage, "flux");

  console.log("Uploading to Cloudinary...");

  const imageUrl = await uploadToCloudinary(
    `data:${image.mimeType};base64,${image.base64}`,
  );

  console.log("Saving wish...");

  const wish = await Wish.create({
    user: event.userId,
    occasion: event.occasion,
    theme: "Corporate",
    generatedImage: imageUrl,
    people: ["Employee"],
    decorations: ["Confetti"],
    customMessage: event.customMessage,
    animationEnabled: false,
    aiProvider: "flux",
    prompt,
  });

  event.generatedWishImage = imageUrl;
  event.generatedWishText = event.customMessage || "";
  event.generatedAt = new Date();
  event.status = "generated";

  await event.save();

  console.log("Wish Generated Successfully");

  return {
    success: true,
    wish,
    event,
  };
}
