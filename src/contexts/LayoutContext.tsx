import { createContext, useContext, useState, useEffect } from 'react';

type LayoutMode = 'floating' | 'split';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    const saved = localStorage.getItem('layoutMode');
    return (saved as LayoutMode) || 'floating';
  });

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem('layoutMode', mode);
  };

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
