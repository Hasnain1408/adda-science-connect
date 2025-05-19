
import { useAppContext } from '@/context/AppContext';

export default function Footer() {
  const { language } = useAppContext();
  
  return (
    <footer className="bg-primary text-primary-foreground mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SciConnect</h3>
            <p className="text-sm opacity-80">
              {language === 'en' 
                ? 'Making science education accessible and engaging for students across Bangladesh.'
                : 'বাংলাদেশের সকল শিক্ষার্থীদের জন্য বিজ্ঞান শিক্ষাকে সহজলভ্য ও আকর্ষণীয় করে তোলা।'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Quick Links' : 'দ্রুত লিঙ্ক'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline">
                  {language === 'en' ? 'Home' : 'হোম'}
                </a>
              </li>
              <li>
                <a href="/lessons" className="hover:underline">
                  {language === 'en' ? 'Lessons' : 'পাঠ'}
                </a>
              </li>
              <li>
                <a href="/simulations" className="hover:underline">
                  {language === 'en' ? 'Simulations' : 'সিমুলেশন'}
                </a>
              </li>
              <li>
                <a href="/quiz" className="hover:underline">
                  {language === 'en' ? 'Quizzes' : 'কুইজ'}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </h3>
            <p className="text-sm opacity-80">
              {language === 'en' 
                ? 'BRAC-Biggan Adda Presents 1st-SN Bose National Science Festival 2025'
                : 'ব্র্যাক-বিজ্ঞান আড্ডা প্রেজেন্টস ১ম-এসএন বোস জাতীয় বিজ্ঞান উৎসব ২০২৫'}
            </p>
            <p className="text-sm opacity-80 mt-2">
              Email: sciconnect@example.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm opacity-70">
          <p>
            &copy; 2025 SciConnect. {language === 'en' ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}
          </p>
        </div>
      </div>
    </footer>
  );
}
