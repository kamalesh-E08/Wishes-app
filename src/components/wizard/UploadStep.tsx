import { useState } from "react";
import { processImage } from "../../services/uploadImages";
import { useWishStore } from "../../store/wishesStore";

export default function UploadStep() {
  const { uploadedImage, setImage } = useWishStore();
  const [progress, setProgress] = useState(0);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await processImage(file, (percentage) => {
        setProgress(percentage);
      });

      setImage(response.imageBase64);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="
      border
      border-white/10
      rounded-3xl
      p-8
      bg-white/5
      "
    >
      <h2 className="text-2xl font-bold mb-4">Upload Photo</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {uploading && (
        <div className="mt-6">
          <p>Uploading {progress}%</p>

          <div className="w-full h-3 bg-white/10 rounded-full">
            <div
              style={{
                width: `${progress}%`,
              }}
              className="
              h-full
              bg-gradient-to-r
              from-purple-500
              to-cyan-500
              transition-all
              duration-300
              rounded-full
              w-full
              "
            />
          </div>
        </div>
      )}

      {uploadedImage && !uploading && (
        <div className="mt-6">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="
            w-48
            h-48
            object-cover
            rounded-2xl
            border
            border-white/10
            "
          />

          <p className="text-green-400 mt-3">✓ Image Uploaded Successfully</p>
        </div>
      )}
    </div>
  );
}
