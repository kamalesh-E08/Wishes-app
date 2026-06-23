import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

export async function generateWithFlux(prompt: string, uploadedImage?: string) {
  if (!uploadedImage) {
    throw new Error("Uploaded image required");
  }

  const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);

  if (!matches) {
    throw new Error("Invalid image format");
  }

  const mimeType = matches[1];

  const imageBuffer = Buffer.from(matches[2], "base64");

  const imageBlob = new Blob([imageBuffer], {
    type: mimeType,
  }) as unknown as Blob;

  const result = await client.imageToImage({
    provider: "replicate",
    model: "black-forest-labs/FLUX.2-klein-9B",
    inputs: imageBlob,
    parameters: {
      prompt,
    },
  });

  const outputBuffer = Buffer.from(await result.arrayBuffer());

  return {
    base64: outputBuffer.toString("base64"),
    mimeType: "image/png",
  };
}
