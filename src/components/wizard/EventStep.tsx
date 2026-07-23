import { useEventStore } from "../../store/eventStore";

export default function EventStep() {
  const { manualEvents, oneDriveEvents, setSelectedEvent, selectedEvent } = useEventStore();
  const allEvents = [...manualEvents, ...oneDriveEvents];

  // We'll just show the first few upcoming events for the wizard
  const upcomingEvents = allEvents
    .filter((e) => new Date(e.EventDate) >= new Date())
    .slice(0, 5);

  const handleSelect = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-8">Which event?</h2>
      
      <div className="flex flex-col gap-0 border-t border-slate-200">
        {upcomingEvents.length === 0 ? (
          <div className="py-8 text-center text-sm font-medium text-slate-500">
            No upcoming events found. Try syncing or importing events first.
          </div>
        ) : upcomingEvents.map((event, i) => {
          const isSelected = selectedEvent?._id === event._id;
          return (
            <div 
              key={event._id || i} 
              onClick={() => handleSelect(event)}
              className={`py-4 border-b border-slate-200 flex items-center justify-between cursor-pointer px-4 -mx-4 transition-colors group ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
            >
              <div>
                <p className="text-[13px] font-bold text-slate-900">{event.Name} — {event.EventType}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{new Date(event.EventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-300 group-hover:border-slate-900'}`}>
                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
