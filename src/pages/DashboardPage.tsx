import { useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, RefreshCw, ArrowUpRight, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { fetchEventsBySource } from '../services/event';
import { useEventStore } from '../store/eventStore';
import { useHistoryStore } from '../store/historyStore';
import { Link, useNavigate } from 'react-router-dom';
import { useWishStore } from '../store/wishesStore';

const GEMINI_LIMIT = 1500;
const FLUX_LIMIT = 100;
const USAGE_LIMIT = GEMINI_LIMIT + FLUX_LIMIT;
const COLORS = ['#3B82F6', '#8B5CF6', '#F1F5F9']; // Gemini (Blue), Flux (Purple), Remaining (Gray)

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { manualEvents, oneDriveEvents, setManualEvents, setOneDriveEvents } = useEventStore();
  const { history, fetchHistory } = useHistoryStore();
  const resetWish = useWishStore(state => state.resetWish);
  const navigate = useNavigate();
  const [aiTab, setAiTab] = useState<'Gemini' | 'Flux'>('Gemini');
  const [isLoading, setIsLoading] = useState(true);

  const normalizeEvents = useCallback((events: any[]) =>
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
    })), []);

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
  }, [setManualEvents, setOneDriveEvents, normalizeEvents]);

  useEffect(() => {
    // Eagerly fetch just in case it wasn't caught by AuthProvider
    fetchHistory();
    if (manualEvents.length === 0 && oneDriveEvents.length === 0) {
      loadEvents();
    } else {
      setIsLoading(false);
    }
  }, [fetchHistory, loadEvents, manualEvents.length, oneDriveEvents.length]);

  const historyCount = history.length;
  const recentHistory = history.slice(0, 5);

  const allEvents = [...manualEvents, ...oneDriveEvents];

  // Compute Activity Graph (Last 14 days)
  const activityData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];

    const wishes = history.filter(h => h.createdAt && new Date(h.createdAt).toISOString().split('T')[0] === dateStr).length;

    const emails = allEvents.filter(e => {
      if (!['sent', 'generated', 'sending'].includes(e.status)) return false;
      const targetDate = e.generatedAt || (e as any).updatedAt || e.EventDate;
      if (!targetDate) return false;
      const eDateStr = new Date(targetDate).toISOString().split('T')[0];
      return eDateStr === dateStr;
    }).length;

    return {
      name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      wishes,
      emails,
    };
  });

  // Compute AI Usage (Daily limits for free tiers)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayHistory = history.filter(h => h.createdAt && new Date(h.createdAt).toISOString().split('T')[0] === todayStr);
  
  const fluxCount = todayHistory.filter(h => h.aiProvider?.toLowerCase() === 'flux').length;
  const geminiCount = todayHistory.filter(h => h.aiProvider?.toLowerCase() !== 'flux').length; // default to Gemini
  
  const currentUsage = aiTab === 'Gemini' ? geminiCount : fluxCount;
  const currentLimit = aiTab === 'Gemini' ? GEMINI_LIMIT : FLUX_LIMIT;
  
  const usageData = [
    { name: aiTab, value: currentUsage },
    { name: 'Remaining', value: Math.max(0, currentLimit - currentUsage) },
  ];
  
  const CHART_COLORS = aiTab === 'Gemini' ? ['#3B82F6', '#F1F5F9'] : ['#8B5CF6', '#F1F5F9'];

  // Combined Activity Stream (Wishes + Sent Emails)
  const activityStream = [
    ...history.map(h => ({
      id: h._id,
      title: `Generated ${h.occasion?.toLowerCase() || 'wish'}`,
      subtitle: h.people?.join(', ') || 'Custom Wish',
      tag: 'Wish',
      date: new Date(h.createdAt),
      color: 'bg-teal-400',
    })),
    ...allEvents
      .filter(e => ['sent', 'generated', 'sending'].includes(e.status))
      .map(e => ({
        id: e._id,
        title: `Sent ${e.EventType || 'wish'} email`,
        subtitle: `To: ${e.Name} (${e.Email})`,
        tag: e.status === 'sent' ? 'Sent Email' : 'Generating',
        date: new Date(e.generatedAt || (e as any).updatedAt || e.EventDate),
        color: e.status === 'sent' ? 'bg-indigo-400' : 'bg-amber-400',
      })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
  
  // Deduplicate events across sources
  const uniqueEventsMap = new Map();
  allEvents.forEach(event => {
    // Safely format date for the key. Fallback to eventDate or raw EventDate
    const dateKey = event.EventDate ? new Date(event.EventDate).toISOString().split('T')[0] : "";
    const key = `${event.Name}-${event.EventType}-${dateKey}`.toLowerCase();
    if (!uniqueEventsMap.has(key)) {
      uniqueEventsMap.set(key, event);
    }
  });
  
  const uniqueEvents = Array.from(uniqueEventsMap.values());
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Start of today

  const upcomingEvents = uniqueEvents
    .filter(e => e.EventDate && new Date(e.EventDate) >= todayDate)
    .sort((a, b) => new Date(a.EventDate).getTime() - new Date(b.EventDate).getTime());

  // Formatting date nicely
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const firstName = user?.displayName?.split(" ")[0] || "User";

  // Dynamic greeting helper based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Helper for initials
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleCreateNewWish = () => {
    resetWish();
    navigate('/create');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md shrink-0" />
          )}
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-0.5 text-xs md:text-sm">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{getGreeting()}, {user?.displayName || firstName}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs md:text-sm font-medium">Your automations are running smoothly. {upcomingEvents.length} upcoming events.</p>
          </div>
        </div>
        
        <button 
          onClick={handleCreateNewWish}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs md:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">New generation</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Metric Cards - Glassmorphism UI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "TOTAL EVENTS", value: allEvents.length, sub: "Synced across sources", subColor: "text-slate-400 dark:text-slate-500" },
          { title: "UPCOMING", value: upcomingEvents.length, sub: "Action required", subColor: "text-teal-500 dark:text-teal-400" },
          { title: "WISHES GENERATED", value: historyCount, sub: "All time history", subColor: "text-teal-500 dark:text-teal-400" },
          { title: "EMAILS DELIVERED", value: allEvents.filter(e => e.status === "sent").length, sub: "Delivered automatically", subColor: "text-slate-400 dark:text-slate-500" },
        ].map((card, i) => (
          <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-800/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 uppercase">{card.title}</h3>
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</div>
            <p className={`text-[11px] font-semibold mt-2 ${card.subColor}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row - Glassmorphism UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Area Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-800/80 shadow-sm transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">ACTIVITY</h3>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg mt-0.5">Generations & delivery</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-teal-400"></div> Wishes</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> Emails</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWishes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="emails" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorEmails)" />
                <Area type="monotone" dataKey="wishes" stroke="#2DD4BF" strokeWidth={3} fillOpacity={1} fill="url(#colorWishes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage Circular Chart */}
        <div className="col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="w-full flex items-start justify-between mb-4">
            <div className="text-left">
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">AI USAGE</h3>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg mt-0.5">Free tier daily</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setAiTab('Gemini')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${aiTab === 'Gemini' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Gemini
              </button>
              <button 
                onClick={() => setAiTab('Flux')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${aiTab === 'Flux' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Flux
              </button>
            </div>
          </div>
          
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {usageData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">{Math.round((currentUsage / currentLimit) * 100)}%</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{currentUsage.toLocaleString()} / {currentLimit.toLocaleString()}</span>
            </div>
          </div>

          <button className="mt-8 text-[11px] font-bold text-slate-900 dark:text-white hover:text-white dark:hover:text-slate-900 transition-colors bg-white/80 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-white px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer">
            Upgrade quota
          </button>
        </div>
      </div>

      {/* Lists Row - Glassmorphism UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Events */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-800/80 shadow-sm transition-colors">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">UPCOMING EVENTS</h3>
          <p className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-6">Action required</p>
          
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No upcoming events found.</p>
            ) : upcomingEvents.slice(0, 5).map((event, i) => (
              <div key={event._id || i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {getInitials(event.Name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{event.Name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{event.EventType} · {new Date(event.EventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <Link to="/create" className="text-xs font-semibold text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 opacity-0 group-hover:opacity-100 transition-all">
                  Generate
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-800/80 shadow-sm transition-colors">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">RECENT ACTIVITY</h3>
          <p className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-6">Generation & email stream</p>
          
          <div className="space-y-4 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800 -z-10"></div>
            {activityStream.length === 0 ? (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-6">No recent activity.</p>
            ) : activityStream.map((item, i) => (
              <div key={item.id || i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${item.color}`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{item.tag}</span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-12 text-right">
                    {isNaN(item.date.getTime()) ? 'Recently' : item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Row - Glassmorphism UI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Generate wish", sub: "Create with AI", icon: Sparkles, link: "/create" },
          { title: "Import Excel", sub: "Bulk add events", icon: RefreshCw, link: "/import" },
          { title: "Connect cloud", sub: "OneDrive sync", icon: ArrowUpRight, link: "/onedrive" },
          { title: "Send batch", sub: "Deliver queued", icon: Mail, link: "/events" },
        ].map((action, i) => (
          <Link to={action.link} key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all group">
            <div className="w-8 h-8 rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-white transition-colors mb-4">
              <action.icon size={16} />
            </div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white">{action.title}</p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{action.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
