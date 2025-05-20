
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppContextType = {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  offline: boolean;
  lesson: any;
  fetchLesson: (language: 'en' | 'bn') => void;
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [lesson, setLesson] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Initialize authentication state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Fetch user profile if logged in
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    await fetchUserProfile(user.id);
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      offline,
      lesson,
      fetchLesson,
      user,
      session,
      profile,
      isLoading,
      refreshProfile
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
