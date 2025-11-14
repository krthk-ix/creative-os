import { useState, useRef } from 'react';
import { Upload, Sparkles, Camera, ChevronDown } from 'lucide-react';
import ManualMaskingEditor from './ManualMaskingEditor';

type TryonType = 'fashion' | 'watch' | 'shoes' | 'pet' | 'car' | 'jewelry';
type MaskingMethod = 'automatic' | 'manual';

interface VirtualTryonOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

interface ImageUpload {
  file: File | null;
  preview: string | null;
  score: number | null;
  isAnalyzing: boolean;
}

const tryonTypes = [
  { id: 'fashion' as const, label: 'Fashion', description: 'Clothing & items' },
  { id: 'watch' as const, label: 'Watch', description: 'Watches & bands' },
  { id: 'shoes' as const, label: 'Shoes', description: 'Footwear' },
  { id: 'jewelry' as const, label: 'Jewelry', description: 'Accessories' },
  { id: 'pet' as const, label: 'Pet', description: 'Pet accessories' },
  { id: 'car' as const, label: 'Car', description: 'Vehicle parts' },
];

const imageRequirements = {
  fashion: { minWidth: 512, minHeight: 512, formats: ['jpg', 'png', 'webp'], maxSize: 10 },
  watch: { minWidth: 512, minHeight: 512, formats: ['jpg', 'png', 'webp'], maxSize: 10 },
  shoes: { minWidth: 512, minHeight: 512, formats: ['jpg', 'png', 'webp'], maxSize: 10 },
  jewelry: { minWidth: 512, minHeight: 512, formats: ['jpg', 'png', 'webp'], maxSize: 10 },
  pet: { minWidth: 512, minHeight: 512, formats: ['jpg', 'png', 'webp'], maxSize: 10 },
  car: { minWidth: 768, minHeight: 768, formats: ['jpg', 'png', 'webp'], maxSize: 15 },
};

export default function VirtualTryonOptions({ onGenerate }: VirtualTryonOptionsProps) {
  const [tryonType, setTryonType] = useState<TryonType>('fashion');
  const [maskingMethod, setMaskingMethod] = useState<MaskingMethod>('automatic');
  const [inputImage, setInputImage] = useState<ImageUpload>({
    file: null,
    preview: null,
    score: null,
    isAnalyzing: false,
  });
  const [targetImage, setTargetImage] = useState<ImageUpload>({
    file: null,
    preview: null,
    score: null,
    isAnalyzing: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);
  const [showMaskingEditor, setShowMaskingEditor] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);

  const analyzeImage = async (file: File, type: 'input' | 'target') => {
    const setter = type === 'input' ? setInputImage : setTargetImage;

    setter((prev) => ({ ...prev, isAnalyzing: true }));

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockScore = Math.floor(Math.random() * 30) + 70;

    setter((prev) => ({ ...prev, score: mockScore, isAnalyzing: false }));
  };

  const handleImageUpload = (file: File, type: 'input' | 'target') => {
    const setter = type === 'input' ? setInputImage : setTargetImage;
    const reader = new FileReader();

    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setter({
        file,
        preview,
        score: null,
        isAnalyzing: false,
      });
      analyzeImage(file, type);
    };

    reader.readAsDataURL(file);
  };

  const handleMaskingClick = () => {
    if (maskingMethod === 'manual') {
      setShowMaskingEditor(true);
    }
  };

  const handleGenerate = () => {
    onGenerate({
      tryonType,
      maskingMethod,
      inputImage: inputImage.file,
      targetImage: targetImage.file,
      inputScore: inputImage.score,
      targetScore: targetImage.score,
      maskData,
    });
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);
    onGenerate({
      tryonType,
      maskingMethod,
      inputImage: inputImage.file,
      targetImage: targetImage.file,
      inputScore: inputImage.score,
      targetScore: targetImage.score,
      maskData: data,
    });
  };

  const canGenerate = inputImage.file && targetImage.file;

  const requirements = imageRequirements[tryonType];

  return (
    <>
      {showMaskingEditor && targetImage.preview && (
        <ManualMaskingEditor
          image={targetImage.preview}
          onComplete={handleMaskingComplete}
          onCancel={() => setShowMaskingEditor(false)}
          mode="manual"
        />
      )}

      <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Try-On Type
        </label>
        <div className="relative">
          <select
            value={tryonType}
            onChange={(e) => setTryonType(e.target.value as TryonType)}
            className="w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            {tryonTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <ImageUploadCard
          label="Input Image"
          subtitle="Item to try on"
          image={inputImage}
          inputRef={inputRef}
          onUpload={(file) => handleImageUpload(file, 'input')}
          requirements={requirements}
        />
        <ImageUploadCard
          label="Target Image"
          subtitle="Person/object"
          image={targetImage}
          inputRef={targetRef}
          onUpload={(file) => handleImageUpload(file, 'target')}
          requirements={requirements}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Masking Method
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setMaskingMethod('automatic')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              maskingMethod === 'automatic'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              <span>Automatic</span>
            </div>
          </button>
          <button
            onClick={() => {
              setMaskingMethod('manual');
              setMaskData(null);
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              maskingMethod === 'manual'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Camera size={14} />
              <span>Manual</span>
            </div>
          </button>
        </div>
      </div>

      {maskingMethod === 'manual' && canGenerate && (
        <button
          onClick={handleMaskingClick}
          className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Camera size={16} />
          {maskData ? 'Edit Masking' : 'Define Masking Area'}
        </button>
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || (maskingMethod === 'manual' && !maskData)}
        className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          Generate
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
      </div>
    </>
  );
}

interface ImageUploadCardProps {
  label: string;
  subtitle: string;
  image: ImageUpload;
  inputRef: React.RefObject<HTMLInputElement>;
  onUpload: (file: File) => void;
  requirements: {
    minWidth: number;
    minHeight: number;
    formats: string[];
    maxSize: number;
  };
}

function ImageUploadCard({ label, subtitle, image, inputRef, onUpload, requirements }: ImageUploadCardProps) {
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Fair';
  };

  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
        <span className="text-gray-400 dark:text-gray-500 ml-1">({subtitle})</span>
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleClick}
        className="relative border border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer overflow-hidden bg-gray-50 dark:bg-gray-900 group"
      >
        {image.preview ? (
          <div className="relative aspect-[4/3]">
            <img src={image.preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={18} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] flex flex-col items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 p-2">
            <Upload size={18} />
            <span className="text-[10px] text-center">Upload</span>
            <div className="text-[9px] text-gray-400 dark:text-gray-500 text-center leading-tight mt-1">
              <div>{requirements.minWidth}x{requirements.minHeight}px</div>
              <div>Max {requirements.maxSize}MB</div>
              <div>{requirements.formats.join(', ').toUpperCase()}</div>
            </div>
          </div>
        )}
      </div>

      {image.isAnalyzing && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-brand"></div>
          <span>Analyzing...</span>
        </div>
      )}

      {image.score !== null && !image.isAnalyzing && (
        <div className="mt-1 flex items-center justify-between px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">
          <span className="text-gray-600 dark:text-gray-400">Score:</span>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${getScoreColor(image.score)}`}>{image.score}%</span>
            <span className={`font-medium ${getScoreColor(image.score)}`}>
              {getScoreLabel(image.score)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
