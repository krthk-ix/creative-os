import {
  Sparkles,
  FolderOpen,
  User,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface MainSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const primaryMenuItems = [
  { id: 'studio', name: 'Studio', icon: Sparkles },
  { id: 'projects', name: 'Projects', icon: FolderOpen },
];

const secondaryMenuItems = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'support', name: 'Support', icon: HelpCircle },
];

export default function MainSidebar({ activeView, onViewChange, isCollapsed, onToggleCollapse }: MainSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <div
      className={`bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {isCollapsed ? (
          <img src="/Fav-shootx copy.jpg" alt="ShootX" className="h-8 w-8" />
        ) : (
          <img src="/shootx logo.png" alt="ShootX" className="h-7" />
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col p-2">
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Primary
              </span>
            </div>
          )}
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex flex-col items-center ${isCollapsed ? 'gap-1 py-2' : 'flex-row gap-3 px-3 py-2.5'} rounded-lg transition-all ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-900/30 text-brand dark:text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isCollapsed ? (
                  <span className="text-[10px] font-medium">{item.name}</span>
                ) : (
                  <span className="text-sm">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Secondary
              </span>
            </div>
          )}
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex flex-col items-center ${isCollapsed ? 'gap-1 py-2' : 'flex-row gap-3 px-3 py-2.5'} rounded-lg transition-all ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-900/30 text-brand dark:text-brand font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isCollapsed ? (
                  <span className="text-[10px] font-medium">{item.name}</span>
                ) : (
                  <span className="text-sm">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-2 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex flex-col items-center ${isCollapsed ? 'gap-1 py-2' : 'flex-row gap-3 px-3 py-2.5'} rounded-lg transition-all ${
            activeView === 'settings'
              ? 'bg-gray-100 dark:bg-gray-900/30 text-brand dark:text-brand font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings size={20} className="flex-shrink-0" />
          {isCollapsed ? (
            <span className="text-[10px] font-medium">Settings</span>
          ) : (
            <span className="text-sm">Settings</span>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className={`w-full flex flex-col items-center ${isCollapsed ? 'gap-1 py-2' : 'flex-row gap-3 px-3 py-2.5'} rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`}
          title={isCollapsed ? `${theme === 'light' ? 'Dark' : 'Light'} Mode` : undefined}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {isCollapsed ? (
            <span className="text-[10px] font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
          ) : (
            <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          )}
        </button>

        <button
          onClick={signOut}
          className={`w-full flex flex-col items-center ${isCollapsed ? 'gap-1 py-2' : 'flex-row gap-3 px-3 py-2.5'} rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/30 hover:text-brand dark:hover:text-brand`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isCollapsed ? (
            <span className="text-[10px] font-medium">Sign Out</span>
          ) : (
            <span className="text-sm">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
}
