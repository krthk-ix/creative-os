import { X, Moon, Sun, HelpCircle, LogOut, Sparkles, FolderOpen, History as HistoryIcon, User, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function SettingsMenu({ isOpen, onClose, activeView, onViewChange }: SettingsMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();

  if (!isOpen) return null;

  const menuItems = [
    { id: 'studio', icon: Sparkles, label: 'Studio', description: 'Create AI visuals' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', description: 'Manage your work' },
    { id: 'history', icon: HistoryIcon, label: 'History', description: 'Past generations' },
    { id: 'profile', icon: User, label: 'Profile', description: 'Account settings' },
    { id: 'billing', icon: CreditCard, label: 'Billing', description: 'Plans & invoices' },
    { id: 'support', icon: HelpCircle, label: 'Support', description: 'Get help' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', description: 'App preferences' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Menu - LEFT SIDE */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/shootx logo.png" alt="ShootX" className="h-6" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <User size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className={`text-xs truncate ${
                      isActive
                        ? 'text-white/70 dark:text-black/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

          <div className="space-y-1">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-700 dark:text-gray-300 text-left"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch theme
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Version 2.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
