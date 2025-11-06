import ChatInterface from './studio/ChatInterface';

interface StudioProps {
  selectedWorkflow: string;
  workflowName: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function Studio({ selectedWorkflow, workflowName, onSelectWorkflow }: StudioProps) {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950">
      <ChatInterface
        selectedWorkflow={selectedWorkflow}
        workflowName={workflowName}
        onSelectWorkflow={onSelectWorkflow}
      />
    </div>
  );
}
