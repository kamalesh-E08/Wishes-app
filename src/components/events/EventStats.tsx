import { Calendar, Clock, CheckCircle, Mail } from "lucide-react";

import { useActiveEvents } from "../../hooks/useActiveEvents";

export default function EventStats() {
  const events = useActiveEvents();

  const totalEvents = events.length;

  const birthdays = events.filter((e) =>
    e.EventType?.includes("Birthday"),
  ).length;

  const anniversaries = events.filter((e) =>
    e.EventType?.includes("Anniversary"),
  ).length;

  const upcoming = events.filter((e) => {
    const today = new Date();
    const eventDate = new Date(e.EventDate);

    return eventDate >= today;
  }).length;

  const stats = [
    {
      label: "Total Events",
      value: totalEvents,
      icon: Calendar,
    },
    {
      label: "Upcoming",
      value: upcoming,
      icon: Clock,
    },
    {
      label: "Birthdays",
      value: birthdays,
      icon: CheckCircle,
    },
    {
      label: "Anniversaries",
      value: anniversaries,
      icon: Mail,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4 sm:p-6
            "
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">{item.label}</p>

                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
              </div>

              <Icon className="text-purple-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
