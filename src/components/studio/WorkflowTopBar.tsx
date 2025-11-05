import {
  User,
  Shirt,
  Palette,
  ArrowUpCircle,
  Image,
  Maximize2,
  Camera,
  Video,
  FileImage,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface WorkflowOption {
  id: string;
  name: string;
  icon: typeof User;
}

const workflows: WorkflowOption[] = [
  { id: 'model', name: 'Human Model', icon: User },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt },
  { id: 'color_change', name: 'Color Change', icon: Palette },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: Image },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2 },
  { id: 'background', name: 'Background', icon: Camera },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera },
  { id: 'video', name: 'Video Gen', icon: Video },
  { id: 'poster', name: 'Social Poster', icon: FileImage },
];

interface WorkflowTopBarProps {
  selectedWorkflow: string;
  onSelectWorkflow: (id: string, name: string) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export default function WorkflowTopBar({
  selectedWorkflow,
  onSelectWorkflow,
  showSettings,
  onToggleSettings,
}: WorkflowTopBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Select a Workflow
        </h2>
        <button
          onClick={onToggleSettings}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
        >
          <Settings size={18} />
          Settings
          <ChevronDown
            size={16}
            className={`transition-transform ${showSettings ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {workflows.map((workflow) => {
          const Icon = workflow.icon;
          const isSelected = selectedWorkflow === workflow.id;

          return (
            <button
              key={workflow.id}
              onClick={() => onSelectWorkflow(workflow.id, workflow.name)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all border-2 ${
                isSelected
                  ? 'bg-gray-100 dark:bg-gray-900/20 border-brand dark:border-brand shadow-lg shadow-brand/10'
                  : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-lg ${
                isSelected
                  ? 'bg-red-100 dark:bg-gray-900/40 text-brand dark:text-brand'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                <Icon size={24} />
              </div>
              <span className={`text-sm font-medium text-center ${
                isSelected
                  ? 'text-brand dark:text-brand'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {workflow.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
