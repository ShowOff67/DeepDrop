import React, { useState, useMemo } from 'react';
import { HeightCalculator } from './HeightCalculator';
import { DropButton } from './DropButton';
import { MathExplainer } from './MathExplainer';
import { DropGraph } from './DropGraph';
import { TimingMode, HeightResult } from './types';
import { Info, RotateCcw, Thermometer, History, ArrowDown, ChartLine } from 'lucide-react';

const App: React.FC = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [temp, setTemp] = useState(20);
  const [mode, setMode] = useState<TimingMode>(TimingMode.HOLD);
  const [isRunning, setIsRunning] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [history, setHistory] = useState<HeightResult[]>([]);

  const currentResult = useMemo(() => {
    const calc = new HeightCalculator(totalTime, temp);
    return calc.calculate();
  }, [totalTime, temp]);

  const handleStart = () => {
    setIsRunning(true);
    setTotalTime(0);
  };
  
  const handleStop = (duration: number) => {
    setIsRunning(false);
    setTotalTime(duration);
    
    const calc = new HeightCalculator(duration, temp);
    const result = calc.calculate();
    if (result.meters > 0.01) {
      setHistory(prev => [result, ...prev].slice(0, 5));
    }
  };

  const handleReset = () => {
    setTotalTime(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col p-6 space-y-8 pb-12">
      {showMath && <MathExplainer onClose={() => setShowMath(false)} />}

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-1">DeepDrop</h1>
          <p className="text-zinc-500 text-sm font-medium">Precision Physics Engine</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-emerald-400">
            <RotateCcw size={20} />
          </button>
          <button onClick={() => setShowMath(true)} className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white">
            <Info size={20} />
          </button>
        </div>
      </header>

      <section className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
          <ArrowDown size={120} />
        </div>
        
        <div className="space-y-1 relative z-10">
          <label className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Calculated Depth</label>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white tabular-nums">{currentResult.meters.toFixed(2)}</span>
            <span className="text-xl font-bold text-zinc-500">m</span>
          </div>
          <div className="text-emerald-400/80 font-medium text-lg">
            {currentResult.feet.toFixed(1)} <span className="text-xs uppercase">feet</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Error Margin</div>
            <div className="text-sm font-semibold text-zinc-300">± {currentResult.errorMargin.toFixed(2)}m</div>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Sound Lag</div>
            <div className="text-sm font-semibold text-zinc-300">{currentResult.soundTime.toFixed(3)}s</div>
          </div>
        </div>

        {totalTime > 0 && (
          <div className="mt-6 flex flex-col items-center gap-4">
             <button onClick={() => setShowGraph(!showGraph)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 hover:text-emerald-400">
               <ChartLine size={14} />
               {showGraph ? 'Hide Trajectory' : 'View Trajectory'}
             </button>
             {showGraph && <DropGraph result={currentResult} totalTime={totalTime} />}
          </div>
        )}
      </section>

      <section className="flex-1 flex flex-col items-center justify-center py-4">
        <DropButton mode={mode} onStart={handleStart} onStop={handleStop} isRunning={isRunning} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-zinc-400">
             <Thermometer size={16} />
             <span className="text-xs font-bold uppercase tracking-tight">Air Temperature</span>
           </div>
           <span className="text-emerald-400 font-black tabular-nums">{temp}°C</span>
        </div>
        <input 
          type="range" 
          min="-20" 
          max="50" 
          value={temp} 
          onChange={(e) => setTemp(parseInt(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        <div className="flex gap-2">
          <button 
            onClick={() => setMode(TimingMode.HOLD)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              mode === TimingMode.HOLD 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            Hold Mode
          </button>
          <button 
            onClick={() => setMode(TimingMode.TAP)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              mode === TimingMode.TAP 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            Tap Mode
          </button>
        </div>
      </section>

      {history.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              <History size={16} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Recent Drops</h4>
            </div>
            <button onClick={() => setHistory([])} className="text-[10px] text-zinc-600 hover:text-zinc-400 font-bold uppercase">
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl text-sm hover:border-zinc-700">
                <div className="flex flex-col">
                  <span className="text-zinc-300 font-bold">{h.meters.toFixed(2)}m</span>
                  <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-tighter">± {h.errorMargin.toFixed(2)}m margin</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 tabular-nums font-mono">{(h.fallTime + h.soundTime).toFixed(2)}s</span>
                  <div className="text-[10px] text-emerald-500/60 font-bold uppercase">Captured</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-8 text-center pb-8">
        <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em]">
          powered by showoff
        </p>
      </footer>
    </div>
  );
};

export default App;