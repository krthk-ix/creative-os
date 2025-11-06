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
  male: ['Business', 'Athletic', 'Casual', 'Fashion', 'Professional', 'Sports'],
  female: ['Business', 'Runway', 'Casual', 'Evening', 'Fitness', 'Creative'],
};

const ethnicities = ['Caucasian', 'African', 'Asian', 'Hispanic', 'Middle Eastern', 'Mixed'];
const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+'];

export default function HumanModelOptions({ onGenerate }: HumanModelOptionsProps) {
  const [mode, setMode] = useState<ModeType>('automatic');
  const [gender, setGender] = useState<GenderType>('female');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [swapType, setSwapType] = useState<SwapType>('face');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [ethnicity, setEthnicity] = useState('Caucasian');
  const [ageRange, setAgeRange] = useState('26-35');

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

    const data: Record<string, unknown> = { mode, gender };
    if (mode === 'prompt') data.prompt = selectedPrompt;
    else if (mode === 'manual') data.manual = { ethnicity, ageRange };
    else if (mode === 'swap') data.swap = { swapType, modelImage, targetImage, maskData };

    onGenerate(data);
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);
    onGenerate({ mode, gender, swapType, modelImage, targetImage, maskData: data });
  };

  const handleModelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setModelImagePreview(e.target?.result as string);
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

      <div className="space-y-2.5">
        <div>
          <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'automatic', icon: Sparkles, label: 'Auto' },
              { id: 'prompt', icon: Sparkles, label: 'Preset' },
              { id: 'manual', icon: User, label: 'Custom' },
              { id: 'swap', icon: Shuffle, label: 'Swap' },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as ModeType)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    mode === m.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={12} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {mode !== 'swap' && (
          <div>
            <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Gender</label>
            <div className="flex gap-1.5">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    gender === g
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'prompt' && (
          <div>
            <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Style</label>
            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
              {promptOptions[gender].map((prompt) => (
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

        {mode === 'manual' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Ethnicity</label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] text-gray-900 dark:text-gray-100"
              >
                {ethnicities.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Age</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] text-gray-900 dark:text-gray-100"
              >
                {ageRanges.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {mode === 'swap' && (
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
              <div className="flex gap-1.5">
                {(['face', 'body', 'pose'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSwapType(type)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input ref={modelInputRef} type="file" accept="image/*" onChange={handleModelImageChange} className="hidden" />
                <button
                  onClick={() => modelInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
                >
                  <Upload size={14} />
                  <span className="text-[9px]">{modelImage ? 'Model ✓' : 'Model'}</span>
                </button>
              </div>

              <div>
                <input ref={targetInputRef} type="file" accept="image/*" onChange={(e) => setTargetImage(e.target.files?.[0] || null)} className="hidden" />
                <button
                  onClick={() => targetInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
                >
                  <Upload size={14} />
                  <span className="text-[9px]">{targetImage ? 'Target ✓' : 'Target'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={(mode === 'prompt' && !selectedPrompt) || (mode === 'swap' && (!modelImage || !targetImage))}
          className="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-sm">Generate</span>
        </button>
      </div>
    </>
  );
}
