import { useState } from 'react';
import { Menu } from 'lucide-react';
import UnifiedSidebar from './UnifiedSidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileWorkflowSelector from './MobileWorkflowSelector';
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
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-700 dark:text-gray-300 flex-shrink-0"
            >
              <Menu size={20} />
            </button>

            {currentView === 'studio' && (
              <MobileWorkflowSelector
                selectedWorkflow={selectedWorkflow}
                onSelectWorkflow={handleWorkflowSelect}
              />
            )}

            {currentView !== 'studio' && (
              <img src="/shootx logo.png" alt="ShootX" className="h-6" />
            )}

            <div className="w-10 flex-shrink-0" />
          </div>
        </div>

        {/* Main Content with bottom padding for mobile nav */}
        <div className="flex-1 overflow-hidden pb-0 lg:pb-0">
          {renderView()}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeView={currentView}
          onViewChange={(view) => setCurrentView(view as View)}
        />
      </main>
    </div>
  );
}
