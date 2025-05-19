
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { language } = useAppContext();

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const heroTitle = language === 'en' 
    ? 'Interactive Science Learning for Everyone' 
    : 'সবার জন্য ইন্টারেক্টিভ বিজ্ঞান শিক্ষা';
  
  const heroSubtitle = language === 'en'
    ? 'Explore physics, chemistry, and biology through interactive simulations and quizzes - available offline and in your language.'
    : 'ইন্টারেক্টিভ সিমুলেশন এবং কুইজের মাধ্যমে পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞান অন্বেষণ করুন - অফলাইনে এবং আপনার ভাষায় উপলব্ধ।';

  return (
    <div className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {heroTitle}
          <button 
            onClick={() => speakText(heroTitle)}
            aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
            className="ml-2 inline-flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 hover:bg-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </button>
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-muted-foreground">
          {heroSubtitle}
          <button 
            onClick={() => speakText(heroSubtitle)}
            aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
            className="ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 bg-primary/10 hover:bg-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/lessons">
            <Button size="lg" className="w-full sm:w-auto">
              {language === 'en' ? 'Start Learning' : 'শিখা শুরু করুন'}
            </Button>
          </Link>
          <Link to="/simulations">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              {language === 'en' ? 'Try Simulations' : 'সিমুলেশন চেষ্টা করুন'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
