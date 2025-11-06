import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Check } from 'lucide-react';

interface UpscaleOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
  preloadedImage?: string | null;
  onImageUsed?: () => void;
}

export default function UpscaleOptions({ onGenerate, preloadedImage, onImageUsed }: UpscaleOptionsProps) {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [upscaleLevel, setUpscaleLevel] = useState(2);
  const [isFromChain, setIsFromChain] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preloadedImage) {
      setImagePreview(preloadedImage);
      setIsFromChain(true);
      if (onImageUsed) {
        onImageUsed();
      }
    }
  }, [preloadedImage, onImageUsed]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    onGenerate({ inputImage, upscaleLevel });
  };

  return (
    <div className="space-y-2.5">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

      <div className="relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex items-center justify-center"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Input" className="w-full h-full object-contain p-1.5 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400">
              <Upload size={18} />
              <span className="text-xs font-medium">Upload Image</span>
            </div>
          )}
        </button>
        {isFromChain && imagePreview && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
            <Check size={12} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Scale</label>
        <div className="flex gap-1.5">
          {([2, 3, 4] as const).map((level) => (
            <button
              key={level}
              onClick={() => setUpscaleLevel(level)}
              className={`flex-1 px-2 py-1.5 rounded text-sm font-medium transition-all ${
                upscaleLevel === level
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {level}x
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!inputImage && !imagePreview}
        className="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles size={14} className="animate-pulse" />
        <span className="text-sm">Generate</span>
      </button>
    </div>
  );
}
