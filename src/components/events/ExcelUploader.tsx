import { FileSpreadsheet } from "lucide-react";

import { useEventStore } from "../../store/eventStore";

import { uploadExcel, fetchEventsBySource } from "../../services/event";

const normalizeEvents = (events: any[]) =>
  events.map((event) => ({
    ...event,

    Name: event.name,
    Email: event.email,
    Department: event.department,

    EventType: event.occasion,

    // Keep original ISO date
    EventDate: event.eventDate,

    photoUrl: event.photoUrl,

    customMessage: event.customMessage,

    generatedWishImage: event.generatedWishImage,

    generatedWishText: event.generatedWishText,

    status: event.status,
  }));

export default function ExcelUploader() {
  const {
    setManualEvents,
    setUploadedFileName,
    uploadedFileName,
    clearEvents,
  } = useEventStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      // Upload Excel
      const uploadResponse = await uploadExcel(file);

      // Reload events from DB
      const response = await fetchEventsBySource("excel");

      const normalized = normalizeEvents(response.data);

      setManualEvents(normalized);

      setUploadedFileName(file.name);

      alert(`${uploadResponse.data.count} events imported successfully`);
    } catch (error) {
      console.error(error);

      alert("Failed to import Excel");
    }
  };

  if (uploadedFileName) {
    return (
      <div
        className="
          bg-green-500/10
          border
          border-green-500/20
          rounded-2xl
          p-6
        "
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Imported Excel File</h3>

            <p className="text-green-300 mt-2">📄 {uploadedFileName}</p>

            <p className="text-gray-400 text-sm mt-2">
              Events loaded successfully
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <label
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-3
                rounded-xl
                bg-purple-600
                hover:bg-purple-700
                cursor-pointer
                transition
              "
            >
              <FileSpreadsheet size={18} />
              Replace File
              <input
                hidden
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
            </label>

            <button
              onClick={clearEvents}
              className="
                px-4
                py-3
                rounded-xl
                bg-red-500/20
                text-red-300
                hover:bg-red-500/30
              "
            >
              Remove File
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        border-2
        border-dashed
        border-purple-500/40
        rounded-2xl
        p-8
        bg-white/5
      "
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold">Upload Excel File</h3>

        <p className="text-gray-400 mt-2">
          Upload employee birthdays, anniversaries and events
        </p>

        <label
          className="
            inline-flex
            items-center
            gap-2
            mt-6
            px-5
            py-3
            rounded-xl
            bg-purple-600
            hover:bg-purple-700
            cursor-pointer
            transition
          "
        >
          <FileSpreadsheet size={18} />
          Choose Excel File
          <input
            hidden
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}
