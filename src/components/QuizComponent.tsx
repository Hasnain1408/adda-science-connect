
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type QuizProps = {
  quizTitle?: string;
  questions: Question[];
};

export default function QuizComponent({ quizTitle, questions }: QuizProps) {
  const { language } = useAppContext();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Update progress when current question changes
    setProgress(((currentQuestion) / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({
        title: language === 'en' ? 'Correct!' : 'সঠিক!',
        description: language === 'en' ? 'You got the right answer.' : 'আপনি সঠিক উত্তর পেয়েছেন।',
        variant: 'default',
      });
    } else {
      toast({
        title: language === 'en' ? 'Incorrect' : 'ভুল',
        description: language === 'en' 
          ? `The correct answer was: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`
          : `সঠিক উত্তর ছিল: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`,
        variant: 'destructive',
      });
    }
    
    // Move to next question or complete quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    setProgress(0);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">
          {quizTitle || (language === 'en' ? 'Science Quiz' : 'বিজ্ঞান কুইজ')}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? `Question ${currentQuestion + 1} of ${questions.length}` 
            : `প্রশ্ন ${currentQuestion + 1} / ${questions.length}`}
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent>
        {!quizCompleted ? (
          <div className="space-y-6">
            <div className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </div>
            
            <RadioGroup value={selectedOption?.toString()} className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`} 
                    onClick={() => handleOptionSelect(index)}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="text-6xl font-bold">{score}/{questions.length}</div>
            <p className="text-lg">
              {language === 'en' ? 'Your score' : 'আপনার স্কোর'}
            </p>
            
            {score === questions.length ? (
              <p className="text-green-600 dark:text-green-400 font-semibold">
                {language === 'en' 
                  ? 'Perfect! You got all questions right!' 
                  : 'নিখুঁত! আপনি সব প্রশ্নের উত্তর সঠিকভাবে দিয়েছেন!'}
              </p>
            ) : score >= questions.length / 2 ? (
              <p className="text-blue-600 dark:text-blue-400">
                {language === 'en' 
                  ? 'Good job! You passed the quiz.' 
                  : 'ভালো কাজ! আপনি কুইজটি পাস করেছেন।'}
              </p>
            ) : (
              <p className="text-amber-600 dark:text-amber-400">
                {language === 'en' 
                  ? 'Keep practicing! You can try again.' 
                  : 'অনুশীলন চালিয়ে যান! আপনি আবার চেষ্টা করতে পারেন।'}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {!quizCompleted ? (
          <Button 
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            {currentQuestion < questions.length - 1 
              ? (language === 'en' ? 'Next Question' : 'পরবর্তী প্রশ্ন')
              : (language === 'en' ? 'Finish Quiz' : 'কুইজ শেষ করুন')}
          </Button>
        ) : (
          <Button onClick={restartQuiz}>
            {language === 'en' ? 'Restart Quiz' : 'কুইজ পুনরায় শুরু করুন'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
