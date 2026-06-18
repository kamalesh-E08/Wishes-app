import { useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { useWishStore } from "../store/wishesStore";

export default function ResultPage() {
  const navigate = useNavigate();
  const { generatedImage, resetWish } = useWishStore();
  console.log(generatedImage)

  useEffect(() => {
    const handleBack = () => {
      resetWish();

      navigate("/create", {
        replace: true,
      });
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate, resetWish]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `wish-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-20">
      <h1 className="text-5xl font-bold mb-10">Your AI Wish</h1>
      <button
        onClick={handleDownload}
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
