import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Image, Check } from 'lucide-react';

type ModeType = 'automatic' | 'prompt' | 'upload';

interface SocialPosterOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
  preloadedImage?: string | null;
  onImageUsed?: () => void;
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

export default function SocialPosterOptions({ onGenerate, preloadedImage, onImageUsed }: SocialPosterOptionsProps) {
  const [mode, setMode] = useState<ModeType>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<SizePreset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Instagram');
  const [isFromChain, setIsFromChain] = useState(false);
  const [addText, setAddText] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImagePreview, setLogoImagePreview] = useState<string | null>(null);

  const logoFileRef = useRef<HTMLInputElement>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const referenceFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preloadedImage) {
      setInputImagePreview(preloadedImage);
      setIsFromChain(true);
      if (onImageUsed) {
        onImageUsed();
      }
    }
  }, [preloadedImage, onImageUsed]);

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

  const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImagePreview(e.target?.result as string);
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

    if (addText) {
      data.addText = true;
      data.title = title;
      data.subtitle = subtitle;
    }

    if (logoImage) {
      data.logoImage = logoImage;
    }

    onGenerate(data);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pb-4">
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
        <div className="relative">
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
          {isFromChain && inputImagePreview && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
              <Check size={14} />
            </div>
          )}
        </div>
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
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-800 pr-2">
            <div className="grid grid-cols-2 gap-3">
              {posterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`group relative overflow-hidden px-3 py-8 rounded-xl text-xs font-medium text-center transition-all border-2 ${
                    selectedPrompt === prompt
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg scale-105'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col items-center gap-2">
                    <Sparkles size={20} className={selectedPrompt === prompt ? 'text-white dark:text-gray-900' : 'text-brand'} />
                    <span className="leading-tight">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
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

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
          Text Options
        </label>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Text Overlay</span>
            <button
              onClick={() => setAddText(!addText)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                addText ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${
                  addText ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {addText && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Title Text
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title text"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Subtitle Text
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter subtitle text"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Logo Upload (Optional)
        </label>
        <input
          ref={logoFileRef}
          type="file"
          accept="image/*"
          onChange={handleLogoImageChange}
          className="hidden"
        />
        <button
          onClick={() => logoFileRef.current?.click()}
          className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
        >
          {logoImagePreview ? (
            <div className="relative w-full h-full p-2">
              <img
                src={logoImagePreview}
                alt="Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <>
              <Upload size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Upload brand logo</span>
            </>
          )}
        </button>
        {logoImage && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {logoImage.name}
          </p>
        )}
      </div>

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

      </div>

      <div className="sticky bottom-0 pt-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-4">
        <button
          onClick={handleGenerate}
          disabled={
            (!inputImage && !inputImagePreview) ||
            !selectedPreset ||
            (mode === 'prompt' && !selectedPrompt) ||
            (mode === 'upload' && !referenceImage)
          }
          className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors overflow-hidden group shadow-lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            Generate Poster
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    </div>
  );
}
