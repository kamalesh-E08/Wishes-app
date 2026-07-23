import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EventRecord {
  _id: string;
  userId: string;
  Name: string;
  Email: string;
  EventType: string;
  EventDate: string;
  Department: string;
  WhatsAppGroup?: string;
  photoUrl?: string;
  customMessage?: string;
  generatedWishImage?: string;
  generatedWishText?: string;
  generatedAt?: string;
  status: "pending" | "approved" | "generated" | "sent" | "failed";
  source: "excel" | "onedrive";
}

interface EventStore {
  uploadedFileName: string;
  selectedFile: any | null;
  manualEvents: EventRecord[];
  oneDriveEvents: EventRecord[];
  activeSource: "manual" | "onedrive";
  selectedEvent: EventRecord | null;
  generatedPreview: string;
  
  setUploadedFileName: (fileName: string) => void;
  setSelectedFile: (file: any) => void;
  clearEvents: () => void;
  setManualEvents: (events: EventRecord[]) => void;
  setOneDriveEvents: (events: EventRecord[]) => void;
  setActiveSource: (source: "manual" | "onedrive") => void;
  setSelectedEvent: (event: EventRecord | null) => void;
  setGeneratedPreview: (url: string) => void;
  updateEvent: (id: string, updatedEvent: Partial<EventRecord>) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      uploadedFileName: "",

      selectedFile: null,

      manualEvents: [],

      oneDriveEvents: [],

      activeSource: "manual",

      selectedEvent: null,

      generatedPreview: "",

      setUploadedFileName: (fileName) =>
        set({
          uploadedFileName: fileName,
        }),

      setSelectedFile: (file) =>
        set({
          selectedFile: file,
        }),

      setManualEvents: (events) =>
        set({
          manualEvents: events,
        }),

      setOneDriveEvents: (events) =>
        set({
          oneDriveEvents: events,
        }),

      setActiveSource: (source) =>
        set({
          activeSource: source,
        }),

      setSelectedEvent: (event) =>
        set({
          selectedEvent: event,
        }),

      setGeneratedPreview: (url) =>
        set({
          generatedPreview: url,
        }),
        
      updateEvent: (id: string, updatedEvent: Partial<EventRecord>) => 
        set((state) => {
          const updateList = (list: EventRecord[]) => list.map(e => e._id === id ? { ...e, ...updatedEvent } : e);
          return {
            manualEvents: updateList(state.manualEvents),
            oneDriveEvents: updateList(state.oneDriveEvents)
          };
        }),
        
      deleteEvent: (id: string) => 
        set((state) => {
          const filterList = (list: EventRecord[]) => list.filter(e => e._id !== id);
          return {
            manualEvents: filterList(state.manualEvents),
            oneDriveEvents: filterList(state.oneDriveEvents)
          };
        }),

      clearEvents: () =>
        set({
          uploadedFileName: "",

          selectedFile: null,

          manualEvents: [],

          oneDriveEvents: [],

          selectedEvent: null,

          generatedPreview: "",
        }),
    }),
    {
      name: "wishes-events",
    },
  ),
);
