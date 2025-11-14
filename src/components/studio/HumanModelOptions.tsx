import { useState, useRef } from 'react';
import { Upload, Sparkles, User, Shuffle } from 'lucide-react';
import ManualMaskingEditor from './ManualMaskingEditor';

type ModeType = 'automatic' | 'prompt' | 'manual' | 'swap';
type SwapType = 'face' | 'body' | 'pose';
type GenderType = 'male' | 'female';

interface HumanModelOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

const promptOptions = {
  male: [
    'Professional Business Executive',
    'Athletic Fitness Model',
    'Casual Contemporary Style',
    'Professional Portrait',
    'Smart Casual Professional',
    'Sports Athlete Portrait',
  ],
  female: [
    'Professional Business Woman',
    'Professional Model Portrait',
    'Casual Contemporary Style',
    'Elegant Portrait Style',
    'Fitness & Wellness Model',
    'Creative Artist Portrait',
  ],
};

const ethnicities = ['Caucasian', 'African', 'Asian', 'Hispanic', 'Middle Eastern', 'Mixed'];
const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'Auburn'];
const hairStyles = ['Short', 'Medium', 'Long', 'Curly', 'Straight', 'Wavy', 'Bald'];
const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber'];
const bodyTypes = ['Slim', 'Athletic', 'Average', 'Muscular', 'Plus Size'];
const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+'];
const skinTones = ['Very Fair', 'Fair', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark Brown'];

const modeDescriptions = {
  automatic: 'AI generates realistic human models with natural features',
  prompt: 'Choose from curated style presets for your model',
  manual: 'Customize every detail of your model appearance',
  swap: 'Replace face or body from reference images',
};

export default function HumanModelOptions({ onGenerate }: HumanModelOptionsProps) {
  const [mode, setMode] = useState<ModeType>('automatic');
  const [gender, setGender] = useState<GenderType>('female');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [swapType, setSwapType] = useState<SwapType>('face');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);

  const [manualOptions, setManualOptions] = useState({
    ethnicity: 'Caucasian',
    hairColor: 'Brown',
    hairStyle: 'Medium',
    eyeColor: 'Brown',
    bodyType: 'Average',
    ageRange: '26-35',
    skinTone: 'Fair',
  });

  const modelInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [showMaskingEditor, setShowMaskingEditor] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);
  const [modelImagePreview, setModelImagePreview] = useState<string | null>(null);

  const handleGenerate = () => {
    if (mode === 'swap' && swapType !== 'pose' && !maskData && modelImage) {
      setShowMaskingEditor(true);
      return;
    }

    const data: Record<string, unknown> = {
      mode,
      gender,
    };

    if (mode === 'automatic') {
      data.automatic = true;
    } else if (mode === 'prompt') {
      data.prompt = selectedPrompt;
    } else if (mode === 'manual') {
      data.manualOptions = manualOptions;
    } else if (mode === 'swap') {
      data.swapType = swapType;
      data.modelImage = modelImage;
      data.targetImage = targetImage;
      data.maskData = maskData;
    }

    onGenerate(data);
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);

    onGenerate({
      mode,
      gender,
      swapType,
      modelImage,
      targetImage,
      maskData: data,
    });
  };

  const handleModelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setModelImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {showMaskingEditor && modelImagePreview && (
        <ManualMaskingEditor
          image={modelImagePreview}
          onComplete={handleMaskingComplete}
          onCancel={() => setShowMaskingEditor(false)}
          mode="manual"
        />
      )}

      <div className="flex flex-col h-full">
        <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pb-4">
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
              AI-powered generation
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
            onClick={() => setMode('manual')}
            className={`p-3 rounded-xl text-left transition-all border ${
              mode === 'manual'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <User size={16} />
              <span className="text-sm font-semibold">Manual</span>
            </div>
            <p className={`text-xs ${mode === 'manual' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Custom details
            </p>
          </button>

          <button
            onClick={() => setMode('swap')}
            className={`p-3 rounded-xl text-left transition-all border ${
              mode === 'swap'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shuffle size={16} />
              <span className="text-sm font-semibold">Swap</span>
            </div>
            <p className={`text-xs ${mode === 'swap' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Reference-based
            </p>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {modeDescriptions[mode]}
        </p>
      </div>

      {mode !== 'swap' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Gender
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                gender === 'male'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                gender === 'female'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Female
            </button>
          </div>
        </div>
      )}

      {mode === 'prompt' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Style Preset
          </label>
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-800 pr-2">
            <div className="grid grid-cols-2 gap-3">
              {promptOptions[gender].map((prompt) => (
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
                    <User size={20} className={selectedPrompt === prompt ? 'text-white dark:text-gray-900' : 'text-brand'} />
                    <span className="leading-tight">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Ethnicity
              </label>
              <select
                value={manualOptions.ethnicity}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, ethnicity: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {ethnicities.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Age Range
              </label>
              <select
                value={manualOptions.ageRange}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, ageRange: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {ageRanges.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Body Type
              </label>
              <select
                value={manualOptions.bodyType}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, bodyType: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {bodyTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hair Color
              </label>
              <select
                value={manualOptions.hairColor}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, hairColor: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {hairColors.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hair Style
              </label>
              <select
                value={manualOptions.hairStyle}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, hairStyle: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {hairStyles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Eye Color
              </label>
              <select
                value={manualOptions.eyeColor}
                onChange={(e) =>
                  setManualOptions({ ...manualOptions, eyeColor: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {eyeColors.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Skin Tone
            </label>
            <select
              value={manualOptions.skinTone}
              onChange={(e) =>
                setManualOptions({ ...manualOptions, skinTone: e.target.value })
              }
              className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {skinTones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {mode === 'swap' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Swap Type
            </label>
            <div className="flex gap-2">
              {(['face', 'body', 'pose'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSwapType(type)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                    swapType === type
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Model Image
              </label>
              <input
                ref={modelInputRef}
                type="file"
                accept="image/*"
                onChange={handleModelImageChange}
                className="hidden"
              />
              <button
                onClick={() => modelInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <Upload size={20} />
                <span className="text-xs">
                  {modelImage ? modelImage.name : 'Upload'}
                </span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Target Image
              </label>
              <input
                ref={targetInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setTargetImage(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                onClick={() => targetInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <Upload size={20} />
                <span className="text-xs">
                  {targetImage ? targetImage.name : 'Upload'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

        </div>

        <div className="sticky bottom-0 pt-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-4">
          <button
            onClick={handleGenerate}
            disabled={
              (mode === 'prompt' && !selectedPrompt) ||
              (mode === 'swap' && (!modelImage || !targetImage))
            }
            className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors overflow-hidden group shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles size={16} className="animate-pulse" />
              Generate
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </>
  );
}
