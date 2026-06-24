import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EventRecord {
  Name: string;
  Email: string;
  EventType: string;
  EventDate: string;
  Department: string;
  WhatsAppGroup: string;
}

interface EventStore {
  selectedFile: any | null;
  uploadedFileName: string;
  manualEvents: any[];
  oneDriveEvents: any[];
  activeSource: "manual" | "onedrive";

  setUploadedFileName: (fileName: string) => void;
  setSelectedFile: (file: any) => void;
  clearEvents: () => void;
  setManualEvents: (events: any[]) => void;
  setOneDriveEvents: (events: any[]) => void;
  setActiveSource: (source: "manual" | "onedrive") => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({

      uploadedFileName: "",
      selectedFile: null,
      manualEvents: [],
      oneDriveEvents: [],
      activeSource: "manual",


      setSelectedFile: (file) => set({ selectedFile: file }),
      setUploadedFileName: (fileName) =>
        set({
          uploadedFileName: fileName,
        }),
      clearEvents: () =>
        set({
  
          selectedFile: null,
          uploadedFileName: "",
        }),
      setManualEvents: (events) => set({ manualEvents: events }),

      setOneDriveEvents: (events) => set({ oneDriveEvents: events }),

      setActiveSource: (source) => set({ activeSource: source }),
    }),
    {
      name: "wishes-events",
    },
  ),
);
