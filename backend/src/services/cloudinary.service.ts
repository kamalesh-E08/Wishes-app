import cloudinary from "../config/cloudinary";

export async function uploadToCloudinary(imageBase64: string) {
  const result = await cloudinary.uploader.upload(imageBase64, {
    folder: "wishes-ai",
  });

  return result.secure_url;
}
