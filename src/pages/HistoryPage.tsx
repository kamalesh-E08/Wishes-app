import { useEffect, useState } from "react";
import {
  getHistory,
  deleteWish,
  deleteMultipleWishes,
} from "../services/history";

interface Wish {
  _id: string;
  occasion: string;
  theme: string;
  generatedImage: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Wish[]>([]);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this wish?");
    if (!confirmed) return;
    await deleteWish(id);
    setHistory((prev) => prev.filter((item) => item._id !== id));
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(`Delete ${selectedIds.length} wishes?`);
    if (!confirmed) return;
    await deleteMultipleWishes(selectedIds);
    setHistory((prev) =>
      prev.filter((item) => !selectedIds.includes(item._id)),
    );
    setSelectedIds([]);
    setSelectionMode(false);
  };

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1
        className="
        text-4xl
        font-bold
        text-center
        mb-12
        "
      >
        Generated Wishes
      </h1>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setSelectionMode(!selectionMode)}
          className="
            px-5
            py-2
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-600
            transition
    "
        >
          {selectionMode ? "Cancel" : "Select"}
        </button>

        {selectionMode && selectedIds.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="
                px-5
                py-2
                rounded-xl
                bg-red-500
                hover:bg-red-600
                transition
              "
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {history.length === 0 && (
        <div className="text-center text-white/50">
          No wishes generated yet.
        </div>
      )}

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-10
        justify-items-center
        "
      >
        {history.map((item) => (
          <div
            key={item._id}
            className={`
            relative

            w-full
            max-w-sm

            rounded-3xl
            overflow-hidden

            bg-white/5
            backdrop-blur-xl

            border
            border-white/10

            ${
              selectedIds.includes(item._id)
                ? "border-cyan-400"
                : "border-white/10"
            }

            shadow-xl

            hover:scale-105
            hover:border-cyan-400/40

            transition-all
            duration-300
            `}
          >
            {selectionMode && (
              <input
                type="checkbox"
                checked={selectedIds.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
                className="
                  absolute
                  top-3
                  left-3
                  w-5
                  h-5
                  z-20
                  cursor-pointer
                  "
              />
            )}
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item._id);
              }}
              className="
                absolute
                top-3
                right-14
                z-10

                px-3
                py-2

                rounded-xl

                bg-red-500

                hover:bg-red-600

                transition

                cursor-pointer
                "
            >
              🗑
            </button>
            {/* Download Button */}
            <a
              href={`http://localhost:5000${item.generatedImage}`}
              download
              onClick={(e) => e.stopPropagation()}
              className="
              absolute
              top-3
              right-3
              z-10
              px-3
              py-2
              rounded-xl
              bg-black/50
              backdrop-blur-md
              border
              border-white/10
              hover:bg-cyan-500
              transition
              cursor-pointer
              "
            >
              ⬇
            </a>

            {/* Clickable Card */}
            <div
              onClick={() => {
                if (selectionMode) {
                  toggleSelect(item._id);
                  return;
                }

                setSelectedWish(item);
              }}
              className="cursor-pointer"
            >
              <img
                src={`http://localhost:5000${item.generatedImage}`}
                alt={item.occasion}
                className="
                w-full
                h-60
                object-cover
                "
              />

              <div className="p-5 text-center">
                <h3 className="font-bold text-xl">{item.occasion}</h3>

                <p className="text-white/60">{item.theme}</p>

                <p
                  className="
                  text-xs
                  text-white/40
                  mt-2
                  "
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedWish && (
        <div
          className="
          fixed
          inset-0
          z-50

          flex
          items-center
          justify-center

          bg-black/80
          backdrop-blur-lg

          p-6
          "
          onClick={() => setSelectedWish(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            relative

            w-full
            max-w-3xl

            rounded-3xl

            bg-white/10
            backdrop-blur-2xl

            border
            border-white/20

            shadow-2xl

            overflow-hidden
            "
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedWish(null)}
              className="
              absolute
              top-4
              left-4
              z-10

              px-4
              py-2

              rounded-xl

              bg-red-500
              hover:bg-red-600

              transition

              cursor-pointer
              "
            >
              Close
            </button>

            <div className="pt-20 p-6">
              <img
                src={`http://localhost:5000${selectedWish.generatedImage}`}
                alt={selectedWish.occasion}
                className="
                max-h-[500px]
                w-auto

                object-contain

                rounded-2xl

                mx-auto
                "
              />
            </div>

            <div className="pb-8 px-8 text-center">
              <h2 className="text-3xl font-bold">{selectedWish.occasion}</h2>

              <p className="text-white/70 mt-2">{selectedWish.theme}</p>

              <p
                className="
                text-sm
                text-white/50
                mt-3
                "
              >
                Created on {new Date(selectedWish.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
