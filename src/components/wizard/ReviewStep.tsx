import { Check, RefreshCw, Download, Edit2, Save, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishStore } from "../../store/wishesStore";
import { generateWish } from "../../services/generateWish";

export default function ReviewStep() {
  const [isEditing, setIsEditing] = useState(false);
  const [wishText, setWishText] = useState("Happy birthday Maya! May your day be as radiant as the light you bring into every room. Wishing you a year of adventure, laughter, and quiet magic.");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  const { 
    resetWish, 
    uploadedImage, 
    generatedImage, 
    setGeneratedImage,
    occasion,
    theme,
    people,
    decorations,
    animationEnabled,
    aiEngine,
    additionalInformation
  } = useWishStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        occasion,
        theme,
        people,
        decorations,
        customMessage: wishText,
        animationEnabled,
        aiEngine,
        uploadedImage,
        additionalInformation
      };
      
      const response = await generateWish(payload);
      
      if (response.success && response.imageURL) {
        setGeneratedImage(response.imageURL);
      } else {
        alert(response.error || "Failed to generate image.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "An error occurred while generating the image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    resetWish();
    navigate("/dashboard");
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishes-ai-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image", error);
      alert("Failed to download image");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-8">Review & generate</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/5 aspect-[4/3] rounded-xl bg-slate-100 shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center relative">
          {isGenerating ? (
            <div className="flex flex-col items-center text-teal-600">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="font-bold text-sm tracking-wide">Generating masterpiece...</p>
            </div>
          ) : generatedImage ? (
            <img src={generatedImage} alt="Generated wish" className="w-full h-full object-cover" />
          ) : uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded reference" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <p className="text-sm font-medium">No reference image provided</p>
              <p className="text-xs mt-1">Nova will design entirely from scratch.</p>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-2/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generated text</p>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              {isEditing ? <><Save size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
            </button>
          </div>
          
          {isEditing ? (
            <textarea 
              className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-6 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 shadow-sm mb-8 w-full h-32 resize-none transition-colors"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm mb-8">
              "{wishText}"
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3">
            {!generatedImage ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer ${isGenerating ? 'bg-slate-500' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                <Sparkles size={14} strokeWidth={3} /> {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
            ) : (
              <>
                <button 
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Check size={14} strokeWidth={3} /> Approve & Save
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} /> Regenerate
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Download size={14} /> Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
