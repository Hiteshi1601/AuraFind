import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ItemReport } from '../types';

function Analytics() {
  const [items, setItems] = useState<ItemReport[]>([]);

  // Load items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aurafind_reports');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing saved reports:", err);
      }
    }
  }, []);

  // Compute metrics
  const totalReports = items.length;
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const resolvedCount = items.filter(i => i.status === 'resolved').length;
  const activeCount = items.filter(i => i.status === 'active').length;
  
  const recoveryRate = totalReports > 0 ? ((resolvedCount / totalReports) * 100).toFixed(1) : "0.0";

  // Category distributions
  const categories = ['Electronics', 'Documents', 'Bags', 'Keys'];
  const catDistribution = categories.map(cat => {
    const count = items.filter(i => i.category === cat).length;
    const pct = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
    return { cat, count, pct };
  });

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Your Platform Analytics</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">Admin Hub</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Advanced recovery rate and item category trends based on your reported items.</p>
      </div>

      {totalReports > 0 ? (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400">Your Reports</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{totalReports}</h3>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {lostCount} lost / {foundCount} found
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400">Recovery Rate</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{recoveryRate}%</h3>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                {resolvedCount} items resolved
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400">Active Searches</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{activeCount}</h3>
              <span className="text-[10px] text-indigo-400 font-bold mt-1 block">
                Scan engine checking matching snap logs
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400">Simulated SMS alerts</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{resolvedCount}</h3>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                Dispatched successfully
              </span>
            </div>
          </div>

          {/* Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category distribution */}
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4">Item Category Distribution</h3>
              <div className="flex flex-col gap-3">
                {catDistribution.map((stat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{stat.cat}</span>
                      <span className="text-slate-400">{stat.count} items ({stat.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${stat.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification checklist log */}
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">Item Verification Log</h3>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                    <div>
                      <h4 className="font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.locationName}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-3xl text-center text-slate-500 space-y-3">
          <BarChart2 size={48} className="mx-auto text-slate-600 animate-pulse" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">No Analytics Available</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">File lost/found reports in the Match Wizard first, and recovery rate distributions will visualize here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
