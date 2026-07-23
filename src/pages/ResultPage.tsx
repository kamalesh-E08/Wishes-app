import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishStore } from "../store/wishesStore";

export default function ResultPage() {
  const navigate = useNavigate();
  const { generatedImage, resetWish } = useWishStore();
  console.log(generatedImage);

  useEffect(() => {
    const handleBack = () => {
      resetWish();
      navigate("/history", {
        replace: true,
      });
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate, resetWish]);

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `wish-${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:py-20 text-center sm:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 sm:mb-10">
        Your AI Wish
      </h1>

      <div className="mb-8 flex justify-center sm:justify-start gap-4">
        <button
          onClick={() => generatedImage && handleDownload(generatedImage)}
          disabled={!generatedImage}
          className="
            px-6
            py-3
            rounded-xl
            bg-teal-600
            hover:bg-teal-500
            text-white
            font-bold
            shadow-md
            shadow-teal-600/10
            transition-colors
            cursor-pointer
            disabled:opacity-50
            "
        >
          Download Wish Image
        </button>

        <button
          onClick={() => {
            resetWish();
            navigate("/create");
          }}
          className="
            px-6
            py-3
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            font-bold
            shadow-sm
            hover:bg-slate-50
            transition-colors
            cursor-pointer
          "
        >
          Create Another
        </button>
      </div>

      {generatedImage && (
        <div className="bg-white border border-slate-200/80 p-4 rounded-[32px] shadow-xl inline-block max-w-full">
          <img
            src={generatedImage}
            alt="Generated Greeting Card"
            className="
              max-h-[75vh]
              max-w-full
              mx-auto
              object-contain
              rounded-2xl
              "
          />
        </div>
      )}
    </div>
  );
}
