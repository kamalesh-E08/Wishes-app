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
              bg-white dark:bg-slate-900
              border
              border-slate-200/60 dark:border-slate-800
              rounded-2xl
              p-4 sm:p-6
              shadow-sm
              hover:shadow-md
              transition-all
            "
          >
            <div className="flex justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{item.label}</p>

                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{item.value}</h2>
              </div>

              <Icon className="text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
