import { useState, useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import ManualMaskingEditor from './ManualMaskingEditor';

type MaskingMethod = 'automatic' | 'manual';

interface ColorChangeOptionsProps {
  onGenerate: (data: Record<string, unknown>) => void;
}

export default function ColorChangeOptions({ onGenerate }: ColorChangeOptionsProps) {
  const [maskingMethod, setMaskingMethod] = useState<MaskingMethod>('automatic');
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [targetImagePreview, setTargetImagePreview] = useState<string | null>(null);
  const [inputColor, setInputColor] = useState('#FF0000');
  const [showMaskingEditor, setShowMaskingEditor] = useState(false);
  const [maskData, setMaskData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTargetImage(file);
      setMaskData(null);
      const reader = new FileReader();
      reader.onload = (e) => setTargetImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (maskingMethod === 'manual' && !maskData) {
      setShowMaskingEditor(true);
      return;
    }
    onGenerate({ targetImage, inputColor, maskingMethod, maskData });
  };

  const handleMaskingComplete = (data: string) => {
    setMaskData(data);
    setShowMaskingEditor(false);
    onGenerate({ targetImage, inputColor, maskingMethod, maskData: data });
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

      <div className="space-y-2.5">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand transition-colors flex items-center justify-center"
        >
          {targetImagePreview ? (
            <img src={targetImagePreview} alt="Target" className="w-full h-full object-contain p-1.5 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400">
              <Upload size={18} />
              <span className="text-xs font-medium">Upload Image</span>
            </div>
          )}
        </button>

        <div>
          <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">New Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={inputColor}
              onChange={(e) => /^#[0-9A-F]{0,6}$/i.test(e.target.value) && setInputColor(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100"
              placeholder="#FF0000"
            />
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

        {maskingMethod === 'manual' && targetImage && (
          <button
            onClick={() => setShowMaskingEditor(true)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-xs"
          >
            {maskData ? 'Edit Mask' : 'Define Mask'}
          </button>
        )}

        <button
          onClick={handleGenerate}
          disabled={!targetImage || (maskingMethod === 'manual' && !maskData)}
          className="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-sm">Generate</span>
        </button>
      </div>
    </>
  );
}
