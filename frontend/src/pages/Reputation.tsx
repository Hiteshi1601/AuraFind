import React from 'react';
import { Award } from 'lucide-react';

function Reputation() {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Trust Network & Reputation</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">Gamified</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Earn reputation points by returning found items, securing matches, and reporting accurately.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">Your Trust Rating</p>
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500 flex flex-col items-center justify-center mt-4 bg-indigo-500/5 shadow-inner">
            <span className="text-3xl font-extrabold text-white">850</span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">Points</span>
          </div>
          <h4 className="text-base font-bold text-white mt-4">Gold Elite Rank</h4>
          <p className="text-xs text-slate-400 mt-1">Excellent contributor. Verified recovery success rate.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white">Trust Badges & Milestones</h3>
          
          <div className="space-y-3">
            {[
              { title: 'Good Samaritan', desc: 'Returned a found wallet containing documents.', status: 'Completed', score: 100 },
              { title: 'Verification Pioneer', desc: 'Verified ownership using a secure QR tag code.', status: 'Completed', score: 150 },
              { title: 'Local Hero', desc: 'Complete 10 successful recoveries.', status: 'Progress: 7/10', score: 500 },
            ].map((badge, idx) => (
              <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{badge.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-normal">{badge.status}</span>
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">{badge.desc}</p>
                </div>
                <span className="text-indigo-400 font-bold font-mono">+{badge.score} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reputation;
