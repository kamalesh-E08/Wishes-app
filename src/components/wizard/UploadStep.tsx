import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useWishStore } from "../../store/wishesStore";
import { compressImage } from "../../services/imageCompression";
import ImageEditorToolbar from "./ImageEditorToolbar";

export default function UploadStep() {
  const { uploadedImage, setImage } = useWishStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    setIsLoading(true);
    try {
      const base64 = await compressImage(file);
      setImage(base64);
    } catch (error) {
      console.error("Failed to process image", error);
      alert("Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImage(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-8">Upload reference images</h2>
      
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <div 
        onClick={() => !uploadedImage && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-3xl p-6 md:p-12 flex flex-col items-center justify-center text-center transition-colors relative overflow-hidden min-h-[280px]
          ${uploadedImage ? 'border-teal-400 bg-slate-900/5' : isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-400 bg-slate-50/50 cursor-pointer'}
        `}
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-700">Processing image...</p>
          </div>
        ) : uploadedImage ? (
          <div className="relative w-full flex flex-col items-center justify-center gap-4">
            <img src={uploadedImage} alt="Uploaded reference" className="max-h-[220px] object-contain rounded-2xl shadow-md border border-slate-200/80 bg-white" />
            
            <ImageEditorToolbar
              imageUrl={uploadedImage}
              onUpdateImage={(newBase64) => setImage(newBase64)}
              onReplace={handleReplace}
              onRemove={clearImage}
            />
          </div>
        ) : (
          <>
            <ImageIcon className={`mb-4 transition-colors ${isDragging ? 'text-teal-500' : 'text-teal-300'}`} size={32} strokeWidth={1.5} />
            <p className="text-sm font-bold text-slate-700">Drop images or click to browse</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Optional · PNG/JPG up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}
