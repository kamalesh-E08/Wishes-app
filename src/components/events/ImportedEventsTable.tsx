import { Search, Filter, Cake, Heart, Cloud, FileSpreadsheet } from "lucide-react";
import { useEventStore } from "../../store/eventStore";
import { updateEvent as updateEventApi, deleteEvent as deleteEventApi } from "../../services/event";
import { useMemo, useState } from "react";

export default function ImportedEventsTable() {
  const { manualEvents, oneDriveEvents } = useEventStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allEvents = useMemo(() => {
    // Add source tags
    const manual = manualEvents.map(e => ({ ...e, source: "excel" }));
    const onedrive = oneDriveEvents.map(e => ({ ...e, source: "onedrive" }));
    
    // Combine and deduplicate
    const combined = [...manual, ...onedrive];
    const uniqueEventsMap = new Map();

    combined.forEach(event => {
      const dateKey = event.EventDate ? new Date(event.EventDate).toISOString().split('T')[0] : "";
      const key = `${event.Name}-${event.EventType}-${dateKey}`.toLowerCase();
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      }
    });

    return Array.from(uniqueEventsMap.values());
  }, [manualEvents, oneDriveEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.Name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = sourceFilter === "all" || event.source === sourceFilter;
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesEventType = eventTypeFilter === "all" || event.EventType?.toLowerCase().includes(eventTypeFilter.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter) {
        const eventDateStr = event.EventDate ? new Date(event.EventDate).toISOString().split('T')[0] : "";
        matchesDate = eventDateStr === dateFilter;
      }
      
      return matchesSearch && matchesSource && matchesStatus && matchesEventType && matchesDate;
    });
  }, [allEvents, searchTerm, sourceFilter, statusFilter, eventTypeFilter, dateFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  
  // Ensure current page is valid when filtering changes
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Helper for status colors
  const getStatusBg = (status: string) => {
    switch(status) {
      case "approved": 
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "generated": 
        return "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800";
      case "generating": 
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse";
      case "sending": 
        return "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 animate-pulse";
      case "pending": 
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
      case "sent": 
        return "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      case "failed": 
        return "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      default: 
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "approved": return "Approved";
      case "generated": return "Queued";
      case "generating": return "Generating AI";
      case "sending": return "Sending Mail";
      case "pending": return "Draft";
      case "sent": return "Sent";
      case "failed": return "Failed";
      default: return status || "Draft";
    }
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search people..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="pl-8 pr-8 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="all">All Sources</option>
              <option value="excel">Excel</option>
              <option value="onedrive">OneDrive</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Draft (Pending)</option>
              <option value="generating">Generating AI</option>
              <option value="generated">Queued (Generated)</option>
              <option value="sending">Sending Mail</option>
              <option value="approved">Approved</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
          </div>

          <div className="relative">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="pl-4 pr-8 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="all">All Events</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
          </div>

          <div className="relative flex items-center">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-900 pl-1"
                title="Clear date filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-slim">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <th className="py-3 pl-6 pr-2 w-10">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-slate-400 cursor-pointer" />
              </th>
              <th className="py-4 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="py-4 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Source</th>
              <th className="py-4 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">No events found. Import some to get started.</td>
              </tr>
            ) : paginatedEvents.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-3 pl-6 pr-2">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-slate-400 cursor-pointer" />
                </td>
                <td className="py-3 px-4 flex items-center gap-3">
                  {row.photoUrl ? (
                    <img src={row.photoUrl} alt={row.Name} className="w-6 h-6 rounded-md object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {getInitials(row.Name)}
                    </div>
                  )}
                  <span className="text-[13px] font-bold text-slate-900 dark:text-white">{row.Name}</span>
                </td>
                <td className="py-3 px-4">
                  {row.source === "onedrive" ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded-md w-fit">
                      <Cloud size={12} /> OneDrive
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md w-fit">
                      <FileSpreadsheet size={12} /> Excel
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {row.EventType?.toLowerCase().includes("birthday") ? <Cake size={14} className="text-slate-400 dark:text-slate-500" /> : <Heart size={14} className="text-slate-400 dark:text-slate-500" />}
                    {row.EventType}
                  </div>
                </td>
                <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {row.EventDate ? new Date(row.EventDate).toLocaleDateString("en-GB") : ""}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBg(row.status)}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                    {getStatusText(row.status)}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={async () => {
                        const newName = window.prompt("Modify Event Name:", row.Name);
                        if (newName && newName !== row.Name) {
                          try {
                            await updateEventApi(row._id, { Name: newName });
                            useEventStore.getState().updateEvent(row._id, { Name: newName });
                          } catch (err) {
                            console.error(err);
                            alert("Failed to modify event");
                          }
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Modify Event"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button 
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete ${row.Name}'s event?`)) {
                          try {
                            await deleteEventApi(row._id);
                            useEventStore.getState().deleteEvent(row._id);
                          } catch (err) {
                            console.error(err);
                            alert("Failed to delete event");
                          }
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Event"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 text-xs font-semibold text-slate-500">
        <div>
          Showing {filteredEvents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Show only a few pages around current page if there are many pages (simplified logic)
              if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                return null;
              }
              return (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                    currentPage === pageNum 
                      ? "bg-slate-900 text-white font-bold" 
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
