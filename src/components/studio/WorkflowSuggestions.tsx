import { ArrowRight, Sparkles, ArrowUpCircle, Maximize2, Camera, Shirt, FileImage, Video } from 'lucide-react';
import { WorkflowRelationship } from '../../lib/workflowChaining';

interface WorkflowSuggestionsProps {
  suggestions: WorkflowRelationship[];
  onSelectWorkflow: (workflowId: string) => void;
  imageUrl: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shirt,
  Camera,
  ArrowUpCircle,
  Maximize2,
  FileImage,
  Video,
  Sparkles,
};

export default function WorkflowSuggestions({ suggestions, onSelectWorkflow, imageUrl }: WorkflowSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-blue-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-brand" size={18} />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Continue your workflow
        </h4>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        Take this image further with these suggested workflows:
      </p>

      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = iconMap[suggestion.icon] || Sparkles;
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectWorkflow(suggestion.id)}
              className="group w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Icon className="text-white" size={18} />
              </div>

              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                  {suggestion.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </div>
              </div>

              <ArrowRight
                className="text-gray-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all flex-shrink-0"
                size={18}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Your image will be automatically loaded as input
        </p>
      </div>
    </div>
  );
}
