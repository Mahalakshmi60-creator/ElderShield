import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('eldershield_fontsize') as FontSize) || 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('eldershield_highcontrast') === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.body.classList.remove('font-scale-large', 'font-scale-xlarge');
    if (fontSize === 'large') {
      document.body.classList.add('font-scale-large');
    } else if (fontSize === 'xlarge') {
      document.body.classList.add('font-scale-xlarge');
    }
    localStorage.setItem('eldershield_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('eldershield_highcontrast', String(highContrast));
  }, [highContrast]);

  const setFontSize = (size: FontSize) => setFontSizeState(size);
  const setHighContrast = (enabled: boolean) => setHighContrastState(enabled);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-xl border text-sm font-medium transition-all transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : t.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : t.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <div className="flex-1">
              {t.title && <div className="font-bold text-base mb-0.5">{t.title}</div>}
              <div>{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-slate-500 hover:text-slate-800 text-lg leading-none"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
