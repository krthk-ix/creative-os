import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Image, Check, Trash2, RefreshCw } from 'lucide-react';

type OperationType = 'remove' | 'replace';
type ModeType = 'automatic' | 'prompt' | 'upload';

interface BackgroundOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
  preloadedImage?: string | null;
  onImageUsed?: () => void;
}

const backgroundPrompts = [
  'Modern Minimalist Studio',
  'Urban Street Scene',
  'Natural Outdoor Park',
  'Professional Office Space',
  'Cozy Home Interior',
  'Beach Sunset',
  'Mountain Landscape',
  'City Skyline',
  'Abstract Gradient',
  'Luxury Hotel Lobby',
  'Industrial Warehouse',
  'Garden with Flowers',
  'Night Club Atmosphere',
  'Coffee Shop Interior',
  'Art Gallery Space',
];

export default function BackgroundOptions({ onGenerate, preloadedImage, onImageUsed }: BackgroundOptionsProps) {
  const [operation, setOperation] = useState<OperationType | null>(null);
  const [mode, setMode] = useState<ModeType>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [aiGeneratedPrompts, setAiGeneratedPrompts] = useState<string[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isFromChain, setIsFromChain] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const backgroundFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preloadedImage) {
      setInputImagePreview(preloadedImage);
      setIsFromChain(true);
      if (onImageUsed) {
        onImageUsed();
      }
    }
  }, [preloadedImage, onImageUsed]);

  useEffect(() => {
    if (inputImagePreview && operation === 'replace' && mode === 'automatic' && aiGeneratedPrompts.length === 0) {
      generateAIPrompts();
    }
  }, [inputImagePreview, operation, mode]);

  const generateAIPrompts = () => {
    setIsGeneratingPrompts(true);
    setTimeout(() => {
      const generatedPrompts = [
        'Modern minimalist studio with soft shadows',
        'Professional office with glass walls',
        'Urban rooftop terrace with city skyline',
        'Natural outdoor garden with morning light',
        'Contemporary art gallery with white walls',
        'Luxury hotel lobby with marble floors',
      ];
      setAiGeneratedPrompts(generatedPrompts);
      setIsGeneratingPrompts(false);
    }, 1500);
  };

  const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setAiGeneratedPrompts([]);
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    const data: Record<string, unknown> = {
      operation,
      inputImage,
    };

    if (operation === 'replace') {
      data.mode = mode;
      if (mode === 'prompt' || mode === 'automatic') {
        data.prompt = selectedPrompt;
      } else if (mode === 'upload') {
        data.backgroundImage = backgroundImage;
      }
    }

    onGenerate(data);
  };

  if (!operation) {
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
            Choose Operation
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOperation('remove')}
              disabled={!inputImagePreview}
              className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-600 dark:group-hover:bg-red-500 transition-colors">
                  <Trash2 size={24} className="text-red-600 dark:text-red-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Remove Background
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Clean removal with transparent background
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setOperation('replace')}
              disabled={!inputImagePreview}
              className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors">
                  <RefreshCw size={24} className="text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Replace Background
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Generate or upload new background
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {!inputImagePreview && (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload an image to continue
            </p>
          </div>
        )}
      </div>
    );
  }

  if (operation === 'remove') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Remove Background</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Clean removal with transparent result</p>
          </div>
          <button
            onClick={() => setOperation(null)}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Change Operation
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            The background will be cleanly removed and the result will have a transparent background (PNG format).
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!inputImagePreview}
          className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Remove Background
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Replace Background</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Generate or upload new background</p>
          </div>
          <button
            onClick={() => setOperation(null)}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Change Operation
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Background Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setMode('automatic');
                if (inputImagePreview && aiGeneratedPrompts.length === 0) {
                  generateAIPrompts();
                }
              }}
              className={`p-3 rounded-xl text-left transition-all border ${
                mode === 'automatic'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">AI Prompts</span>
              </div>
              <p className={`text-xs ${mode === 'automatic' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
                Auto-generated
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
                <span className="text-sm font-semibold">Presets</span>
              </div>
              <p className={`text-xs ${mode === 'prompt' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
                Curated styles
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
                Custom image
              </p>
            </button>
          </div>
        </div>

        {mode === 'automatic' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                AI-Generated Prompts (Based on Image)
              </label>
              <button
                onClick={generateAIPrompts}
                className="text-xs text-brand hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Regenerate
              </button>
            </div>
            {isGeneratingPrompts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {aiGeneratedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPrompt(prompt)}
                      className={`group relative overflow-hidden px-4 py-3 rounded-lg text-xs font-medium text-left transition-all border ${
                        selectedPrompt === prompt
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles size={14} className={`mt-0.5 flex-shrink-0 ${selectedPrompt === prompt ? 'text-white dark:text-gray-900' : 'text-brand'}`} />
                        <span className="leading-relaxed">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'prompt' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Background Style Presets
            </label>
            <div className="max-h-72 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                {backgroundPrompts.map((prompt) => (
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
              Custom Background Image
            </label>
            <input
              ref={backgroundFileRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="hidden"
            />
            <button
              onClick={() => backgroundFileRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
            >
            {backgroundImagePreview ? (
              <div className="relative w-full h-full p-2">
                <img
                  src={backgroundImagePreview}
                  alt="Background"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <>
                <Upload size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Upload background image</span>
                <span className="text-xs">Click to browse</span>
              </>
            )}
            </button>
            {backgroundImage && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {backgroundImage.name}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={
          !inputImagePreview ||
          (mode === 'automatic' && !selectedPrompt) ||
          (mode === 'prompt' && !selectedPrompt) ||
          (mode === 'upload' && !backgroundImage)
        }
        className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group mt-4"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Replace Background
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  );
}
