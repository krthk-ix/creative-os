import ChatInterface from './studio/ChatInterface';

interface StudioProps {
  selectedWorkflow: string;
  workflowName: string;
  sidebarCollapsed: boolean;
}

export default function Studio({ selectedWorkflow, workflowName, sidebarCollapsed }: StudioProps) {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950">
      <ChatInterface
        selectedWorkflow={selectedWorkflow}
        workflowName={workflowName}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
}
