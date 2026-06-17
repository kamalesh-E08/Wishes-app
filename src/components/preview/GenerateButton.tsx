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
  } = useWishStore();

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const result = await generateWish({
        uploadedImage,
        occasion,
        theme,
        people,
        decorations,
        customMessage,
        additionalInformation,
        animationEnabled,
      });

      // if (result.success) {
      //   const imageUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
      //   setGeneratedImage(imageUrl);
      //   navigate("/result");
      // }
      if (result.success) {
        console.log(result)
        setGeneratedImage(result.imageURL);
        navigate("/result");
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
      w-full
      py-4
      rounded-xl
      bg-gradient-to-r
      from-purple-500
      to-cyan-500
      disabled:opacity-50
      disabled:cursor-not-allowed
      "
    >
      {loading ? "Generating..." : "Generate Wish"}
    </button>
  );
}
