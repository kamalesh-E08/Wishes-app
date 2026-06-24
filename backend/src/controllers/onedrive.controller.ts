import axios from "axios";

import type { Request, Response } from "express";

export const listExcelFiles = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/drive/root/children",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const excelFiles = response.data.value.filter(
      (file: any) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
    );

    return res.json(excelFiles);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch files",
    });
  }
};
