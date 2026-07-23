import OneDriveSync from "../components/events/oneDriveSync";

export default function OneDrivePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900  dark:text-white tracking-tight">OneDrive</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Sync files and contacts directly from your Microsoft cloud.</p>
        </div>
      </div>

      {/* Main Content */}
      <OneDriveSync />
    </div>
  );
}
