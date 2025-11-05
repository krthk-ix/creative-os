import { useState } from 'react';
import { Settings, Wand2, Edit3, Grid, ImageIcon, Sliders } from 'lucide-react';
import PredefinedPrompts from './PredefinedPrompts';

interface WorkflowOptionsProps {
  workflowType: string;
  onConfirm: (options: WorkflowSettings) => void;
}

export interface WorkflowSettings {
  method: 'automatic' | 'prompt' | 'manual_mask' | 'options';
  outputCount: 2 | 4;
  outputFormat: 'avif' | 'webp' | 'jpg';
  upscaleLevel?: '2x' | '3x' | '4x';
  resizeOption?: string;
  customPrompt?: string;
  predefinedPrompt?: string;
  lifestyleOption?: string;
  videoOption?: string;
}

const methodConfigs: Record<string, string[]> = {
  model: ['automatic', 'prompt', 'manual_mask'],
  tryon: ['automatic', 'prompt', 'manual_mask'],
  color_change: ['automatic', 'prompt', 'manual_mask'],
  upscale: ['options'],
  graphic_transfer: ['automatic', 'manual_mask'],
  resize: ['options'],
  background: ['automatic', 'manual_mask', 'prompt'],
  lifestyle: ['automatic', 'options'],
  video: ['automatic', 'prompt'],
  poster: ['automatic', 'prompt'],
};

const upscaleOptions = ['2x', '3x', '4x'];
const resizeOptions = [
  'Instagram Profile (320x320)',
  'Instagram Post (1080x1080)',
  'Instagram Story (1080x1920)',
  'Facebook Cover (820x312)',
  'Twitter Header (1500x500)',
  'LinkedIn Banner (1584x396)',
  'YouTube Thumbnail (1280x720)',
];

const lifestyleOptions = [
  'Outdoor Natural',
  'Studio Professional',
  'Urban Street',
  'Home Casual',
  'Beach Lifestyle',
  'Cafe Modern',
];

const videoOptions = [
  'Pan Left',
  'Pan Right',
  'Zoom In',
  'Zoom Out',
];

export default function WorkflowOptions({ workflowType, onConfirm }: WorkflowOptionsProps) {
  const [settings, setSettings] = useState<WorkflowSettings>({
    method: 'automatic',
    outputCount: 2,
    outputFormat: 'webp',
  });

  const availableMethods = methodConfigs[workflowType] || ['automatic'];

  const handleMethodChange = (method: WorkflowSettings['method']) => {
    setSettings({ ...settings, method });
  };

  const handlePredefinedPrompt = (prompt: string) => {
    setSettings({ ...settings, predefinedPrompt: prompt, method: 'prompt' });
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-blue-400" size={20} />
        <h3 className="text-white font-medium">Configure Options</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Method</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableMethods.map((method) => (
              <button
                key={method}
                onClick={() => handleMethodChange(method as WorkflowSettings['method'])}
                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                  settings.method === method
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {method === 'automatic' && <Wand2 size={14} className="inline mr-1" />}
                {method === 'prompt' && <Edit3 size={14} className="inline mr-1" />}
                {method === 'manual_mask' && <ImageIcon size={14} className="inline mr-1" />}
                {method === 'options' && <Grid size={14} className="inline mr-1" />}
                {method.replace('_', ' ').charAt(0).toUpperCase() + method.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {settings.method === 'prompt' && (
          <div>
            <PredefinedPrompts
              workflowType={workflowType}
              onSelectPrompt={handlePredefinedPrompt}
            />
            <label className="block text-sm font-medium text-gray-300 mb-2 mt-3">
              Or write your own prompt
            </label>
            <textarea
              value={settings.customPrompt || ''}
              onChange={(e) => setSettings({ ...settings, customPrompt: e.target.value })}
              placeholder="Describe what you want to create..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        )}

        {settings.method === 'options' && workflowType === 'upscale' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upscale Level</label>
            <div className="grid grid-cols-3 gap-2">
              {upscaleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSettings({ ...settings, upscaleLevel: option as '2x' | '3x' | '4x' })}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                    settings.upscaleLevel === option
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {settings.method === 'options' && workflowType === 'resize' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
            <select
              value={settings.resizeOption || ''}
              onChange={(e) => setSettings({ ...settings, resizeOption: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select size</option>
              {resizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {settings.method === 'options' && workflowType === 'lifestyle' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lifestyle Style</label>
            <div className="grid grid-cols-2 gap-2">
              {lifestyleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSettings({ ...settings, lifestyleOption: option })}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                    settings.lifestyleOption === option
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {workflowType === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Effect</label>
            <div className="grid grid-cols-2 gap-2">
              {videoOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSettings({ ...settings, videoOption: option })}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                    settings.videoOption === option
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Sliders size={14} className="inline mr-1" />
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['avif', 'webp', 'jpg'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setSettings({ ...settings, outputFormat: format })}
                className={`px-3 py-2 rounded-lg border text-sm uppercase transition-all ${
                  settings.outputFormat === format
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Grid size={14} className="inline mr-1" />
            Number of Outputs
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([2, 4] as const).map((count) => (
              <button
                key={count}
                onClick={() => setSettings({ ...settings, outputCount: count })}
                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                  settings.outputCount === count
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {count} Images
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onConfirm(settings)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
