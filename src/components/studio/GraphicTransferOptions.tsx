import { useState, useRef } from 'react';
import { Upload, Sparkles, Image } from 'lucide-react';
import ManualMaskingEditor from './ManualMaskingEditor';

type MaskingMethod = 'automatic' | 'manual';

interface GraphicTransferOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

export default function GraphicTransferOptions({ onGenerate }: GraphicTransferOptionsProps) {
  const [maskingMethod, setMaskingMethod] = useState<MaskingMethod>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [targetImagePreview, setTargetImagePreview] = useState<string | null>(null);
  const [showMaskingEditor, setShowMaskingEditor] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const targetFileRef = useRef<HTMLInputElement>(null);

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

  const handleTargetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTargetImage(file);
      setMaskData(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTargetImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (maskingMethod === 'manual' && !maskData && targetImagePreview) {
      setShowMaskingEditor(true);
      return;
    }

    const data: Record<string, unknown> = {
      inputImage,
      targetImage,
      maskingMethod,
      maskData,
    };

    onGenerate(data);
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);

    onGenerate({
      inputImage,
      targetImage,
      maskingMethod: 'manual',
      maskData: data,
    });
  };

  return (
    <>
      {showMaskingEditor && targetImagePreview && (
        <ManualMaskingEditor
          image={targetImagePreview}
          onComplete={handleMaskingComplete}
          onCancel={() => setShowMaskingEditor(false)}
          mode="manual"
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Source Images
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Input Image (Graphic/Pattern)
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
                    <Image size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Upload</span>
                  </>
                )}
              </button>
              {inputImage && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {inputImage.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Target Image (Base)
              </label>
              <input
                ref={targetFileRef}
                type="file"
                accept="image/*"
                onChange={handleTargetImageChange}
                className="hidden"
              />
              <button
                onClick={() => targetFileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-brand dark:hover:border-brand transition-all flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand group"
              >
                {targetImagePreview ? (
                  <div className="relative w-full h-full p-2">
                    <img
                      src={targetImagePreview}
                      alt="Target"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Upload</span>
                  </>
                )}
              </button>
              {targetImage && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {targetImage.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Masking Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMaskingMethod('automatic')}
              className={`p-3 rounded-xl text-left transition-all border ${
                maskingMethod === 'automatic'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Automatic</span>
              </div>
              <p className={`text-xs ${maskingMethod === 'automatic' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
                AI-powered detection
              </p>
            </button>

            <button
              onClick={() => {
                setMaskingMethod('manual');
                setMaskData(null);
              }}
              className={`p-3 rounded-xl text-left transition-all border ${
                maskingMethod === 'manual'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Image size={16} />
                <span className="text-sm font-semibold">Manual</span>
              </div>
              <p className={`text-xs ${maskingMethod === 'manual' ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'}`}>
                Draw custom area
              </p>
            </button>
          </div>
          {maskData && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
              Mask area defined
            </p>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!inputImage || !targetImage}
          className="relative w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            Transfer Graphic
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    </>
  );
}
