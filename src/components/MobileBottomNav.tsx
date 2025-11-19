import { Sparkles, FolderOpen, UserCircle, CreditCard, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function MobileBottomNav({ activeView, onViewChange }: MobileBottomNavProps) {
  const navItems = [
    { id: 'studio', name: 'Studio', icon: Sparkles },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40 safe-area-bottom">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
