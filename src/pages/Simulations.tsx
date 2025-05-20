
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendulumSimulation from '@/components/PendulumSimulation';
import ChemistrySimulation from '@/components/ChemistrySimulation';
import BiologySimulation from '@/components/BiologySimulation';
import MathSimulation from '@/components/MathSimulation';

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
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="physics" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="physics">
                {language === 'en' ? 'Physics' : 'পদার্থবিদ্যা'}
              </TabsTrigger>
              <TabsTrigger value="chemistry">
                {language === 'en' ? 'Chemistry' : 'রসায়ন'}
              </TabsTrigger>
              <TabsTrigger value="biology">
                {language === 'en' ? 'Biology' : 'জীববিদ্যা'}
              </TabsTrigger>
              <TabsTrigger value="math">
                {language === 'en' ? 'Mathematics' : 'গণিত'}
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="physics">
                <PendulumSimulation />
              </TabsContent>
              
              <TabsContent value="chemistry">
                <ChemistrySimulation />
              </TabsContent>
              
              <TabsContent value="biology">
                <BiologySimulation />
              </TabsContent>
              
              <TabsContent value="math">
                <MathSimulation />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Simulations;
