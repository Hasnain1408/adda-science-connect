
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AppContextType = {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  offline: boolean;
  lesson: any;
  fetchLesson: (language: 'en' | 'bn') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [lesson, setLesson] = useState<any>(null);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker for offline functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Fetch lesson data
  const fetchLesson = async (lang: 'en' | 'bn') => {
    try {
      const url = lang === 'en' 
        ? '/assets/english-lesson.json' 
        : '/assets/bangla-lesson.json';
      
      const response = await fetch(url);
      const data = await response.json();
      setLesson(data);
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  // Fetch initial lesson data
  useEffect(() => {
    fetchLesson(language);
  }, [language]);

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      offline,
      lesson,
      fetchLesson
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
