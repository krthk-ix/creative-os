import { LayoutGrid, Columns2 } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import ChatInterface from './studio/ChatInterface';
import SplitViewStudio from './studio/SplitViewStudio';

interface StudioWrapperProps {
  selectedWorkflow: string;
  workflowName: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function StudioWrapper({ selectedWorkflow, workflowName, onSelectWorkflow }: StudioWrapperProps) {
  const { layoutMode, setLayoutMode } = useLayout();

  const toggleLayout = () => {
    setLayoutMode(layoutMode === 'floating' ? 'split' : 'floating');
  };

  return (
    <div className="relative h-full w-full">
      {/* Layout Toggle Button */}
      <button
        onClick={toggleLayout}
        className="fixed top-20 right-4 z-50 p-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title={`Switch to ${layoutMode === 'floating' ? 'Split' : 'Floating'} Layout`}
      >
        {layoutMode === 'split' ? (
          <LayoutGrid size={20} className="text-gray-900 dark:text-white" />
        ) : (
          <Columns2 size={20} className="text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Render appropriate layout */}
      {layoutMode === 'split' ? (
        <SplitViewStudio
          selectedWorkflow={selectedWorkflow}
          workflowName={workflowName}
          onSelectWorkflow={onSelectWorkflow}
        />
      ) : (
        <div className="h-full w-full bg-gray-50 dark:bg-gray-950">
          <ChatInterface
            selectedWorkflow={selectedWorkflow}
            workflowName={workflowName}
            onSelectWorkflow={onSelectWorkflow}
          />
        </div>
      )}
    </div>
  );
}
