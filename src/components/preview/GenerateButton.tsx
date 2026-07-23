import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishStore } from "../../store/wishesStore";
import { generateWish } from "../../services/generateWish";

export default function GenerateButton() {
  const navigate = useNavigate();

  const {
    uploadedImage,
    occasion,
    theme,
    people,
    decorations,
    customMessage,
    additionalInformation,
    animationEnabled,
    setGeneratedImage,
    aiEngine
  } = useWishStore();

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      console.log("GenerateButton Image Length:", uploadedImage?.length);
      const result = await generateWish({
        uploadedImage,
        occasion,
        theme,
        people,
        decorations,
        customMessage,
        additionalInformation,
        animationEnabled,
        aiEngine,
      });

      if (result.success) {
        console.log(result)
        setGeneratedImage(result.imageURL);
        navigate("/result",{replace:true,});
      }
    } catch (error) {
      console.error("Generation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="
      mt-6
      w-full
      py-4
      rounded-xl
      bg-teal-600
      hover:bg-teal-500
      text-white
      font-bold
      disabled:opacity-50
      disabled:cursor-not-allowed
      shadow-md
      shadow-teal-600/10
      transition-colors
      "
    >
      {loading ? "Generating..." : "Generate Wish"}
    </button>
  );
}
