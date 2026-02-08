import React from 'react';
import { X } from 'lucide-react';

interface MathExplainerProps {
  onClose: () => void;
}

export const MathExplainer: React.FC<MathExplainerProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-zinc-900 rounded-3xl border border-zinc-800 p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>

        <h3 className="text-white font-black text-2xl mb-4">The Physics</h3>
        
        <div className="space-y-4 text-zinc-400 text-sm">
          <p>Simple calculators assume impact sound is instant. DeepDrop accounts for the <strong>speed of sound</strong> lag.</p>
          
          <div className="bg-black/40 p-4 rounded-2xl font-mono text-emerald-400 border border-emerald-500/10">
            T<sub>total</sub> = t<sub>fall</sub> + t<sub>sound</sub><br/>
            T = √[2h/g] + h/v<sub>s</sub>
          </div>

          <p>We solve for <strong>height (h)</strong> by treating √h as a variable (u) in a quadratic equation:</p>

          <div className="bg-black/40 p-4 rounded-2xl font-mono text-zinc-300 border border-zinc-800">
            (1/v<sub>s</sub>)u² + (√2/g)u - T = 0
          </div>

          <p>
            Air temperature affects <strong>v<sub>s</sub></strong>: <br/>
            <code className="text-emerald-400 font-bold">v<sub>s</sub> ≈ 331.3 + 0.606 * T°C</code>
          </p>
        </div>

        <button onClick={onClose} className="w-full mt-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl">
          Got it
        </button>
      </div>
    </div>
  );
};