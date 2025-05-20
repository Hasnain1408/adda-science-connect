
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function MathSimulation() {
  const { language } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [a, setA] = useState(1);
  const [b, setB] = useState(2); 
  const [c, setC] = useState(0);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [showTangent, setShowTangent] = useState(false);
  const [tangentPoint, setTangentPoint] = useState<number>(0);
  const [derivative, setDerivative] = useState<string>("");
  const [equation, setEquation] = useState<string>("y = x² + 0x + 0");
  
  // Generate function equation string
  useEffect(() => {
    let eq = `y = `;
    
    if (a !== 0) {
      if (a === 1) eq += `x²`;
      else if (a === -1) eq += `-x²`;
      else eq += `${a}x²`;
    }
    
    if (b !== 0) {
      if (b > 0) eq += a !== 0 ? ` + ${b}x` : `${b}x`;
      else eq += ` - ${Math.abs(b)}x`;
    }
    
    if (c !== 0) {
      if (c > 0) eq += ` + ${c}`;
      else eq += ` - ${Math.abs(c)}`;
    }
    
    if (a === 0 && b === 0 && c === 0) {
      eq += '0';
    }
    
    setEquation(eq);
    
    // Calculate derivative
    let der = '';
    if (a !== 0) {
      if (a === 1) der = '2x';
      else if (a === -1) der = '-2x';
      else der = `${2 * a}x`;
    }
    
    if (b !== 0) {
      if (der === '') {
        der = `${b}`;
      } else {
        if (b > 0) der += ` + ${b}`;
        else der += ` - ${Math.abs(b)}`;
      }
    }
    
    if (der === '') der = '0';
    
    setDerivative(`f'(x) = ${der}`);
    
  }, [a, b, c]);
  
  // Draw the function and its derivative
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = 0; x <= width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Scale factors
    const scaleX = 25;  // 25 pixels per unit
    const scaleY = 25;
    
    // Function: f(x) = ax² + bx + c
    const f = (x: number) => a * x * x + b * x + c;
    
    // Derivative: f'(x) = 2ax + b
    const df = (x: number) => 2 * a * x + b;
    
    // Convert from canvas coordinates to math coordinates
    const toMathX = (canvasX: number) => (canvasX - width / 2) / scaleX;
    const toMathY = (canvasY: number) => (height / 2 - canvasY) / scaleY;
    
    // Convert from math coordinates to canvas coordinates
    const toCanvasX = (mathX: number) => mathX * scaleX + width / 2;
    const toCanvasY = (mathY: number) => height / 2 - mathY * scaleY;
    
    // Draw the function
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const newPoints = [];
    const step = 0.1;
    
    for (let canvasX = 0; canvasX <= width; canvasX += step) {
      const mathX = toMathX(canvasX);
      const mathY = f(mathX);
      const canvasY = toCanvasY(mathY);
      
      newPoints.push({ x: mathX, y: mathY });
      
      if (canvasX === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    
    setPoints(newPoints);
    ctx.stroke();
    
    // Draw tangent line if enabled
    if (showTangent) {
      const mathX = tangentPoint;
      const mathY = f(mathX);
      const slope = df(mathX);
      
      // Tangent point
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(toCanvasX(mathX), toCanvasY(mathY), 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Tangent line
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Using point-slope form: y - y0 = m(x - x0)
      // Extend line across the canvas
      const x1 = toMathX(0);
      const y1 = mathY + slope * (x1 - mathX);
      
      const x2 = toMathX(width);
      const y2 = mathY + slope * (x2 - mathX);
      
      ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
      ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
      ctx.stroke();
      
      // Display the slope
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(`Slope at x=${mathX.toFixed(1)}: ${slope.toFixed(2)}`, 10, 20);
    }
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    // x-axis labels
    for (let x = -8; x <= 8; x += 2) {
      if (x === 0) continue;
      const xPos = toCanvasX(x);
      ctx.fillText(x.toString(), xPos - 5, height / 2 + 15);
    }
    
    // y-axis labels
    for (let y = -5; y <= 5; y += 2) {
      if (y === 0) continue;
      const yPos = toCanvasY(y);
      ctx.fillText(y.toString(), width / 2 + 5, yPos + 4);
    }
    
    // Origin label
    ctx.fillText("0", width / 2 + 5, height / 2 + 15);
    
  }, [a, b, c, showTangent, tangentPoint]);
  
  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Quadratic Function Exploration' : 'দ্বিঘাত ফাংশন অন্বেষণ'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-muted rounded-lg mb-4 p-2">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              className="w-full h-full"
              aria-label={language === 'en' ? 'Math function graph' : 'গণিত ফাংশন গ্রাফ'}
            ></canvas>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">{equation}</p>
            {showTangent && <p className="text-sm">{derivative}</p>}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'Function Parameters' : 'ফাংশন প্যারামিটার'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Adjust the coefficients to see how they affect the quadratic function f(x) = ax² + bx + c'
                : 'দ্বিঘাত ফাংশন f(x) = ax² + bx + c এর সহগগুলি সামঞ্জস্য করে দেখুন কীভাবে তারা ফাংশনকে প্রভাবিত করে'}
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="paramA" className="text-sm font-medium">
                    a = {a}
                  </label>
                </div>
                <Slider
                  id="paramA"
                  min={-3}
                  max={3}
                  step={1}
                  value={[a]}
                  onValueChange={(values) => setA(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'en' 
                    ? 'Controls the width and direction of the parabola'
                    : 'প্যারাবোলার প্রশস্ততা এবং দিক নিয়ন্ত্রণ করে'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="paramB" className="text-sm font-medium">
                    b = {b}
                  </label>
                </div>
                <Slider
                  id="paramB"
                  min={-5}
                  max={5}
                  step={1}
                  value={[b]}
                  onValueChange={(values) => setB(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'en' 
                    ? 'Shifts the parabola horizontally'
                    : 'প্যারাবোলাকে অনুভূমিকভাবে সরিয়ে দেয়'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="paramC" className="text-sm font-medium">
                    c = {c}
                  </label>
                </div>
                <Slider
                  id="paramC"
                  min={-5}
                  max={5}
                  step={1}
                  value={[c]}
                  onValueChange={(values) => setC(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'en' 
                    ? 'Shifts the parabola vertically'
                    : 'প্যারাবোলাকে উল্লম্বভাবে সরিয়ে দেয়'}
                </p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="showTangent" 
                      checked={showTangent} 
                      onChange={() => setShowTangent(!showTangent)} 
                      className="rounded"
                    />
                    <label htmlFor="showTangent" className="ml-2 text-sm">
                      {language === 'en' ? 'Show tangent line' : 'স্পর্শক রেখা দেখান'}
                    </label>
                  </div>
                </div>
                
                {showTangent && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="tangentPoint" className="text-sm font-medium">
                        {language === 'en' ? 'Tangent point x =' : 'স্পর্শ বিন্দু x ='} {tangentPoint.toFixed(1)}
                      </label>
                    </div>
                    <Slider
                      id="tangentPoint"
                      min={-8}
                      max={8}
                      step={0.1}
                      value={[tangentPoint]}
                      onValueChange={(values) => setTangentPoint(values[0])}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <Link to="/articles?type=mathematics" className="flex items-center text-primary hover:underline">
              {language === 'en' ? 'Explore Mathematics Articles' : 'গণিত নিবন্ধ অন্বেষণ করুন'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
