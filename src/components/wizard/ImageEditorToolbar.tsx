import { RotateCcw, RotateCw, FlipHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

interface ImageEditorToolbarProps {
  imageUrl: string;
  onUpdateImage: (newBase64: string) => void;
  onReplace: () => void;
  onRemove: () => void;
}

export default function ImageEditorToolbar({
  imageUrl,
  onUpdateImage,
  onReplace,
  onRemove,
}: ImageEditorToolbarProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Canvas-based image rotation
  const handleRotate = (angle: number) => {
    if (!imageUrl || isProcessing) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      if (angle === 90 || angle === -90 || angle === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const newBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onUpdateImage(newBase64);
      setIsProcessing(false);
    };
    img.onerror = () => setIsProcessing(false);
    img.src = imageUrl;
  };

  // Canvas-based horizontal flip
  const handleFlip = () => {
    if (!imageUrl || isProcessing) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);

      const newBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onUpdateImage(newBase64);
      setIsProcessing(false);
    };
    img.onerror = () => setIsProcessing(false);
    img.src = imageUrl;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl text-white">
      <button
        type="button"
        onClick={() => handleRotate(-90)}
        disabled={isProcessing}
        title="Rotate Left 90°"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
      >
        <RotateCcw size={14} />
        <span>Rotate Left</span>
      </button>

      <button
        type="button"
        onClick={() => handleRotate(90)}
        disabled={isProcessing}
        title="Rotate Right 90°"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
      >
        <RotateCw size={14} />
        <span>Rotate Right</span>
      </button>

      <button
        type="button"
        onClick={handleFlip}
        disabled={isProcessing}
        title="Flip Horizontally"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
      >
        <FlipHorizontal size={14} />
        <span>Flip</span>
      </button>

      <div className="h-4 w-[1px] bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={onReplace}
        title="Replace with another photo"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-teal-500/20 text-teal-400 text-xs font-semibold transition-all cursor-pointer"
      >
        <RefreshCw size={14} />
        <span>Replace Photo</span>
      </button>

      <button
        type="button"
        onClick={onRemove}
        title="Remove Photo"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all cursor-pointer"
      >
        <Trash2 size={14} />
        <span>Remove</span>
      </button>
    </div>
  );
}
