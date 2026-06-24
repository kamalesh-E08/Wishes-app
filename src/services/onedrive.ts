import * as XLSX from "xlsx";
import { getAccessToken } from "./microsoftAuth";

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

  console.log("GRAPH RESPONSE", data);

  return (
    data.value?.filter(
      (file: any) =>
        file.name?.endsWith(".xlsx") || file.name?.endsWith(".xls"),
    ) || []
  );
};

export const readExcelFromOneDrive = async (downloadUrl: string) => {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error("Failed to download Excel file");
  }

  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: "array",
  });

  const firstSheet = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[firstSheet];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  });

  return rows;
};
