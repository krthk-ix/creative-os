import { useState } from 'react';
import { Menu } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import MobileWorkflowSelector from './MobileWorkflowSelector';
import SettingsMenu from './SettingsMenu';
import Studio from './Studio';
import Projects from './Projects';
import Profile from './Profile';
import Billing from './Billing';
import Support from './Support';
import Settings from './Settings';
import History from './History';
import BulkOperations from './BulkOperations';
import Walkthrough from './Walkthrough';

type View = 'studio' | 'projects' | 'profile' | 'billing' | 'support' | 'settings' | 'history' | 'bulk';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('studio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const handleWorkflowSelect = (id: string, name: string) => {
    setSelectedWorkflow(id);
    setWorkflowName(name);
    setCurrentView('studio');
  };

  const renderView = () => {
    switch (currentView) {
      case 'studio':
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} onSelectWorkflow={handleWorkflowSelect} />;
      case 'projects':
        return <Projects />;
      case 'history':
        return <History />;
      case 'bulk':
        return <BulkOperations />;
      case 'profile':
        return <Profile />;
      case 'billing':
        return <Billing />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return <Studio selectedWorkflow={selectedWorkflow} workflowName={workflowName} onSelectWorkflow={handleWorkflowSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header - Always Visible */}
      <header className="sticky top-0 z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between gap-3 max-w-7xl w-full mx-auto">
          <button
            onClick={() => setIsMenuOpen(true)}
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
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={currentView}
        onViewChange={(view) => setCurrentView(view as View)}
      />

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={currentView}
        onViewChange={(view) => {
          setCurrentView(view as View);
          setIsMenuOpen(false);
        }}
      />

      {/* Walkthrough for First-Time Users */}
      {showWalkthrough && (
        <Walkthrough onComplete={() => setShowWalkthrough(false)} />
      )}
    </div>
  );
}
