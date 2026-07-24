import { useEffect, useCallback, useState } from "react";
import { fetchEventsBySource } from "../services/event";
import { useEventStore } from "../store/eventStore";
import ImportedEventsTable from "../components/events/ImportedEventsTable";
import AddEventModal from "../components/events/AddEventModal";

export default function EventDashboardPage() {
  const { setManualEvents, setOneDriveEvents } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeEvents = (events: any[]) =>
    events.map((event) => ({
      ...event,
      Name: event.name,
      Email: event.email,
      Department: event.department,
      EventType: event.occasion,
      EventDate: event.eventDate,
      photoUrl: event.photoUrl,
      generatedWishImage: event.generatedWishImage,
      generatedWishText: event.generatedWishText,
      generatedAt: event.generatedAt,
      status: event.status,
    }));

  const loadEvents = useCallback(async () => {
    try {
      const [manual, onedrive] = await Promise.all([
        fetchEventsBySource("excel"),
        fetchEventsBySource("onedrive"),
      ]);
      setManualEvents(normalizeEvents(manual.data));
      setOneDriveEvents(normalizeEvents(onedrive.data));
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setIsLoading(false);
    }
  }, [setManualEvents, setOneDriveEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">All upcoming and past events across your contacts.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-full shadow-sm transition-colors cursor-pointer"
        >
          + Add event
        </button>
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading events...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden scrollbar-slim">
          <ImportedEventsTable />
        </div>
      )}

      {/* Add Event Modal */}
      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
