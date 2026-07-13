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
    <div className="max-w-6xl mx-auto py-12 px-4 sm:py-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-10">
        Your AI Wish
      </h1>
      <button
        onClick={() => handleDownload}
        className="
          px-6
          py-3
          rounded-xl
          bg-gradient-to-r
          from-purple-500
          to-cyan-500
          "
      >
        Download
      </button>
      {generatedImage && (
        <img
          src={generatedImage}
          alt=""
          className="
            max-h-[80vh]
            max-w-full
            mx-auto
            object-contain
            rounded-3xl
            shadow-2xl
            "
        />
      )}
    </div>
  );
}
