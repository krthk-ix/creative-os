import { useState } from 'react';
import { Menu } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');

  const handleWorkflowSelect = (id: string, name: string) => {
    setSelectedWorkflow(id);
    setWorkflowName(name);
    setCurrentView('studio');
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'studio':
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} sidebarCollapsed={sidebarCollapsed} onSelectWorkflow={handleWorkflowSelect} />;
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
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} sidebarCollapsed={sidebarCollapsed} onSelectWorkflow={handleWorkflowSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      <UnifiedSidebar
        selectedWorkflow={selectedWorkflow}
        onSelectWorkflow={handleWorkflowSelect}
        activeView={currentView}
        onViewChange={(view) => {
          setCurrentView(view as View);
          setIsMobileMenuOpen(false);
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <main className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
          <img src="/shootx logo.png" alt="ShootX" className="h-6" />
          <div className="w-10" />
        </div>
        {renderView()}
      </main>
    </div>
  );
}
