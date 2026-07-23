import { create } from "zustand";
import { getHistory } from "../services/history";

interface Wish {
  _id: string;
  occasion: string;
  theme: string;
  generatedImage: string;
  createdAt: string;
  aiProvider?: string;
  downloads?: number;
  shares?: number;
}

interface HistoryState {
  history: Wish[];
  loading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  addWishToHistory: (wish: Wish) => void;
  removeWishFromHistory: (id: string) => void;
  removeMultipleWishes: (ids: string[]) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  loading: false,
  error: null,
  
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getHistory();
      // Sort by newest first
      const sortedData = data.sort((a: Wish, b: Wish) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      set({ history: sortedData, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch history", loading: false });
    }
  },

  addWishToHistory: (wish: Wish) => 
    set((state) => ({ 
      history: [wish, ...state.history] 
    })),

  removeWishFromHistory: (id: string) => 
    set((state) => ({ 
      history: state.history.filter((w) => w._id !== id) 
    })),

  removeMultipleWishes: (ids: string[]) => 
    set((state) => ({ 
      history: state.history.filter((w) => !ids.includes(w._id)) 
    }))
}));
