import ChatInterface from './studio/ChatInterface';

interface StudioProps {
  selectedWorkflow: string;
  workflowName: string;
  sidebarCollapsed: boolean;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function Studio({ selectedWorkflow, workflowName, sidebarCollapsed, onSelectWorkflow }: StudioProps) {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950">
      <ChatInterface
        selectedWorkflow={selectedWorkflow}
        workflowName={workflowName}
        sidebarCollapsed={sidebarCollapsed}
        onSelectWorkflow={onSelectWorkflow}
      />
    </div>
  );
}
