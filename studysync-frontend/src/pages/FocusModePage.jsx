import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const FocusModePage = () => {
  const [time, setTime] = useState(25 * 60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer = null;
    if (active && time > 0) timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [active, time]);

  const format = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="h-full flex items-center justify-center p-10 bg-[#0A0A0A]">
      <div className="text-center">
        <div className="bg-[#111111] border border-white/5 rounded-[80px] p-24 shadow-2xl relative">
          <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full"></div>
          <h2 className="text-[120px] font-black text-white tracking-tighter tabular-nums relative z-10 leading-none">
            {format(time)}
          </h2>
          <p className="text-gray-600 font-black uppercase tracking-[0.5em] mt-4 relative z-10">Deep Work</p>
        </div>
        <div className="flex justify-center gap-6 mt-12">
          <button onClick={() => setActive(!active)} className="w-24 h-24 bg-white text-black rounded-[32px] flex items-center justify-center hover:scale-105 transition-all">
            {active ? <Pause size={40} fill="black" /> : <Play size={40} className="ml-2" fill="black" />}
          </button>
          <button onClick={() => {setActive(false); setTime(25*60)}} className="w-24 h-24 bg-[#111111] border border-white/10 text-white rounded-[32px] flex items-center justify-center hover:bg-white/5 transition-all">
            <RotateCcw size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;