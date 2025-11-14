import { useState } from 'react';
import { ChevronDown, User, Shirt, Palette, ArrowUpCircle, Image, Maximize2, Camera, Video, FileImage, X } from 'lucide-react';

interface WorkflowOption {
  id: string;
  name: string;
  icon: typeof User;
  description: string;
}

const workflows: WorkflowOption[] = [
  { id: 'model', name: 'Human Model', icon: User, description: 'AI-generated models' },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt, description: 'Try items on models' },
  { id: 'color_change', name: 'Color Change', icon: Palette, description: 'Change colors' },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle, description: 'Enhance quality' },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: Image, description: 'Apply graphics' },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2, description: 'Resize images' },
  { id: 'background', name: 'Background', icon: Camera, description: 'Change backgrounds' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera, description: 'Lifestyle shots' },
  { id: 'video', name: 'Video Gen', icon: Video, description: 'Generate videos' },
  { id: 'poster', name: 'Social Poster', icon: FileImage, description: 'Social posts' },
];

interface MobileWorkflowSelectorProps {
  selectedWorkflow: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function MobileWorkflowSelector({ selectedWorkflow, onSelectWorkflow }: MobileWorkflowSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors min-w-[140px] sm:min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentWorkflow ? (
            <>
              <currentWorkflow.icon size={16} className="flex-shrink-0" />
              <span className="truncate">{currentWorkflow.name}</span>
            </>
          ) : (
            <span>Select Workflow</span>
          )}
        </div>
        <ChevronDown size={14} className="flex-shrink-0" />
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-2xl bg-white dark:bg-black rounded-t-2xl lg:rounded-2xl z-50 max-h-[80vh] lg:max-h-[600px] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choose Workflow
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Workflow Grid */}
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {workflows.map((workflow) => {
                  const Icon = workflow.icon;
                  const isSelected = selectedWorkflow === workflow.id;

                  return (
                    <button
                      key={workflow.id}
                      onClick={() => {
                        onSelectWorkflow(workflow.id, workflow.name);
                        setIsOpen(false);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-gray-900 dark:bg-white'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <Icon
                            size={20}
                            className={isSelected ? 'text-white dark:text-black' : 'text-gray-600 dark:text-gray-400'}
                          />
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold mb-0.5 ${
                            isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {workflow.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {workflow.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
