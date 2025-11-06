import { useState, useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';

type ModeType = 'automatic' | 'prompt';

interface VideoGenOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

const videoPrompts = ['Product Rotation', 'Pan', 'Zoom In', 'Reveal', 'Runway Walk', 'Slow Motion', 'Time Lapse', 'Orbit', 'Dolly', 'Parallax'];

export default function VideoGenOptions({ onGenerate }: VideoGenOptionsProps) {
  const [mode, setMode] = useState<ModeType>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    onGenerate({ mode, inputImage, ...(mode === 'prompt' && { prompt: selectedPrompt }) });
  };

  return (
    <div className="space-y-2.5">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

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

      <div>
        <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
        <div className="flex gap-1.5">
          {(['automatic', 'prompt'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                mode === m
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === 'prompt' && (
        <div>
          <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Animation</label>
          <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
            {videoPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                  selectedPrompt === prompt
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!inputImage || (mode === 'prompt' && !selectedPrompt)}
        className="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles size={14} className="animate-pulse" />
        <span className="text-sm">Generate</span>
      </button>
    </div>
  );
}
