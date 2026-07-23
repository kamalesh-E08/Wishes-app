import api from "./api";
import { getAccessToken } from "./microsoftAuth";

/**
 * List Excel files from OneDrive
 */
export const getExcelFiles = async () => {
  const token = await getAccessToken();

  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/drive/root/children",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch OneDrive files");
  }

  const data = await response.json();

  return (
    data.value?.filter(
      (file: any) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
    ) || []
  );
};

/**
 * First Time Import selected Excel file
 */
export const importOneDriveExcel = async (fileId: string, fileName: string) => {
  const microsoftToken = await getAccessToken();

  const response = await api.post(
    "/onedrive/import",
    {
      fileId,
      fileName,
    },
    {
      headers: {
        "x-ms-token": microsoftToken,
      },
    },
  );

  return response.data;
};

/**
 * Preview selected Excel file
 */
export const previewOneDriveExcel = async (fileId: string) => {
  const microsoftToken = await getAccessToken();

  const response = await api.post(
    "/onedrive/preview",
    {
      fileId,
    },
    {
      headers: {
        "x-ms-token": microsoftToken,
      },
    },
  );

  return response.data;
};

/*
---------------------------------------
Manual Sync
---------------------------------------
*/

export async function syncOneDrive() {
  const msToken = await getAccessToken();

  const response = await api.post(
    "/onedrive/sync",
    {},
    {
      headers: {
        "x-ms-token": msToken,
      },
    },
  );

  return response.data;
}