import { useState, useRef } from 'react';
import { Upload, Sparkles, ZoomIn } from 'lucide-react';

interface UpscaleOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

const scaleOptions = [
  { value: 2, label: '2x', description: 'Double resolution' },
  { value: 3, label: '3x', description: 'Triple resolution' },
  { value: 4, label: '4x', description: 'Quadruple resolution' },
];

export default function UpscaleOptions({ onGenerate }: UpscaleOptionsProps) {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [upscaleLevel, setUpscaleLevel] = useState(2);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    const data: Record<string, unknown> = {
      inputImage,
      upscaleLevel,
    };

    onGenerate(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Input Image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
        >
          {imagePreview ? (
            <div className="relative w-full h-full p-2">
              <img
                src={imagePreview}
                alt="Input"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <>
              <Upload size={28} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Upload image to upscale</span>
              <span className="text-xs">Click to browse</span>
            </>
          )}
        </button>
        {inputImage && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>{inputImage.name}</p>
            <p className="mt-1">Size: {(inputImage.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Upscale Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {scaleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setUpscaleLevel(option.value)}
              className={`p-4 rounded-xl text-center transition-all border ${
                upscaleLevel === option.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <ZoomIn size={20} />
                <span className="text-2xl font-bold">{option.label}</span>
              </div>
              <p className={`text-xs ${upscaleLevel === option.value ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {option.description}
              </p>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Higher upscale levels produce larger, more detailed images but take longer to process
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Enhancement Features
        </h4>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
            Preserves image quality and details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
            AI-powered edge enhancement
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
            Reduces compression artifacts
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
            Maintains color accuracy
          </li>
        </ul>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!inputImage}
        className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Upscale Image
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  );
}
