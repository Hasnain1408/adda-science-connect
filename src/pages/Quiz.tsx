
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizComponent from '@/components/QuizComponent';

const Quiz = () => {
  const { language, lesson, fetchLesson } = useAppContext();
  
  useEffect(() => {
    fetchLesson(language);
    
    // Update document title based on language
    document.title = language === 'en' 
      ? 'Quiz - SciConnect' 
      : 'কুইজ - সাইকানেক্ট';
  }, [language, fetchLesson]);
  
  if (!lesson) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">{language === 'en' ? 'Loading quiz...' : 'কুইজ লোড হচ্ছে...'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' ? 'Science Quiz' : 'বিজ্ঞান কুইজ'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Test your knowledge of scientific concepts with these interactive quizzes.'
              : 'এই ইন্টারেক্টিভ কুইজগুলির সাহায্যে বৈজ্ঞানিক ধারণাগুলির আপনার জ্ঞান পরীক্ষা করুন।'}
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <QuizComponent 
              quizTitle={language === 'en' ? `${lesson.title} Quiz` : `${lesson.title} কুইজ`}
              questions={lesson.quizQuestions} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
