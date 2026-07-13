import { useEffect, useState } from "react";
import {
  Cloud,
  CheckCircle,
  Loader2,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
} from "lucide-react";

import {
  initializeMicrosoftAuth,
  loginToOneDrive,
  logoutFromOneDrive,
  msalInstance,
} from "../../services/microsoftAuth";

import {
  getExcelFiles,
  importOneDriveExcel,
  syncOneDrive,
} from "../../services/onedrive";

import { fetchEventsBySource } from "../../services/event";

import { useEventStore } from "../../store/eventStore";

export default function OneDriveSync() {
  const [connecting, setConnecting] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [accountName, setAccountName] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState("");

  const { selectedFile, setSelectedFile, setOneDriveEvents } = useEventStore();

  useEffect(() => {
    const loadAccount = async () => {
      try {
        await initializeMicrosoftAuth();

        const account = msalInstance.getActiveAccount();

        if (account) {
          setAccountName(account.username);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadAccount();
  }, []);

  const normalizeEvents = (events: any[]) =>
    events.map((event) => ({
      ...event,
      Name: event.name,
      Email: event.email,
      Department: event.department,
      EventType: event.occasion,
      EventDate: new Date(event.eventDate).toLocaleDateString("en-GB"),
      status: event.status,
    }));

  const refreshOneDriveEvents = async () => {
    const response = await fetchEventsBySource("onedrive");

    setOneDriveEvents(normalizeEvents(response.data));
  };

  const connect = async () => {
    try {
      setConnecting(true);

      await loginToOneDrive();
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const loadFiles = async () => {
    try {
      setLoadingFiles(true);

      const excelFiles = await getExcelFiles();

      setFiles(excelFiles);

      if (excelFiles.length > 0) {
        setSelectedFile(excelFiles[0]);
      }

      alert(`${excelFiles.length} Excel file(s) found.`);
    } catch (err) {
      console.error(err);
      alert("Unable to load OneDrive files.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const importEvents = async () => {
    try {
      if (!selectedFile) {
        alert("Please select an Excel file.");
        return;
      }

      setImporting(true);

      await importOneDriveExcel(selectedFile.id, selectedFile.name);

      await refreshOneDriveEvents();

      setLastSyncTime(new Date().toLocaleString());

      alert("Excel imported successfully.");
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const syncNow = async () => {
    try {
      setSyncing(true);

      const result = await syncOneDrive();

      await refreshOneDriveEvents();

      setLastSyncTime(new Date().toLocaleString());

      alert(
        `Synchronization Completed

Inserted : ${result.summary.inserted}

Updated : ${result.summary.updated}

Deleted : ${result.summary.deleted}

Unchanged : ${result.summary.unchanged}`,
      );
    } catch (err) {
      console.error(err);

      alert("Synchronization failed.");
    } finally {
      setSyncing(false);
    }
  };

  if (!accountName) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="
          w-full
          rounded-2xl
          py-4
          bg-blue-600
          hover:bg-blue-700
          text-white
          flex
          items-center
          justify-center
          gap-3
          disabled:opacity-60
        "
      >
        {connecting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Connecting...
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

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" />

          <div>
            <h3 className="font-semibold">OneDrive Connected</h3>

            <p className="text-sm text-gray-400">{accountName}</p>
          </div>
        </div>

        <button
          onClick={logoutFromOneDrive}
          className="text-red-400 hover:text-red-300"
        >
          <LogOut />
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={loadFiles}
          disabled={loadingFiles}
          className="
            w-full
            rounded-xl
            bg-purple-600
            hover:bg-purple-700
            py-3
            text-white
            disabled:opacity-60
          "
        >
          {loadingFiles ? "Loading Files..." : "Load Excel Files"}
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <label className="block mb-2 text-sm">Select Excel File</label>

          <select
            value={selectedFile?.id || ""}
            onChange={(e) => {
              const file = files.find((f) => f.id === e.target.value);

              setSelectedFile(file);
            }}
            className="
              w-full
              rounded-xl
              bg-black/20
              border
              border-white/10
              px-4
              py-3
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

      <button
        onClick={importEvents}
        disabled={!selectedFile || importing}
        className="
          mt-6
          w-full
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          py-3
          text-white
          flex
          items-center
          justify-center
          gap-2
          disabled:opacity-60
        "
      >
        <FileSpreadsheet size={18} />

        {importing ? "Importing..." : "Import Excel"}
      </button>

      <button
        onClick={syncNow}
        disabled={syncing}
        className="
          mt-3
          w-full
          rounded-xl
          bg-green-600
          hover:bg-green-700
          py-3
          text-white
          flex
          items-center
          justify-center
          gap-2
          disabled:opacity-60
        "
      >
        <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />

        {syncing ? "Synchronizing..." : "Sync Now"}
      </button>

      {lastSyncTime && (
        <div
          className="
            mt-5
            rounded-xl
            bg-white/5
            p-3
            border
            border-white/10
          "
        >
          <p className="text-xs text-gray-400">Last Synchronization</p>

          <p className="text-sm font-medium">{lastSyncTime}</p>
        </div>
      )}
    </div>
  );
}
