import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import { useHistoryStore } from "../../store/historyStore";
import { useEventStore } from "../../store/eventStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedUser = useAuthStore.getState().user;
        // Clear cached data if switching to a different user account
        if (storedUser && storedUser.uid !== user.uid) {
          useEventStore.getState().clearEvents();
          useHistoryStore.setState({ history: [] });
          try {
            localStorage.removeItem("wishes-events");
          } catch (e) {}
        }

        login({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });
        
        // Eagerly fetch user history and event data so dashboards are instantly ready
        const { fetchHistory } = useHistoryStore.getState();
        fetchHistory().catch(err => console.error("Failed to eagerly fetch history", err));
      } else {
        logout();
        useEventStore.getState().clearEvents();
        useHistoryStore.setState({ history: [] });
        try {
          localStorage.removeItem("wishes-events");
        } catch (e) {}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [login, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-teal-500 animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
