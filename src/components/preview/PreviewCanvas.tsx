import { useWishStore } from "../../store/wishesStore";

export default function PreviewCanvas() {
  const { uploadedImage } = useWishStore();

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5

      flex
      items-center
      justify-center

      min-h-[320px]
      md:min-h-[600px]
      p-4 md:p-6
      "
    >
      {uploadedImage ? (
        <div
          className="
          w-full
          max-w-[360px]
          md:max-w-[500px]

          aspect-[4/5]

          rounded-3xl
          overflow-hidden

          bg-black/20
          border
          border-white/10

          flex
          items-center
          justify-center
          "
        >
          <img
            src={uploadedImage}
            alt="Preview"
            className="
            max-w-full
            max-h-full

            object-contain
            "
          />
        </div>
      ) : (
        <div
          className="
          text-white/50
          text-lg
          "
        >
          No Image Uploaded
        </div>
      )}
    </div>
  );
}
