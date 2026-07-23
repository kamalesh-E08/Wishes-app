import ExcelUploader from "../components/events/ExcelUploader";

export default function ExcelImportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900  dark:text-white  tracking-tight">Manual Import</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">Bulk-add events by uploading an .xlsx file.</p>
      </div>

      {/* Main Content */}
      <ExcelUploader />
    </div>
  );
}
