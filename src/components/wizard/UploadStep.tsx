import { useState } from "react";
import { compressImage } from "../../services/imageCompression";
import { useWishStore } from "../../store/wishesStore";

export default function UploadStep() {
  const { uploadedImage, setImage } = useWishStore();

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("Please upload an image smaller than 5 MB");
      return;
    }

    try {
      setUploading(true);
      const imageToStore = await compressImage(file);
      console.log("Stored Image Length:", imageToStore.length);
      setImage(imageToStore);
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
      <h2 className="text-2xl font-bold mb-2">Upload Photo</h2>

      <p className="text-white/60 mb-6">
        JPG, PNG • Maximum 5 MB
      </p>

      {!uploadedImage && (
        <label
          className="
          border-2
          border-dashed
          border-cyan-500/30
          rounded-3xl
          h-64
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          hover:border-cyan-400
          hover:bg-white/5
          transition-all
          duration-300
          "
        >
          <div className="text-6xl">📷</div>

          <p className="mt-4 text-lg font-medium">Click to Upload Image</p>

          <p className="text-sm text-white/50 mt-2">JPG, PNG • Up to 5 MB</p>

          <input hidden type="file" accept="image/*" onChange={handleUpload} />
        </label>
      )}

      {uploading && (
        <div className="mt-6 text-center">
          <p className="text-cyan-400">Uploading...</p>
        </div>
      )}

      {uploadedImage && !uploading && (
        <div className="mt-6">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="
            w-full
            max-w-sm
            mx-auto
            aspect-square
            object-cover
            rounded-2xl
            border
            border-white/10
            "
          />

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setImage("")}
              className="
              px-5
              py-2
              rounded-xl
              bg-red-500
              hover:bg-red-600
              cursor-pointer
              transition
              "
            >
              Remove
            </button>

            <label
              className="
              px-5
              py-2
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              cursor-pointer
              transition
              "
            >
              Replace
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>
          </div>

          <p className="text-green-400 text-center mt-4">
            ✓ Image Uploaded Successfully
          </p>
        </div>
      )}
    </div>
  );
}
