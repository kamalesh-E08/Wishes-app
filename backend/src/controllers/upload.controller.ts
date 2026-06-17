import type { Request, Response } from "express";

import cloudinary from "../config/cloudinary";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const base64 = Buffer.from(file.buffer).toString("base64");

    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "wishes-ai",
    });

    console.log("upload req received");
    console.log(req.file);

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
};
