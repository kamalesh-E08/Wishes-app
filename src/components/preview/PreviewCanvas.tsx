import { useWishStore } from "../../store/wishesStore";

export default function PreviewCanvas() {
  const { uploadedImage } = useWishStore();

  return (
    <div
      className="
      relative
      rounded-3xl
      overflow-hidden
      min-h-[700px]
      border
      border-white/10
      bg-white/5
      "
    >
      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt=""
          className="
          w-full
          h-full
          object-cover
          "
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          No Image Uploaded
        </div>
      )}
    </div>
  );
}
