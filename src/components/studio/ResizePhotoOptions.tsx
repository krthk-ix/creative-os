import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Maximize2, Check } from 'lucide-react';

interface ResizePhotoOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
  preloadedImage?: string | null;
  onImageUsed?: () => void;
}

interface SizePreset {
  name: string;
  width: number;
  height: number;
  category: string;
}

const socialMediaSizes: SizePreset[] = [
  { name: 'Profile Picture', width: 1000, height: 1000, category: 'Facebook' },
  { name: 'Cover Photo', width: 1520, height: 350, category: 'Facebook' },
  { name: 'Post Image', width: 1200, height: 630, category: 'Facebook' },
  { name: 'Story', width: 1080, height: 1920, category: 'Facebook' },

  { name: 'Profile Picture', width: 400, height: 400, category: 'Twitter' },
  { name: 'Header Photo', width: 1500, height: 500, category: 'Twitter' },
  { name: 'Post Image', width: 1200, height: 675, category: 'Twitter' },

  { name: 'Profile Picture', width: 320, height: 320, category: 'Instagram' },
  { name: 'Square Post', width: 1080, height: 1080, category: 'Instagram' },
  { name: 'Portrait Post', width: 1080, height: 1350, category: 'Instagram' },
  { name: 'Landscape Post', width: 1080, height: 566, category: 'Instagram' },
  { name: 'Story', width: 1080, height: 1920, category: 'Instagram' },
  { name: 'Reels', width: 1080, height: 1920, category: 'Instagram' },

  { name: 'Profile Picture', width: 400, height: 400, category: 'LinkedIn' },
  { name: 'Cover Photo', width: 1584, height: 396, category: 'LinkedIn' },
  { name: 'Post Image', width: 1200, height: 627, category: 'LinkedIn' },

  { name: 'Profile Picture', width: 800, height: 800, category: 'YouTube' },
  { name: 'Channel Banner', width: 2560, height: 1440, category: 'YouTube' },
  { name: 'Thumbnail', width: 1280, height: 720, category: 'YouTube' },

  { name: 'Pin', width: 1000, height: 1500, category: 'Pinterest' },
  { name: 'Profile Picture', width: 165, height: 165, category: 'Pinterest' },
];

type ViewMode = 'presets' | 'custom';
type FillMethod = 'generative' | 'stretch' | 'crop';

interface GenerativePreview {
  id: string;
  url: string;
  selected: boolean;
}

export default function ResizePhotoOptions({ onGenerate, preloadedImage, onImageUsed }: ResizePhotoOptionsProps) {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('presets');
  const [selectedPreset, setSelectedPreset] = useState<SizePreset | null>(null);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [selectedCategory, setSelectedCategory] = useState('Facebook');
  const [isFromChain, setIsFromChain] = useState(false);
  const [fillMethod, setFillMethod] = useState<FillMethod>('generative');
  const [showPreviews, setShowPreviews] = useState(false);
  const [generativePreviews, setGenerativePreviews] = useState<GenerativePreview[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

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

  const categories = Array.from(new Set(socialMediaSizes.map(s => s.category)));
  const filteredSizes = socialMediaSizes.filter(s => s.category === selectedCategory);

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
      viewMode,
    };

    if (viewMode === 'presets' && selectedPreset) {
      data.width = selectedPreset.width;
      data.height = selectedPreset.height;
      data.presetName = selectedPreset.name;
      data.category = selectedPreset.category;
    } else if (viewMode === 'custom') {
      data.width = customWidth;
      data.height = customHeight;
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
        <div className="relative">
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
              <span className="text-sm font-medium">Upload image to resize</span>
              <span className="text-xs">Click to browse</span>
            </>
          )}
          </button>
          {isFromChain && imagePreview && (
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
          Resize Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setViewMode('presets')}
            className={`p-3 rounded-xl text-left transition-all border ${
              viewMode === 'presets'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Social Media</span>
            </div>
            <p className={`text-xs ${viewMode === 'presets' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Preset sizes
            </p>
          </button>

          <button
            onClick={() => setViewMode('custom')}
            className={`p-3 rounded-xl text-left transition-all border ${
              viewMode === 'custom'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Maximize2 size={16} />
              <span className="text-sm font-semibold">Custom Size</span>
            </div>
            <p className={`text-xs ${viewMode === 'custom' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Manual dimensions
            </p>
          </button>
        </div>
      </div>

      {viewMode === 'presets' && (
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
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
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
      )}

      {viewMode === 'custom' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Fill Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFillMethod('generative')}
                className={`p-2.5 rounded-lg text-left transition-all border text-xs ${
                  fillMethod === 'generative'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold mb-0.5">Generative Fill</div>
                <div className={`text-xs ${fillMethod === 'generative' ? 'text-white/70 dark:text-gray-900/70' : 'text-gray-500 dark:text-gray-400'}`}>
                  AI extends bg
                </div>
              </button>
              <button
                onClick={() => setFillMethod('stretch')}
                className={`p-2.5 rounded-lg text-left transition-all border text-xs ${
                  fillMethod === 'stretch'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold mb-0.5">Stretch</div>
                <div className={`text-xs ${fillMethod === 'stretch' ? 'text-white/70 dark:text-gray-900/70' : 'text-gray-500 dark:text-gray-400'}`}>
                  Fit to size
                </div>
              </button>
              <button
                onClick={() => setFillMethod('crop')}
                className={`p-2.5 rounded-lg text-left transition-all border text-xs ${
                  fillMethod === 'crop'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-semibold mb-0.5">Smart Crop</div>
                <div className={`text-xs ${fillMethod === 'crop' ? 'text-white/70 dark:text-gray-900/70' : 'text-gray-500 dark:text-gray-400'}`}>
                  Center crop
                </div>
              </button>
            </div>
          </div>

          <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Custom Dimensions
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10000"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10000"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Aspect Ratio: {(customWidth / customHeight).toFixed(2)}:1
          </div>
          </div>

          {fillMethod === 'generative' && !showPreviews && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                Generative Fill Preview
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                We'll generate 3 preview options for you to choose from before final render.
              </p>
            </div>
          )}

          {showPreviews && generativePreviews.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Choose Best Preview (3 options)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {generativePreviews.map((preview) => (
                  <button
                    key={preview.id}
                    onClick={() => setSelectedPreview(preview.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPreview === preview.id
                        ? 'border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={preview.url}
                      alt={`Preview ${preview.id}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedPreview === preview.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white dark:bg-black rounded-full p-2">
                          <Check size={20} className="text-gray-900 dark:text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">Option {preview.id}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Select your preferred version, then click "Render Final" below
              </p>
            </div>
          )}
        </div>
      )}

      {showPreviews && selectedPreview ? (
        <button
          onClick={handleGenerate}
          className="relative w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Check size={16} />
            Render Final Image
          </span>
        </button>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={(!inputImage && !imagePreview) || (viewMode === 'presets' && !selectedPreset)}
          className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            {fillMethod === 'generative' && viewMode === 'custom' ? 'Generate 3 Previews' : 'Resize Image'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      )}
    </div>
  );
}
