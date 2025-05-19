
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function PendulumSimulation() {
  const { language } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [length, setLength] = useState(150);
  const [angle, setAngle] = useState(Math.PI / 4);
  const [gravity, setGravity] = useState(9.8);
  const [isRunning, setIsRunning] = useState(true);
  
  // Animation state
  const pendulumRef = useRef({
    angle,
    velocity: 0,
    acceleration: 0,
    timestamp: 0,
  });

  // Initialize p5-like sketch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    
    const drawPendulum = (time: number) => {
      if (!ctx || !canvas) return;
      
      // Update time
      const deltaTime = isRunning ? (time - lastTime) / 1000 : 0; // seconds
      lastTime = time;
      
      // Calculate physics
      const pendulum = pendulumRef.current;
      
      if (isRunning) {
        // F = mg*sin(angle)
        pendulum.acceleration = -gravity / length * Math.sin(pendulum.angle);
        pendulum.velocity += pendulum.acceleration * deltaTime;
        pendulum.angle += pendulum.velocity * deltaTime;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center point
      const originX = canvas.width / 2;
      const originY = 50;
      
      // Pendulum bob position
      const bobX = originX + length * Math.sin(pendulum.angle);
      const bobY = originY + length * Math.cos(pendulum.angle);
      
      // Draw pendulum rod
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw pivot point
      ctx.beginPath();
      ctx.arc(originX, originY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#555';
      ctx.fill();
      
      // Draw pendulum bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#3498db';
      ctx.fill();
      
      // Continue animation
      animationFrameId = requestAnimationFrame(drawPendulum);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(drawPendulum);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, length, gravity]);

  // Reset pendulum
  const resetPendulum = () => {
    pendulumRef.current = {
      angle,
      velocity: 0,
      acceleration: 0,
      timestamp: 0,
    };
  };

  // Update pendulum when controls change
  useEffect(() => {
    resetPendulum();
  }, [angle, length, gravity]);

  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Pendulum Simulation' : 'দোলক সিমুলেশন'}
      </h2>
      
      <div className="bg-muted rounded-lg mb-6">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="w-full h-full"
          aria-label={language === 'en' ? 'Pendulum simulation canvas' : 'দোলক সিমুলেশন ক্যানভাস'}
        ></canvas>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="length" className="text-sm font-medium">
              {language === 'en' ? 'Length' : 'দৈর্ঘ্য'}: {Math.round(length)}
            </label>
          </div>
          <Slider
            id="length"
            min={50}
            max={200}
            step={1}
            value={[length]}
            onValueChange={(values) => setLength(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="angle" className="text-sm font-medium">
              {language === 'en' ? 'Initial Angle' : 'প্রাথমিক কোণ'}: {Math.round(angle * 180 / Math.PI)}°
            </label>
          </div>
          <Slider
            id="angle"
            min={0}
            max={Math.PI / 2}
            step={0.01}
            value={[angle]}
            onValueChange={(values) => setAngle(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="gravity" className="text-sm font-medium">
              {language === 'en' ? 'Gravity' : 'মাধ্যাকর্ষণ'}: {gravity.toFixed(1)} m/s²
            </label>
          </div>
          <Slider
            id="gravity"
            min={1}
            max={20}
            step={0.1}
            value={[gravity]}
            onValueChange={(values) => setGravity(values[0])}
          />
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
            onClick={resetPendulum}
          >
            {language === 'en' ? 'Reset' : 'রিসেট'}
          </Button>
        </div>
      </div>
    </div>
  );
}
