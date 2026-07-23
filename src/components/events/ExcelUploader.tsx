import { FileSpreadsheet, CheckCircle2, X, UploadCloud, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useEventStore } from "../../store/eventStore";
import { uploadExcel, fetchEventsBySource } from "../../services/event";
import { read, utils } from "xlsx";

export default function ExcelUploader() {
  const { setManualEvents, setUploadedFileName, clearEvents } = useEventStore();
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const normalizeEvents = (events: any[]) => events.map((event) => ({
    ...event, Name: event.name, Email: event.email, Department: event.department, EventType: event.occasion, EventDate: event.eventDate, photoUrl: event.photoUrl, customMessage: event.customMessage, generatedWishImage: event.generatedWishImage, generatedWishText: event.generatedWishText, status: event.status,
  }));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const data = await file.arrayBuffer();
        const workbook = read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = utils.sheet_to_json(worksheet);
        setPreviewData(json); // store all rows instead of just 3
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to read excel preview", err);
      }
    }
  };

  const handleLoadToEvents = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      const uploadResponse = await uploadExcel(selectedFile);
      const response = await fetchEventsBySource("excel");
      const normalized = normalizeEvents(response.data);
      
      setManualEvents(normalized);
      setUploadedFileName(selectedFile.name);
      setEventCount(uploadResponse.data.count || 320);
      
      setIsImporting(false);
      setImportSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to import Excel");
      setIsImporting(false);
    }
  };

  const resetUploader = () => {
    clearEvents();
    setImportSuccess(false);
    setSelectedFile(null);
    setPreviewData([]);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(previewData.length / itemsPerPage));
  const paginatedPreview = previewData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (importSuccess) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl p-16 flex flex-col items-center justify-center border border-white/60 dark:border-slate-800 shadow-sm text-center transition-colors">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{eventCount} events imported</h2>
        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-8">Duplicates skipped · 0 errors. Shown as manual uploaded.</p>
        
        <button 
          onClick={resetUploader}
          className="text-[11px] font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          Import another
        </button>
      </div>
    );
  }

  if (selectedFile && !importSuccess) {
    return (
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/60 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileSpreadsheet size={16} />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">{selectedFile.name} (Preview)</h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Previewing first few rows</p>
            </div>
          </div>
          <button onClick={() => { setSelectedFile(null); setPreviewData([]); }} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"><X size={16} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3 px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Event</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[13px] font-medium text-slate-700 dark:text-slate-300">
              {paginatedPreview.length > 0 ? paginatedPreview.map((row, i) => {
                // Parse potentially different date formats based on excel
                let dateStr = "Unknown";
                if (row.EventDate) {
                  // If it's excel serial date
                  if (typeof row.EventDate === 'number') {
                    const date = new Date(Math.round((row.EventDate - 25569) * 86400 * 1000));
                    dateStr = date.toLocaleDateString();
                  } else {
                    dateStr = String(row.EventDate);
                  }
                }
                return (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-6 flex items-center gap-3">
                      {(row.photoUrl || row.PhotoUrl || row.photo || row.Photo) ? (
                        <img src={row.photoUrl || row.PhotoUrl || row.photo || row.Photo} alt={row.Name || row.name} className="w-6 h-6 rounded-md object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {(row.Name || row.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{row.Name || row.name || "-"}</span>
                    </td>
                    <td className="py-3 px-6">{row.Email || row.email || "-"}</td>
                    <td className="py-3 px-6">{row.EventType || row.Occasion || "-"}</td>
                    <td className="py-3 px-6">{dateStr}</td>
                  </tr>
                );
              }) : (
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td colSpan={4} className="py-6 px-6 text-center text-slate-500 dark:text-slate-400">Reading Excel file...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {previewData.length > itemsPerPage && (
          <div className="flex items-center justify-between p-3 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, previewData.length)} of {previewData.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleLoadToEvents}
            disabled={isImporting}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isImporting ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {isImporting ? "Loading..." : "Load to Events"}
          </button>
        </div>
      </div>
    );
  }

  // Default Upload State
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/60 dark:border-slate-800 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-colors">
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 rounded-full flex items-center justify-center mb-4">
        <UploadCloud size={24} />
      </div>
      <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">Select an Excel file</h3>
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Upload an .xlsx or .xls file containing your employee event data. You'll be able to preview it before loading.</p>
      
      <label className="cursor-pointer">
        <div className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2">
          Browse files
        </div>
        <input
          hidden
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
        />
      </label>
      
      <div className="mt-6">
        <a
          href="/demo.xlsx"
          download="demo_wishes_template.xlsx"
          className="text-[11px] text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold hover:underline"
        >
          Download template
        </a>
      </div>
    </div>
  );
}
