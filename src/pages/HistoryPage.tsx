import { useEffect, useState } from "react";
import { getHistory } from "../services/history";

interface Wish {
  _id: string;

  occasion: string;

  theme: string;

  generatedImage: string;

  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Wish[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchHistory() {
      try {
        const data = await getHistory();

        if (mounted) {
          setHistory(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Generated Wishes</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {history.map((item) => {
          console.log(item);

          return (
            <img
              key={item._id}
              src={`http://localhost:5000${item.generatedImage}`}
              alt={item.occasion}
              className="
              rounded-3xl
              border
              border-white/10
            "
            />
          );
        })}
      </div>
    </div>
  );
}
