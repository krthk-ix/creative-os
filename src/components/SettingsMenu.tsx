import { X, Moon, Sun, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => {
              toggleTheme();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-700 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="text-sm font-medium">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-700 dark:text-gray-300"
          >
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Help & Support</span>
          </button>

          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <img src="/shootx logo.png" alt="ShootX" className="h-6 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Version 2.0
          </p>
        </div>
      </div>
    </>
  );
}
