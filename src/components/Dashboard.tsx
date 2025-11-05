import { useState } from 'react';
import UnifiedSidebar from './UnifiedSidebar';
import Studio from './Studio';
import Projects from './Projects';
import Profile from './Profile';
import Billing from './Billing';
import Support from './Support';
import Settings from './Settings';

type View = 'studio' | 'projects' | 'profile' | 'billing' | 'support' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('studio');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');

  const handleWorkflowSelect = (id: string, name: string) => {
    setSelectedWorkflow(id);
    setWorkflowName(name);
    setCurrentView('studio');
  };

  const renderView = () => {
    switch (currentView) {
      case 'studio':
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} sidebarCollapsed={sidebarCollapsed} />;
      case 'projects':
        return <Projects />;
      case 'profile':
        return <Profile />;
      case 'billing':
        return <Billing />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} sidebarCollapsed={sidebarCollapsed} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      <UnifiedSidebar
        selectedWorkflow={selectedWorkflow}
        onSelectWorkflow={handleWorkflowSelect}
        activeView={currentView}
        onViewChange={setCurrentView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}
