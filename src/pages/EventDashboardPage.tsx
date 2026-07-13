import { useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/auth";
import { fetchEventsBySource } from "../services/event";
import { useEventStore } from "../store/eventStore";
import EventStats from "../components/events/EventStats";
import ExcelUploader from "../components/events/ExcelUploader";
import OneDriveSync from "../components/events/oneDriveSync";
import ImportedEventsTable from "../components/events/ImportedEventsTable";
import UpcomingEvents from "../components/events/UpcomingEvents";

export default function EventDashboardPage() {
  const { setManualEvents, setOneDriveEvents } = useEventStore();

  const normalizeEvents = (events: any[]) =>
    events.map((event) => ({
      ...event,

      Name: event.name,
      Email: event.email,

      Department: event.department,

      EventType: event.occasion,

      EventDate: new Date(event.eventDate).toLocaleDateString("en-GB"),

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
    }
  }, [setManualEvents, setOneDriveEvents]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      await loadEvents();
    });

    return () => unsubscribe();
  }, [loadEvents]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Automation Center</h1>

            <p className="text-gray-400 mt-2">
              Manage automated wishes, schedules and event generation.
            </p>
          </div>

          <button
            onClick={loadEvents}
            className="
              px-5
              py-3
              rounded-xl
              bg-cyan-600
              hover:bg-cyan-700
              transition
            "
          >
            🔄 Refresh
          </button>
        </div>

        {/* Statistics */}
        <EventStats />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ExcelUploader />

              <OneDriveSync />

              <ImportedEventsTable />
            </div>
          </div>

          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
