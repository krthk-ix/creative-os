import { useLayout } from '../contexts/LayoutContext';
import ChatInterface from './studio/ChatInterface';
import SplitViewStudio from './studio/SplitViewStudio';

interface StudioWrapperProps {
  selectedWorkflow: string;
  workflowName: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function StudioWrapper({ selectedWorkflow, workflowName, onSelectWorkflow }: StudioWrapperProps) {
  const { layoutMode } = useLayout();

  return layoutMode === 'split' ? (
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
  );
}
