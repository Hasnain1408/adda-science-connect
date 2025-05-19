
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedContent from '@/components/FeaturedContent';
import SimulationFeatures from '@/components/SimulationFeatures';
import Footer from '@/components/Footer';

const Index = () => {
  const { language } = useAppContext();

  // Update document title based on language
  useEffect(() => {
    document.title = language === 'en' 
      ? 'SciConnect - Interactive Science Learning' 
      : 'সাইকানেক্ট - ইন্টারেক্টিভ বিজ্ঞান শিক্ষা';
  }, [language]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedContent />
        <SimulationFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
