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
        bg-white/5
        rounded-2xl
        border
        border-white/10
        p-6
      "
    >
      <h2 className="font-semibold text-xl mb-4">Upcoming Events</h2>

      {upcomingEvents.map((event, index) => (
        <div
          key={index}
          className="
              py-3
              border-b
              border-white/10
            "
        >
          <p className="font-medium">{event.Name}</p>

          <p className="text-gray-400 text-sm">{event.EventType}</p>

          <p className="text-purple-400 text-sm">{event.EventDate}</p>
        </div>
      ))}
    </div>
  );
}
