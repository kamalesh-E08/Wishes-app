import * as XLSX from "xlsx";

export const parseExcel = (fileBuffer: Buffer) => {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
    cellDates: true,
  });

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<any>(worksheet, {
    raw: true,
    defval: "",
  });

  console.log("==================================");
  console.log("RAW EXCEL VALUE");
  console.log("Value:", rows[0].EventDate);
  console.log("Type:", typeof rows[0].EventDate);
  console.log("Is Date:", rows[0].EventDate instanceof Date);

  return rows.map((row) => ({
    ...row,
    EventDate: parseExcelDate(row.EventDate),
  }));
};

function parseExcelDate(value: any): Date {
  if (value instanceof Date) {
    const correctedDate = new Date(value.getTime());
    correctedDate.setDate(correctedDate.getDate() + 1);
    return correctedDate;
  }

  if (typeof value === "number") {
    const excelDate = XLSX.SSF.parse_date_code(value);

    const correctedDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d);

    correctedDate.setDate(correctedDate.getDate() + 1);

    return correctedDate;
  }

  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  throw new Error(`Invalid EventDate: ${value}`);
}
