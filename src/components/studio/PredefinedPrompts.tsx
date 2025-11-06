import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface PredefinedPromptsProps {
  workflowType: string;
  onSelectPrompt: (prompt: string) => void;
}

interface PromptPreset {
  text: string;
  image?: string;
  color?: string;
  icon?: string;
}

const promptsByWorkflow: Record<string, PromptPreset[]> = {
  model: [
    { text: 'Professional business portrait, neutral background', color: 'from-gray-700 to-gray-800' },
    { text: 'Fashion model, studio lighting, haute couture', color: 'from-pink-900 to-purple-900' },
    { text: 'Casual outdoor portrait, natural lighting', color: 'from-green-700 to-blue-700' },
    { text: 'Athletic fitness model, dynamic pose', color: 'from-orange-700 to-red-700' },
  ],
  tryon: [
    { text: 'Model wearing casual summer outfit', color: 'from-yellow-600 to-orange-600' },
    { text: 'Professional business attire on model', color: 'from-gray-700 to-blue-800' },
    { text: 'Evening wear on elegant model', color: 'from-purple-900 to-pink-900' },
    { text: 'Streetwear fashion on urban model', color: 'from-slate-800 to-zinc-800' },
  ],
  color_change: [
    { text: 'Change dress color to red', color: 'from-red-600 to-red-800' },
    { text: 'Make background blue', color: 'from-blue-600 to-blue-800' },
    { text: 'Convert to black and white', color: 'from-gray-600 to-gray-900' },
    { text: 'Change car color to metallic silver', color: 'from-slate-400 to-slate-600' },
  ],
  background: [
    { text: 'White studio background', color: 'from-gray-100 to-gray-300' },
    { text: 'Modern office setting', color: 'from-slate-600 to-gray-700' },
    { text: 'Natural outdoor landscape', color: 'from-green-600 to-emerald-700' },
    { text: 'Urban cityscape background', color: 'from-slate-700 to-zinc-800' },
    { text: 'Beach sunset scene', color: 'from-orange-500 to-pink-600' },
    { text: 'Minimalist gradient background', color: 'from-blue-500 to-purple-600' },
  ],
  lifestyle: [
    { text: 'Morning coffee at cafe', color: 'from-amber-700 to-brown-700' },
    { text: 'Working from home setup', color: 'from-slate-600 to-gray-700' },
    { text: 'Outdoor fitness activity', color: 'from-green-600 to-teal-700' },
    { text: 'Weekend brunch with friends', color: 'from-yellow-600 to-orange-600' },
    { text: 'Relaxing at beach', color: 'from-cyan-600 to-blue-700' },
    { text: 'City exploration', color: 'from-slate-700 to-stone-800' },
  ],
  video: [
    { text: 'Smooth cinematic movement', color: 'from-slate-700 to-gray-800' },
    { text: 'Dynamic zoom effect', color: 'from-purple-700 to-pink-700' },
    { text: 'Gentle panning motion', color: 'from-blue-700 to-cyan-700' },
    { text: 'Parallax depth effect', color: 'from-indigo-700 to-purple-700' },
  ],
  poster: [
    { text: 'Modern minimal social media post', color: 'from-gray-700 to-slate-800' },
    { text: 'Bold typography with brand colors', color: 'from-red-600 to-orange-600' },
    { text: 'Elegant product showcase', color: 'from-slate-600 to-zinc-700' },
    { text: 'Vibrant promotional graphic', color: 'from-pink-600 to-purple-600' },
  ],
  graphic_transfer: [
    { text: 'Transfer logo to product', color: 'from-blue-700 to-slate-800' },
    { text: 'Apply pattern to clothing', color: 'from-purple-700 to-pink-700' },
    { text: 'Add design to surface', color: 'from-green-700 to-teal-700' },
    { text: 'Place graphic on mockup', color: 'from-orange-700 to-red-700' },
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
      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt.text)}
              className="group relative overflow-hidden px-3 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-600 rounded-lg text-left text-sm transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative flex items-start gap-2">
                <ImageIcon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-xs leading-relaxed">{prompt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
