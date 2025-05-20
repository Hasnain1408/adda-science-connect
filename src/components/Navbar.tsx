
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlobeIcon, User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const { language, setLanguage, offline, user } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">SciConnect</span>
            {offline && (
              <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded">
                Offline
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-accent-foreground transition-colors">
              {language === 'en' ? 'Home' : 'হোম'}
            </Link>
            <Link to="/lessons" className="hover:text-accent-foreground transition-colors">
              {language === 'en' ? 'Lessons' : 'পাঠ'}
            </Link>
            <Link to="/simulations" className="hover:text-accent-foreground transition-colors">
              {language === 'en' ? 'Simulations' : 'সিমুলেশন'}
            </Link>
            <Link to="/quiz" className="hover:text-accent-foreground transition-colors">
              {language === 'en' ? 'Quizzes' : 'কুইজ'}
            </Link>
            
            <div className="flex items-center gap-2">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4" />
                  {language === 'en' ? 'Profile' : 'প্রোফাইল'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  {language === 'en' ? 'Login' : 'লগইন'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              >
                <GlobeIcon className="h-4 w-4" />
                {language === 'en' ? 'বাংলা' : 'English'}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden mt-3 space-y-2 pb-3"
          >
            <Link 
              to="/" 
              className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Home' : 'হোম'}
            </Link>
            <Link 
              to="/lessons" 
              className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Lessons' : 'পাঠ'}
            </Link>
            <Link 
              to="/simulations" 
              className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Simulations' : 'সিমুলেশন'}
            </Link>
            <Link 
              to="/quiz" 
              className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Quizzes' : 'কুইজ'}
            </Link>
            
            {user ? (
              <Link
                to="/profile"
                className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === 'en' ? 'Profile' : 'প্রোফাইল'}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block hover:bg-primary-foreground hover:text-primary px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === 'en' ? 'Login' : 'লগইন'}
              </Link>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 ml-3 mt-2"
              onClick={() => {
                setLanguage(language === 'en' ? 'bn' : 'en');
                setIsMenuOpen(false);
              }}
            >
              <GlobeIcon className="h-4 w-4" />
              {language === 'en' ? 'বাংলা' : 'English'}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
