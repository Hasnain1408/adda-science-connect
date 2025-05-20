
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ChemistrySimulation() {
  const { language } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation parameters
  const [temperature, setTemperature] = useState(25); // Celsius
  const [concentration, setConcentration] = useState(1.0); // mol/L
  const [isRunning, setIsRunning] = useState(true);
  
  // Simulation state
  const simulationRef = useRef({
    particles: [] as { x: number, y: number, vx: number, vy: number, radius: number, color: string }[],
    reactionRate: 0,
    productCount: 0,
    timestamp: 0,
  });

  // Initialize canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Initialize particles based on concentration
    const initializeParticles = () => {
      const particleCount = Math.floor(concentration * 50);
      const particles = [];
      
      // Reactant A (blue)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (temperature / 10),
          vy: (Math.random() - 0.5) * (temperature / 10),
          radius: 5,
          color: '#3498db'
        });
      }
      
      // Reactant B (red)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (temperature / 10),
          vy: (Math.random() - 0.5) * (temperature / 10),
          radius: 5,
          color: '#e74c3c'
        });
      }
      
      simulationRef.current.particles = particles;
      simulationRef.current.productCount = 0;
    };
    
    initializeParticles();
    
    // Animation loop
    const render = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particle positions and check collisions
      const particles = simulationRef.current.particles;
      let reactionRate = 0;
      
      if (isRunning) {
        // Calculate particle speed based on temperature (kinetic energy)
        const particleSpeed = 0.5 + temperature / 25;
        
        // Update positions
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // Apply velocity
          p.x += p.vx * particleSpeed;
          p.y += p.vy * particleSpeed;
          
          // Boundary collisions (bounce off walls)
          if (p.x - p.radius < 0 || p.x + p.radius > canvas.width) {
            p.vx = -p.vx;
            p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x));
          }
          
          if (p.y - p.radius < 0 || p.y + p.radius > canvas.height) {
            p.vy = -p.vy;
            p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y));
          }
          
          // Check for reactions (only between blue and red particles)
          if (p.color === '#3498db' || p.color === '#e74c3c') {
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              
              // Only react if one is blue and one is red
              if ((p.color === '#3498db' && p2.color === '#e74c3c') || 
                  (p.color === '#e74c3c' && p2.color === '#3498db')) {
                
                const dx = p2.x - p.x;
                const dy = p2.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If particles are close enough, they react
                if (distance < p.radius + p2.radius) {
                  // Create product particle (purple)
                  particles.push({
                    x: (p.x + p2.x) / 2,
                    y: (p.y + p2.y) / 2,
                    vx: (p.vx + p2.vx) / 2,
                    vy: (p.vy + p2.vy) / 2,
                    radius: 5,
                    color: '#9b59b6'
                  });
                  
                  // Remove reactants
                  particles.splice(j, 1);
                  particles.splice(i, 1);
                  
                  // Adjust counter
                  i--;
                  reactionRate++;
                  simulationRef.current.productCount++;
                  
                  break;
                }
              }
            }
          }
        }
      }
      
      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      
      // Update reaction rate
      simulationRef.current.reactionRate = reactionRate;
      
      // Draw legend
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(language === 'en' ? 'Reactant A' : 'বিক্রিয়ক A', 10, 20);
      ctx.fillText(language === 'en' ? 'Reactant B' : 'বিক্রিয়ক B', 10, 40);
      ctx.fillText(language === 'en' ? 'Product' : 'উৎপাদ', 10, 60);
      
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(100, 15, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(100, 35, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#9b59b6';
      ctx.beginPath();
      ctx.arc(100, 55, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Continue animation
      animationFrameId = requestAnimationFrame(render);
    };
    
    // Start render loop
    render();
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, temperature, concentration, language]);

  // Reset simulation
  const resetSimulation = () => {
    simulationRef.current = {
      particles: [],
      reactionRate: 0,
      productCount: 0,
      timestamp: 0,
    };
    
    setIsRunning(false);
    setTimeout(() => {
      setIsRunning(true);
    }, 100);
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Chemical Reaction Simulation' : 'রাসায়নিক বিক্রিয়া সিমুলেশন'}
      </h2>
      
      <div className="bg-muted rounded-lg mb-6">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="w-full h-full"
          aria-label={language === 'en' ? 'Chemistry simulation canvas' : 'রসায়ন সিমুলেশন ক্যানভাস'}
        ></canvas>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="temperature" className="text-sm font-medium">
              {language === 'en' ? 'Temperature' : 'তাপমাত্রা'}: {temperature}°C
            </label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={100}
            step={1}
            value={[temperature]}
            onValueChange={(values) => setTemperature(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? 'Higher temperatures increase reaction rate'
              : 'উচ্চ তাপমাত্রা বিক্রিয়ার হার বাড়ায়'}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="concentration" className="text-sm font-medium">
              {language === 'en' ? 'Concentration' : 'ঘনত্ব'}: {concentration.toFixed(1)} mol/L
            </label>
          </div>
          <Slider
            id="concentration"
            min={0.1}
            max={2.0}
            step={0.1}
            value={[concentration]}
            onValueChange={(values) => setConcentration(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? 'Higher concentration increases collision frequency'
              : 'উচ্চ ঘনত্ব সংঘর্ষের ফ্রিকোয়েন্সি বাড়ায়'}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">
            {language === 'en' ? 'Products formed' : 'উৎপাদিত পণ্য'}: {simulationRef.current.productCount}
          </p>
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
        
        <div className="mt-4">
          <Link to="/articles?type=chemistry" className="flex items-center text-primary hover:underline">
            {language === 'en' ? 'Explore Chemistry Articles' : 'রসায়ন নিবন্ধ অন্বেষণ করুন'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
