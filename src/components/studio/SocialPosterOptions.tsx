import { useState, useRef } from 'react';
import { Upload, Sparkles, Image } from 'lucide-react';

type ModeType = 'automatic' | 'prompt' | 'upload';

interface SocialPosterOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

const posterPrompts = [
  'Sale Announcement',
  'Product Launch',
  'Event Promotion',
  'Seasonal Campaign',
  'Brand Quote',
  'Customer Testimonial',
  'Behind The Scenes',
  'Tutorial Teaser',
  'Limited Time Offer',
  'New Collection',
  'Flash Sale',
  'Contest Entry',
  'Thank You Message',
  'Milestone Celebration',
  'Before & After',
  'Feature Highlight',
];

interface SizePreset {
  name: string;
  width: number;
  height: number;
  category: string;
}

const posterSizes: SizePreset[] = [
  { name: 'Post Image', width: 1200, height: 630, category: 'Facebook' },
  { name: 'Story', width: 1080, height: 1920, category: 'Facebook' },

  { name: 'Post Image', width: 1200, height: 675, category: 'Twitter' },
  { name: 'Card', width: 800, height: 418, category: 'Twitter' },

  { name: 'Square Post', width: 1080, height: 1080, category: 'Instagram' },
  { name: 'Portrait Post', width: 1080, height: 1350, category: 'Instagram' },
  { name: 'Story', width: 1080, height: 1920, category: 'Instagram' },

  { name: 'Post Image', width: 1200, height: 627, category: 'LinkedIn' },

  { name: 'Pin', width: 1000, height: 1500, category: 'Pinterest' },

  { name: 'Thumbnail', width: 1280, height: 720, category: 'YouTube' },
];

const modeDescriptions = {
  automatic: 'AI generates poster design based on image context',
  prompt: 'Choose from curated poster style presets',
  upload: 'Upload reference image for design inspiration',
};

export default function SocialPosterOptions({ onGenerate }: SocialPosterOptionsProps) {
  const [mode, setMode] = useState<ModeType>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<SizePreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Instagram');

  const inputFileRef = useRef<HTMLInputElement>(null);
  const referenceFileRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(posterSizes.map(s => s.category)));
  const filteredSizes = posterSizes.filter(s => s.category === selectedCategory);

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImagePreview(e.target?.result as string);
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
    } else if (mode === 'upload') {
      data.referenceImage = referenceImage;
    }

    if (selectedPreset) {
      data.width = selectedPreset.width;
      data.height = selectedPreset.height;
      data.presetName = selectedPreset.name;
      data.category = selectedPreset.category;
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
          ref={inputFileRef}
          type="file"
          accept="image/*"
          onChange={handleInputImageChange}
          className="hidden"
        />
        <button
          onClick={() => inputFileRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
        >
          {inputImagePreview ? (
            <div className="relative w-full h-full p-2">
              <img
                src={inputImagePreview}
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
          Design Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
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

          <button
            onClick={() => setMode('upload')}
            className={`p-3 rounded-xl text-left transition-all border ${
              mode === 'upload'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Image size={16} />
              <span className="text-sm font-semibold">Upload</span>
            </div>
            <p className={`text-xs ${mode === 'upload' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Reference
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
            Poster Style
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {posterPrompts.map((prompt) => (
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

      {mode === 'upload' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Reference Image
          </label>
          <input
            ref={referenceFileRef}
            type="file"
            accept="image/*"
            onChange={handleReferenceImageChange}
            className="hidden"
          />
          <button
            onClick={() => referenceFileRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
          >
            {referenceImagePreview ? (
              <div className="relative w-full h-full p-2">
                <img
                  src={referenceImagePreview}
                  alt="Reference"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <>
                <Upload size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Upload reference</span>
                <span className="text-xs">Click to browse</span>
              </>
            )}
          </button>
          {referenceImage && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {referenceImage.name}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Platform
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedPreset(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Size Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            {filteredSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedPreset(size)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  selectedPreset === size
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-xs font-semibold mb-1">{size.name}</div>
                <div className={`text-xs ${selectedPreset === size ? 'text-white/70 dark:text-gray-900/70' : 'text-gray-500 dark:text-gray-400'}`}>
                  {size.width} × {size.height}px
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={
          !inputImage ||
          !selectedPreset ||
          (mode === 'prompt' && !selectedPrompt) ||
          (mode === 'upload' && !referenceImage)
        }
        className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Generate Poster
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  );
}
