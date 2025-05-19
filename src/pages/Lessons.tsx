
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QuizComponent from '@/components/QuizComponent';

const Lessons = () => {
  const { language, lesson, fetchLesson } = useAppContext();

  useEffect(() => {
    fetchLesson(language);
    
    // Update document title based on language
    document.title = language === 'en' 
      ? 'Lessons - SciConnect' 
      : 'পাঠ - সাইকানেক্ট';
  }, [language, fetchLesson]);

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'bn-BD';
      speechSynthesis.speak(utterance);
    }
  };

  if (!lesson) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">{language === 'en' ? 'Loading lesson...' : 'পাঠ লোড হচ্ছে...'}</p>
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
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {lesson.title}
              <button 
                onClick={() => speakText(lesson.title)}
                aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
                className="ml-2 inline-flex items-center justify-center rounded-full w-8 h-8 bg-primary/10 hover:bg-primary/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </button>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {lesson.introduction}
              <button 
                onClick={() => speakText(lesson.introduction)}
                aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
                className="ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 bg-primary/10 hover:bg-primary/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                </svg>
              </button>
            </p>
          </header>
          
          <section className="space-y-8 mb-12">
            {lesson.sections.map((section: any, index: number) => (
              <Card key={index} className="border border-border">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {section.title}
                    <button 
                      onClick={() => speakText(section.title)}
                      aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
                      className="ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 bg-primary/10 hover:bg-primary/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      </svg>
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    {section.content}
                    <button 
                      onClick={() => speakText(section.content)}
                      aria-label={language === 'en' ? 'Read aloud' : 'জোরে পড়ুন'}
                      className="ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 bg-primary/10 hover:bg-primary/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      </svg>
                    </button>
                  </p>
                  <div className="bg-muted p-4 rounded-md">
                    <strong>{language === 'en' ? 'Example:' : 'উদাহরণ:'}</strong> {section.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
          
          <section className="my-10">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'Test Your Knowledge' : 'আপনার জ্ঞান পরীক্ষা করুন'}
            </h2>
            <QuizComponent 
              quizTitle={language === 'en' ? `${lesson.title} Quiz` : `${lesson.title} কুইজ`}
              questions={lesson.quizQuestions} 
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Lessons;
