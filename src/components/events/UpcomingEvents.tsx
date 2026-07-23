import { useActiveEvents } from "../../hooks/useActiveEvents";

export default function UpcomingEvents() {
  const events = useActiveEvents();

  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.EventDate).getTime() - new Date(b.EventDate).getTime(),
    )
    .slice(0, 5);

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200/60
        p-6
        w-full
        shadow-sm
      "
    >
      <h2 className="font-bold text-lg text-slate-800 mb-4">Upcoming Events</h2>

      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event, index) => (
          <div
            key={index}
            className="
              py-3
              border-b
              border-slate-100
              last:border-0
            "
          >
            <p className="font-bold text-slate-800">{event.Name}</p>

            <p className="text-slate-500 text-xs font-medium mt-0.5">{event.EventType}</p>

            <p className="text-teal-600 text-xs font-bold mt-1">{event.EventDate}</p>
          </div>
        ))
      ) : (
        <p className="text-slate-450 text-sm font-medium py-4 text-center">No upcoming events scheduled</p>
      )}
    </div>
  );
}
