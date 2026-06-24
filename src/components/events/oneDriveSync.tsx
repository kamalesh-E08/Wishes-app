import { useState, useEffect } from "react";
import {
  Cloud,
  CheckCircle,
  Loader2,
  FileSpreadsheet,
  LogOut,
} from "lucide-react";

import {
  loginToOneDrive,
  msalInstance,
  initializeMicrosoftAuth,
  logoutFromOneDrive,
} from "../../services/microsoftAuth";
import { importOneDriveEvents } from "../../services/event";

import { getExcelFiles, readExcelFromOneDrive } from "../../services/onedrive";
import { fetchEventsBySource } from "../../services/event";
import { useEventStore } from "../../store/eventStore";

export default function OneDriveSync() {
  const [connecting, setConnecting] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastImportTime, setLastImportTime] = useState("");

  const { setOneDriveEvents, selectedFile, setSelectedFile } = useEventStore();

  useEffect(() => {
    const loadAccount = async () => {
      try {
        await initializeMicrosoftAuth();
        const account = msalInstance.getActiveAccount();
        if (account) {
          setAccountName(account.username);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadAccount();
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      await loginToOneDrive();
    } catch  {
      console.error("OneDrive Login Error");
    } finally {
      setConnecting(false);
    }
  };

  const loadExcel = async () => {
    try {
      if (!selectedFile) {
        alert("Please select an Excel file");
        return;
      }

      const rows = await readExcelFromOneDrive(
        selectedFile["@microsoft.graph.downloadUrl"],
      );

      setLastImportTime(new Date().toLocaleString());
      const transformedRows = rows.map((row: any) => ({
        name: row.Name,
        email: row.Email,
        department: row.Department,
        occasion: row.EventType || row.Occasion,
        eventDate: row.EventDate,
        source: "onedrive",
        status: "pending",
      }));

      await importOneDriveEvents(transformedRows);

      const response = await fetchEventsBySource("onedrive");
      
      const normalizeEvents = (events: any[]) =>
        events.map((event) => ({
          ...event,
          Name: event.name,
          Email: event.email,
          Department: event.department,
          EventType: event.occasion,
          EventDate: new Date(event.eventDate).toLocaleDateString(),
          status: event.status,
        }));

      setOneDriveEvents(normalizeEvents(response.data));

      alert(`${rows.length} events imported successfully`);
    } catch (error) {
      console.error(error);
      alert("Failed to import file");
    }
  };

  const loadFiles = async () => {
    try {
      setLoadingFiles(true);

      const excelFiles = await getExcelFiles();

      setFiles(excelFiles);

      if (excelFiles.length > 0 && !selectedFile) {
        setSelectedFile(excelFiles[0]);
      }

      alert(`${excelFiles.length} Excel file(s) found`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFiles(false);
    }
  };

  if (accountName) {
    return (
      <div
        className="
        bg-gradient-to-br
        from-green-500/10
        via-emerald-500/10
        to-green-500/5
        border
        border-green-500/20
        rounded-3xl
        p-6
        shadow-xl
        backdrop-blur-sm
      "
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-green-500/20
              flex
              items-center
              justify-center
            "
            >
              <CheckCircle size={28} className="text-green-400" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                OneDrive Connected
              </h3>

              <p className="text-sm text-gray-400 break-all">{accountName}</p>
            </div>
          </div>
        </div>

        {/* File Selector */}
        {files.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-2">
              Select Excel File
            </label>

            <select
              value={selectedFile?.id || ""}
              onChange={(e) => {
                const file = files.find((f) => f.id === e.target.value);

                setSelectedFile(file);
              }}
              className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              px-4
              py-3
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            >
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected File Info */}
        {selectedFile && (
          <div
            className="
            mt-4
            p-4
            rounded-xl
            bg-white/5
            border
            border-white/10
          "
          >
            <p className="text-sm text-gray-400">Selected File</p>

            <p className="font-medium text-white">{selectedFile.name}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={loadFiles}
            disabled={loadingFiles}
            className="
            flex items-center gap-2
            px-4 py-3
            rounded-xl
            bg-purple-500/20
            text-purple-300
            hover:bg-purple-500/30
            disabled:opacity-50
          "
          >
            <Cloud size={18} />
            {loadingFiles ? "Loading..." : "Load Files"}
          </button>

          <button
            onClick={loadExcel}
            disabled={!selectedFile}
            className="
            flex items-center gap-2
            px-4 py-3
            rounded-xl
            bg-blue-500/20
            text-blue-300
            hover:bg-blue-500/30
            disabled:opacity-50
          "
          >
            <FileSpreadsheet size={18} />
            Import Events
          </button>

          <button
            onClick={logoutFromOneDrive}
            className="
            flex items-center gap-2
            px-4 py-3
            rounded-xl
            bg-red-500/20
            text-red-300
            hover:bg-red-500/30
          "
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      disabled={connecting}
      onClick={connect}
      className="
        w-full
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        hover:from-blue-500
        hover:to-indigo-500
        disabled:opacity-50
        disabled:cursor-not-allowed
        px-6
        py-4
        rounded-2xl
        flex
        items-center
        justify-center
        gap-3
        text-white
        font-medium
        shadow-lg
        transition-all
      "
    >
      {connecting ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Connecting to OneDrive...
        </>
      ) : (
        <>
          <Cloud size={20} />
          Connect OneDrive
        </>
      )}
    </button>
  );
}
