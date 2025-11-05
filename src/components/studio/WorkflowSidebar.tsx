import { useState } from 'react';
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
  ChevronRight,
  Menu,
  X,
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

interface WorkflowSidebarProps {
  selectedWorkflow: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function WorkflowSidebar({ selectedWorkflow, onSelectWorkflow }: WorkflowSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="font-semibold text-gray-900 dark:text-gray-100">Workflows</h2>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            const isSelected = selectedWorkflow === workflow.id;

            return (
              <button
                key={workflow.id}
                onClick={() => onSelectWorkflow(workflow.id, workflow.name)}
                className={`w-full flex ${isCollapsed ? 'flex-col items-center gap-1 py-2' : 'items-center gap-3 px-3 py-2.5'} rounded-lg transition-all mb-1 ${
                  isSelected
                    ? 'bg-gray-100 dark:bg-gray-900/30 text-brand dark:text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? workflow.name : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isCollapsed ? (
                  <span className="text-[10px] text-center font-medium leading-tight">{workflow.name}</span>
                ) : (
                  <>
                    <span className="flex-1 text-left text-sm">{workflow.name}</span>
                    {isSelected && <ChevronRight size={16} />}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
