import { useState } from 'react';
import {
  User,
  Shirt,
  Palette,
  ArrowUpCircle,
  Image,
  Maximize2,
  Camera,
  Video,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FolderOpen,
  Settings,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  UserCircle,
  MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface WorkflowOption {
  id: string;
  name: string;
  icon: typeof User;
}

const workflows: WorkflowOption[] = [
  { id: 'model', name: 'Human Model', icon: User },
  { id: 'tryon', name: 'Virtual Try-On', icon: Shirt },
  { id: 'color_change', name: 'Color Change', icon: Palette },
  { id: 'upscale', name: 'Upscale', icon: ArrowUpCircle },
  { id: 'graphic_transfer', name: 'Graphic Transfer', icon: Image },
  { id: 'resize', name: 'Resize Photo', icon: Maximize2 },
  { id: 'background', name: 'Background', icon: Camera },
  { id: 'lifestyle', name: 'Lifestyle', icon: Camera },
  { id: 'video', name: 'Video Gen', icon: Video },
  { id: 'poster', name: 'Social Poster', icon: FileImage },
];

interface UnifiedSidebarProps {
  selectedWorkflow: string;
  onSelectWorkflow: (id: string, name: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function UnifiedSidebar({
  selectedWorkflow,
  onSelectWorkflow,
  activeView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
}: UnifiedSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [showPrimaryMenu, setShowPrimaryMenu] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const primaryTimeoutRef = useState<NodeJS.Timeout | null>(null)[0];
  const secondaryTimeoutRef = useState<NodeJS.Timeout | null>(null)[0];

  const handlePrimaryMouseEnter = () => {
    if (primaryTimeoutRef) clearTimeout(primaryTimeoutRef);
    setShowPrimaryMenu(true);
  };

  const handlePrimaryMouseLeave = () => {
    const timeout = setTimeout(() => setShowPrimaryMenu(false), 150);
    if (primaryTimeoutRef) clearTimeout(primaryTimeoutRef);
  };

  const handleSecondaryMouseEnter = () => {
    if (secondaryTimeoutRef) clearTimeout(secondaryTimeoutRef);
    setShowSecondaryMenu(true);
  };

  const handleSecondaryMouseLeave = () => {
    const timeout = setTimeout(() => setShowSecondaryMenu(false), 150);
    if (secondaryTimeoutRef) clearTimeout(secondaryTimeoutRef);
  };

  return (
    <div
      className={`bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 relative ${
        isCollapsed ? 'w-16' : 'w-52'
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!isCollapsed && <img src="/shootx logo.png" alt="ShootX" className="h-7" />}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Workflows
            </span>
          </div>
        )}
        {workflows.map((workflow) => {
          const Icon = workflow.icon;
          const isSelected = selectedWorkflow === workflow.id;

          return (
            <button
              key={workflow.id}
              onClick={() => onSelectWorkflow(workflow.id, workflow.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isSelected
                  ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
              title={isCollapsed ? workflow.name : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{workflow.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <div
          className="relative"
          onMouseEnter={handlePrimaryMouseEnter}
          onMouseLeave={handlePrimaryMouseLeave}
        >
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeView === 'studio' || activeView === 'projects'
                ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
            title={isCollapsed ? 'Primary Menu' : undefined}
          >
            <Sparkles size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Primary</span>}
          </button>

          {showPrimaryMenu && (
            <div
              className="absolute left-full ml-1 bottom-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2 min-w-48 z-50"
            >
              <button
                onClick={() => {
                  onViewChange('studio');
                  setShowPrimaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'studio'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <Sparkles size={18} />
                <span className="text-sm">Studio</span>
              </button>
              <button
                onClick={() => {
                  onViewChange('projects');
                  setShowPrimaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'projects'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <FolderOpen size={18} />
                <span className="text-sm">Projects</span>
              </button>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={handleSecondaryMouseEnter}
          onMouseLeave={handleSecondaryMouseLeave}
        >
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeView === 'profile' ||
              activeView === 'billing' ||
              activeView === 'support' ||
              activeView === 'settings'
                ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
            title={isCollapsed ? 'More Options' : undefined}
          >
            <MoreHorizontal size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">More</span>}
          </button>

          {showSecondaryMenu && (
            <div
              className="absolute left-full ml-1 bottom-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2 min-w-48 z-50"
            >
              <button
                onClick={() => {
                  onViewChange('profile');
                  setShowSecondaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'profile'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <UserCircle size={18} />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => {
                  onViewChange('billing');
                  setShowSecondaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'billing'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <CreditCard size={18} />
                <span className="text-sm">Billing</span>
              </button>
              <button
                onClick={() => {
                  onViewChange('support');
                  setShowSecondaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'support'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <HelpCircle size={18} />
                <span className="text-sm">Support</span>
              </button>
              <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
              <button
                onClick={() => {
                  onViewChange('settings');
                  setShowSecondaryMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  activeView === 'settings'
                    ? 'bg-gray-100 dark:bg-gray-900 text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowSecondaryMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </button>
              <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
              <button
                onClick={() => {
                  signOut();
                  setShowSecondaryMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-brand"
              >
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
