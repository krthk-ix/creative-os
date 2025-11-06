import { ArrowRight, ArrowUpCircle, Maximize2, Camera, Shirt, FileImage, Video } from 'lucide-react';
import { WorkflowRelationship } from '../../lib/workflowChaining';

interface WorkflowSuggestionsProps {
  suggestions: WorkflowRelationship[];
  onSelectWorkflow: (workflowId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shirt,
  Camera,
  ArrowUpCircle,
  Maximize2,
  FileImage,
  Video,
};

export default function WorkflowSuggestions({ suggestions, onSelectWorkflow }: WorkflowSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const topSuggestions = suggestions.slice(0, 2);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 dark:text-gray-400">Continue:</span>
      {topSuggestions.map((suggestion) => {
        const Icon = iconMap[suggestion.icon] || ArrowUpCircle;
        return (
          <button
            key={suggestion.id}
            onClick={() => onSelectWorkflow(suggestion.id)}
            className="group inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand transition-all text-xs"
            title={suggestion.description}
          >
            <Icon className="text-gray-500 dark:text-gray-400 group-hover:text-brand" size={12} />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-brand font-medium">
              {suggestion.name}
            </span>
            <ArrowRight
              className="text-gray-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all"
              size={10}
            />
          </button>
        );
      })}
    </div>
  );
}
