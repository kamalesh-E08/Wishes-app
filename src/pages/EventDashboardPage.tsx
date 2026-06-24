import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/auth";
import EventStats from "../components/events/EventStats";
import ExcelUploader from "../components/events/ExcelUploader";
import UpcomingEvents from "../components/events/UpcomingEvents";
import OneDriveSync from "../components/events/oneDriveSync";
import ImportedEventsTable from "../components/events/ImportedEventsTable"; 
import { fetchEventsBySource } from "../services/event";
import { useEventStore } from "../store/eventStore";

export default function EventDashboardPage() {
  const { setManualEvents, setOneDriveEvents } = useEventStore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const manual = await fetchEventsBySource("excel");
        const onedrive = await fetchEventsBySource("onedrive");

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

        setManualEvents(normalizeEvents(manual.data));
        setOneDriveEvents(normalizeEvents(onedrive.data));
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Automation Center</h1>

          <p className="text-gray-400 mt-2">
            Manage automated wishes, schedules and event generation.
          </p>
        </div>

        <EventStats />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ExcelUploader />

              <OneDriveSync />
              <ImportedEventsTable/>
            </div>
          </div>

          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
