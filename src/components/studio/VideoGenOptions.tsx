import { useState, useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';

type ModeType = 'automatic' | 'prompt';

interface VideoGenOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

const videoPrompts = [
  'Product Showcase Rotation',
  'Smooth Pan Across Scene',
  'Dynamic Zoom In',
  'Cinematic Reveal',
  'Fashion Runway Walk',
  'Slow Motion Effect',
  'Time Lapse Sequence',
  'Camera Orbit Around Subject',
  'Dolly Push Effect',
  'Parallax Movement',
  'Action Sports Dynamic',
  'Lifestyle Brand Story',
  'Unboxing Experience',
  'Before and After Transition',
  'Infinite Loop Animation',
  'Dramatic Light Sweep',
];

const modeDescriptions = {
  automatic: 'AI generates video animation based on image content',
  prompt: 'Choose from curated video animation presets',
};

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
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    const data: Record<string, unknown> = {
      mode,
      inputImage,
    };

    if (mode === 'prompt') {
      data.prompt = selectedPrompt;
    }

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
          className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
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
              <Upload size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Upload input image</span>
              <span className="text-xs">Click to browse</span>
            </>
          )}
        </button>
        {inputImage && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {inputImage.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Generation Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('automatic')}
            className={`p-3 rounded-xl text-left transition-all border ${
              mode === 'automatic'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Automatic</span>
            </div>
            <p className={`text-xs ${mode === 'automatic' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              AI-powered
            </p>
          </button>

          <button
            onClick={() => setMode('prompt')}
            className={`p-3 rounded-xl text-left transition-all border ${
              mode === 'prompt'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Prompt</span>
            </div>
            <p className={`text-xs ${mode === 'prompt' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Style presets
            </p>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {modeDescriptions[mode]}
        </p>
      </div>

      {mode === 'prompt' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Animation Style
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {videoPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                  selectedPrompt === prompt
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
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
        className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Generate Video
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  );
}
