
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';

export default function SimulationFeatures() {
  const { language } = useAppContext();
  
  const features = [
    {
      id: 'interactive',
      title: language === 'en' ? 'Interactive Learning' : 'ইন্টারেক্টিভ শিক্ষা',
      description: language === 'en'
        ? 'Engage with scientific concepts through hands-on simulations that make learning fun and intuitive.'
        : 'হাতে-কলমে সিমুলেশনের মাধ্যমে বৈজ্ঞানিক ধারণাগুলির সাথে জড়িত হন যা শিক্ষাকে মজাদার এবং স্বজ্ঞাত করে তোলে।'
    },
    {
      id: 'multilingual',
      title: language === 'en' ? 'Multilingual Content' : 'বহুভাষিক কন্টেন্ট',
      description: language === 'en'
        ? 'Access all content in both English and Bangla, with audio narration for improved accessibility.'
        : 'উন্নত অ্যাক্সেসযোগ্যতার জন্য অডিও বর্ণনা সহ ইংরেজি এবং বাংলা উভয় ভাষায় সমস্ত কন্টেন্ট অ্যাক্সেস করুন।'
    },
    {
      id: 'offline',
      title: language === 'en' ? 'Offline Access' : 'অফলাইন অ্যাক্সেস',
      description: language === 'en'
        ? 'Learn anytime, anywhere with offline access to lessons and simulations, even with limited internet connectivity.'
        : 'সীমিত ইন্টারনেট সংযোগ থাকলেও, পাঠ এবং সিমুলেশনে অফলাইন অ্যাক্সেস সহ যে কোনও সময়, যে কোনও জায়গায় শিখুন।'
    },
    {
      id: 'accessible',
      title: language === 'en' ? 'Fully Accessible' : 'সম্পূর্ণ অ্যাক্সেসযোগ্য',
      description: language === 'en'
        ? 'Designed for all users, including those with disabilities, with screen reader support and keyboard navigation.'
        : 'স্ক্রিন রিডার সমর্থন এবং কীবোর্ড নেভিগেশন সহ, প্রতিবন্ধী ব্যক্তিদের সহ সমস্ত ব্যবহারকারীদের জন্য ডিজাইন করা হয়েছে।'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {language === 'en' ? 'Why SciConnect?' : 'কেন SciConnect?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/lessons" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-md inline-block"
          >
            {language === 'en' ? 'Start Exploring' : 'অন্বেষণ শুরু করুন'}
          </Link>
        </div>
      </div>
    </section>
  );
}
