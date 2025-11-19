import StudioWrapper from './StudioWrapper';

interface StudioProps {
  selectedWorkflow: string;
  workflowName: string;
  onSelectWorkflow: (id: string, name: string) => void;
}

export default function Studio({ selectedWorkflow, workflowName, onSelectWorkflow }: StudioProps) {
  return (
    <StudioWrapper
      selectedWorkflow={selectedWorkflow}
      workflowName={workflowName}
      onSelectWorkflow={onSelectWorkflow}
    />
  );
}
