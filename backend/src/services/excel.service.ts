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

  // Filter out empty rows (where name and email are both empty)
  const validRows = rows.filter(row => {
    const name = (row.Name || row.name || "").toString().trim();
    const email = (row.Email || row.email || "").toString().trim();
    return name !== "" || email !== "";
  });

  return validRows.map((row) => {
    // Standardize key names (case-insensitive or common variations)
    const Name = row.Name || row.name || "";
    const Email = row.Email || row.email || "";
    const PhotoURL = row.PhotoURL || row.photoUrl || row.PhotoUrl || "";
    const EventType = row.EventType || row.eventType || row.Occasion || row.occasion || "";
    const EventDateVal = row.EventDate || row.eventDate || row.Eventdate || row.Date || row.date || "";
    const Department = row.Department || row.department || "";
    const CustomMessage = row.CustomMessage || row.customMessage || "";

    let parsedDate: Date | null = null;
    try {
      parsedDate = parseExcelDate(EventDateVal);
    } catch (e) {
      console.warn(`Failed to parse date for row (${Name}, ${Email}): ${EventDateVal}`, e);
    }

    return {
      Name: Name.toString().trim(),
      Email: Email.toString().trim(),
      PhotoURL: PhotoURL.toString().trim(),
      EventType: EventType.toString().trim(),
      EventDate: parsedDate,
      Department: Department.toString().trim(),
      CustomMessage: CustomMessage.toString().trim(),
    };
  });
};

function parseExcelDate(value: any): Date {
  if (!value) {
    throw new Error("Date value is empty or missing");
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error("Date object is invalid");
    }
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
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error("Date string is empty");
    }

    // Try standard Date parsing first (handles YYYY-MM-DD, MM/DD/YYYY, etc.)
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Fallback: manual parsing for YYYY-MM-DD or DD-MM-YYYY
    const parts = trimmed.split(/[-/]/).map(Number);
    if (parts.length === 3) {
      // Check if it's YYYY-MM-DD
      if (parts[0] > 1000) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
      // Check if it's DD-MM-YYYY
      if (parts[2] > 1000) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
  }

  throw new Error(`Invalid EventDate format: ${value}`);
}
