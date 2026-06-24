import XLSX from "xlsx";

export const parseExcel = (fileBuffer: Buffer) => {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(sheet);

  return data;
};
