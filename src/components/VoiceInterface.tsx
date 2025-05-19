
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const { toast } = useToast();
  const { language } = useAppContext();

  // Check for browser support
  useEffect(() => {
    // Check for speech synthesis support
    setSpeechSupported('speechSynthesis' in window);
    
    // Check for speech recognition support
    setRecognitionSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!recognitionSupported) return;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'en' ? 'en-US' : 'bn-BD';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', transcript);
      handleVoiceCommand(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: language === 'en' ? 'Voice recognition error' : 'ভয়েস রিকগনিশন ত্রুটি',
        description: language === 'en' ? 'Please try again' : 'অনুগ্রহ করে আবার চেষ্টা করুন',
        variant: 'destructive',
      });
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Recognition start error:', error);
      }
    }
    
    return () => {
      try {
        recognition.abort();
      } catch (error) {
        // Ignore abort errors when not active
      }
    };
  }, [isListening, language, toast]);

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    const englishCommands = {
      'home': () => window.location.href = '/',
      'lessons': () => window.location.href = '/lessons',
      'simulations': () => window.location.href = '/simulations',
      'quiz': () => window.location.href = '/quiz',
      'read': () => readPageContent(),
      'stop': () => stopSpeaking(),
    };
    
    const banglaCommands = {
      'হোম': () => window.location.href = '/',
      'পাঠ': () => window.location.href = '/lessons',
      'সিমুলেশন': () => window.location.href = '/simulations',
      'কুইজ': () => window.location.href = '/quiz',
      'পড়ুন': () => readPageContent(),
      'থামুন': () => stopSpeaking(),
    };
    
    const commands = language === 'en' ? englishCommands : banglaCommands;
    
    // Check if the command includes any of the keywords
    for (const [keyword, action] of Object.entries(commands)) {
      if (command.includes(keyword.toLowerCase())) {
        action();
        toast({
          title: language === 'en' ? 'Voice command recognized' : 'ভয়েস কমান্ড স্বীকৃত হয়েছে',
          description: keyword,
        });
        return;
      }
    }
    
    toast({
      title: language === 'en' ? 'Unknown command' : 'অজানা কমান্ড',
      description: command,
      variant: 'destructive',
    });
  };

  // Read page content
  const readPageContent = () => {
    if (!speechSupported) return;
    
    stopSpeaking();
    
    // Select main content elements
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    const headings = mainContent.querySelectorAll('h1, h2, h3');
    const paragraphs = mainContent.querySelectorAll('p');
    
    const textToRead = Array.from(headings)
      .concat(Array.from(paragraphs))
      .map(el => el.textContent)
      .filter(Boolean)
      .join('. ');
    
    if (textToRead) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'en' ? 'en-US' : 'bn-BD';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
    }
  };

  // Toggle speaking for current page content
  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      readPageContent();
    }
  };

  if (!speechSupported && !recognitionSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      {recognitionSupported && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleListening}
          className={`rounded-full ${isListening ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}
          aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      )}
      
      {speechSupported && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSpeaking}
          className={`rounded-full ${isSpeaking ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}
          aria-label={isSpeaking ? 'Stop speaking' : 'Read page content'}
        >
          {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
