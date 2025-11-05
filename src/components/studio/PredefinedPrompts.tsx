import { Sparkles } from 'lucide-react';

interface PredefinedPromptsProps {
  workflowType: string;
  onSelectPrompt: (prompt: string) => void;
}

const promptsByWorkflow: Record<string, string[]> = {
  model: [
    'Professional business portrait, neutral background',
    'Fashion model, studio lighting, haute couture',
    'Casual outdoor portrait, natural lighting',
    'Athletic fitness model, dynamic pose',
  ],
  tryon: [
    'Model wearing casual summer outfit',
    'Professional business attire on model',
    'Evening wear on elegant model',
    'Streetwear fashion on urban model',
  ],
  color_change: [
    'Change dress color to red',
    'Make background blue',
    'Convert to black and white',
    'Change car color to metallic silver',
  ],
  background: [
    'White studio background',
    'Modern office setting',
    'Natural outdoor landscape',
    'Urban cityscape background',
    'Beach sunset scene',
    'Minimalist gradient background',
  ],
  lifestyle: [
    'Morning coffee at cafe',
    'Working from home setup',
    'Outdoor fitness activity',
    'Weekend brunch with friends',
    'Relaxing at beach',
    'City exploration',
  ],
  video: [
    'Smooth cinematic movement',
    'Dynamic zoom effect',
    'Gentle panning motion',
    'Parallax depth effect',
  ],
  poster: [
    'Modern minimal social media post',
    'Bold typography with brand colors',
    'Elegant product showcase',
    'Vibrant promotional graphic',
  ],
  graphic_transfer: [
    'Transfer logo to product',
    'Apply pattern to clothing',
    'Add design to surface',
    'Place graphic on mockup',
  ],
};

export default function PredefinedPrompts({ workflowType, onSelectPrompt }: PredefinedPromptsProps) {
  const prompts = promptsByWorkflow[workflowType] || [];

  if (prompts.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <Sparkles size={14} className="inline mr-1" />
        Quick Prompts
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-600 rounded-lg text-left text-sm text-gray-300 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
