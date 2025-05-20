
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function BiologySimulation() {
  const { language } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation parameters
  const [population, setPopulation] = useState<number[]>([10, 4]);  // [prey, predator]
  const [birthRate, setBirthRate] = useState(0.5);
  const [predationRate, setPredationRate] = useState(0.2);
  const [isRunning, setIsRunning] = useState(true);
  
  // Time series data for population graph
  const [populationHistory, setPopulationHistory] = useState<{prey: number[], predator: number[]}>({
    prey: [10],
    predator: [4]
  });
  
  // Update population based on Lotka-Volterra equations
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setPopulation(prev => {
        const [prey, predator] = prev;
        
        // Lotka-Volterra equations (simplified)
        const newPrey = prey + (birthRate * prey) - (predationRate * prey * predator);
        const newPredator = predator + (predationRate * prey * predator * 0.1) - (predator * 0.1);
        
        // Ensure populations don't go negative or too high
        const limitedPrey = Math.max(0, Math.min(100, newPrey));
        const limitedPredator = Math.max(0, Math.min(100, newPredator));
        
        // Update history for graphing
        setPopulationHistory(prevHistory => ({
          prey: [...prevHistory.prey.slice(-50), limitedPrey],
          predator: [...prevHistory.predator.slice(-50), limitedPredator]
        }));
        
        return [limitedPrey, limitedPredator];
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [birthRate, predationRate, isRunning]);
  
  // Draw population graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, canvas.height - 30);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(language === 'en' ? 'Time' : 'সময়', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(language === 'en' ? 'Population' : 'জনসংখ্যা', 0, 0);
    ctx.restore();
    
    // Draw prey population line
    const preyData = populationHistory.prey;
    const predatorData = populationHistory.predator;
    const dataPoints = preyData.length;
    
    if (dataPoints > 1) {
      const graphWidth = canvas.width - 60;
      const graphHeight = canvas.height - 50;
      const xStep = graphWidth / (dataPoints - 1);
      
      // Draw prey line (blue)
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < dataPoints; i++) {
        const x = 40 + (i * xStep);
        const y = canvas.height - 30 - ((preyData[i] / 100) * graphHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Draw predator line (red)
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < dataPoints; i++) {
        const x = 40 + (i * xStep);
        const y = canvas.height - 30 - ((predatorData[i] / 100) * graphHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Draw legend
      ctx.fillStyle = '#3498db';
      ctx.fillRect(canvas.width - 100, 20, 15, 15);
      
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(canvas.width - 100, 45, 15, 15);
      
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.fillText(language === 'en' ? 'Prey' : 'শিকার', canvas.width - 80, 32);
      ctx.fillText(language === 'en' ? 'Predator' : 'শিকারি', canvas.width - 80, 57);
    }
  }, [populationHistory, language]);
  
  // Reset simulation
  const resetSimulation = () => {
    setPopulation([10, 4]);
    setPopulationHistory({
      prey: [10],
      predator: [4]
    });
  };
  
  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Predator-Prey Ecosystem Simulation' : 'শিকারি-শিকার ইকোসিস্টেম সিমুলেশন'}
      </h2>
      
      <div className="bg-muted rounded-lg mb-6">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={300} 
          className="w-full h-full"
          aria-label={language === 'en' ? 'Biology simulation canvas' : 'জীববিজ্ঞান সিমুলেশন ক্যানভাস'}
        ></canvas>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'Current Population' : 'বর্তমান জনসংখ্যা'}
            </h3>
            <div className="bg-muted rounded p-4 flex justify-between">
              <div>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                {language === 'en' ? 'Prey:' : 'শিকার:'} {Math.round(population[0])}
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                {language === 'en' ? 'Predator:' : 'শিকারি:'} {Math.round(population[1])}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="birthRate" className="text-sm font-medium">
                {language === 'en' ? 'Prey Birth Rate' : 'শিকার জন্মহার'}: {birthRate.toFixed(2)}
              </label>
            </div>
            <Slider
              id="birthRate"
              min={0.1}
              max={1.0}
              step={0.01}
              value={[birthRate]}
              onValueChange={(values) => setBirthRate(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              {language === 'en' 
                ? 'How quickly the prey population reproduces'
                : 'শিকার জনসংখ্যা কতটা দ্রুত বংশবৃদ্ধি করে'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="predationRate" className="text-sm font-medium">
                {language === 'en' ? 'Predation Rate' : 'শিকার হার'}: {predationRate.toFixed(2)}
              </label>
            </div>
            <Slider
              id="predationRate"
              min={0.05}
              max={0.5}
              step={0.01}
              value={[predationRate]}
              onValueChange={(values) => setPredationRate(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              {language === 'en' 
                ? 'How effectively predators catch prey'
                : 'শিকারিরা কতটা কার্যকরভাবে শিকার ধরে'}
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'Ecosystem Dynamics' : 'ইকোসিস্টেম গতিশীলতা'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'This simulation demonstrates the classic Lotka-Volterra predator-prey model, showing how population levels oscillate in an ecosystem.'
                : 'এই সিমুলেশনটি ক্লাসিক লটকা-ভোলটেরা শিকারি-শিকার মডেল প্রদর্শন করে, দেখায় কীভাবে একটি ইকোসিস্টেমে জনসংখ্যার স্তর দোলায়িত হয়।'}
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>
                {language === 'en' 
                  ? 'When prey population increases, predators get more food'
                  : 'শিকার জনসংখ্যা বাড়লে, শিকারিরা আরও খাবার পায়'}
              </li>
              <li>
                {language === 'en' 
                  ? 'More predators leads to more hunting of prey'
                  : 'বেশি শিকারির কারণে শিকারের শিকার বেশি হয়'}
              </li>
              <li>
                {language === 'en' 
                  ? 'When prey becomes scarce, predator population declines'
                  : 'শিকার কম হয়ে গেলে, শিকারি জনসংখ্যা কমে যায়'}
              </li>
              <li>
                {language === 'en' 
                  ? 'With fewer predators, prey population can grow again'
                  : 'কম শিকারির সাথে, শিকার জনসংখ্যা আবার বাড়তে পারে'}
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 
                (language === 'en' ? 'Pause' : 'বিরতি') : 
                (language === 'en' ? 'Resume' : 'পুনরায় শুরু')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetSimulation}
            >
              {language === 'en' ? 'Reset' : 'রিসেট'}
            </Button>
          </div>
          
          <div className="mt-2">
            <Link to="/articles?type=biology" className="flex items-center text-primary hover:underline">
              {language === 'en' ? 'Explore Biology Articles' : 'জীববিজ্ঞান নিবন্ধ অন্বেষণ করুন'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
