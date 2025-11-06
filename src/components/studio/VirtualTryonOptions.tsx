import { useState, useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import ManualMaskingEditor from './ManualMaskingEditor';

type TryonType = 'fashion' | 'watch' | 'shoes' | 'pet' | 'car' | 'jewelry';
type MaskingMethod = 'automatic' | 'manual';

interface VirtualTryonOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

export default function VirtualTryonOptions({ onGenerate }: VirtualTryonOptionsProps) {
  const [tryonType, setTryonType] = useState<TryonType>('fashion');
  const [maskingMethod, setMaskingMethod] = useState<MaskingMethod>('automatic');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [showMaskingEditor, setShowMaskingEditor] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);
  const [targetPreview, setTargetPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (maskingMethod === 'manual' && !maskData) {
      setShowMaskingEditor(true);
      return;
    }
    onGenerate({ tryonType, maskingMethod, inputImage, targetImage, maskData });
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);
    onGenerate({ tryonType, maskingMethod, inputImage, targetImage, maskData: data });
  };

  const handleTargetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTargetImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setTargetPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {showMaskingEditor && targetPreview && (
        <ManualMaskingEditor
          image={targetPreview}
          onComplete={handleMaskingComplete}
          onCancel={() => setShowMaskingEditor(false)}
          mode="manual"
        />
      )}

      <div className="space-y-2.5">
        <div>
          <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
          <select
            value={tryonType}
            onChange={(e) => setTryonType(e.target.value as TryonType)}
            className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100"
          >
            <option value="fashion">Fashion</option>
            <option value="watch">Watch</option>
            <option value="shoes">Shoes</option>
            <option value="jewelry">Jewelry</option>
            <option value="pet">Pet</option>
            <option value="car">Car</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input ref={inputRef} type="file" accept="image/*" onChange={(e) => setInputImage(e.target.files?.[0] || null)} className="hidden" />
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
            >
              <Upload size={14} />
              <span className="text-[9px]">{inputImage ? 'Item ✓' : 'Item'}</span>
            </button>
          </div>

          <div>
            <input ref={targetRef} type="file" accept="image/*" onChange={handleTargetUpload} className="hidden" />
            <button
              onClick={() => targetRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
            >
              <Upload size={14} />
              <span className="text-[9px]">{targetImage ? 'Target ✓' : 'Target'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">Masking</label>
          <div className="flex gap-1.5">
            {(['automatic', 'manual'] as const).map((method) => (
              <button
                key={method}
                onClick={() => { setMaskingMethod(method); setMaskData(null); }}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  maskingMethod === method
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {maskingMethod === 'manual' && inputImage && targetImage && (
          <button
            onClick={() => setShowMaskingEditor(true)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-xs"
          >
            {maskData ? 'Edit Mask' : 'Define Mask'}
          </button>
        )}

        <button
          onClick={handleGenerate}
          disabled={!inputImage || !targetImage || (maskingMethod === 'manual' && !maskData)}
          className="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-sm">Generate</span>
        </button>
      </div>
    </>
  );
}
