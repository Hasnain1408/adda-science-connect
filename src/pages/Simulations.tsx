
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PendulumSimulation from '@/components/PendulumSimulation';

const Simulations = () => {
  const { language } = useAppContext();

  useEffect(() => {
    // Update document title based on language
    document.title = language === 'en' 
      ? 'Simulations - SciConnect' 
      : 'সিমুলেশন - সাইকানেক্ট';
  }, [language]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' ? 'Interactive Simulations' : 'ইন্টারেক্টিভ সিমুলেশন'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Explore scientific concepts through these interactive simulations. Adjust parameters and see how systems behave in real-time.'
              : 'এই ইন্টারেক্টিভ সিমুলেশনগুলির মাধ্যমে বৈজ্ঞানিক ধারণাগুলি অন্বেষণ করুন। পরামিতিগুলি সামঞ্জস্য করুন এবং দেখুন কীভাবে সিস্টেমগুলি রিয়েল-টাইমে আচরণ করে।'}
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <PendulumSimulation />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Simulations;
