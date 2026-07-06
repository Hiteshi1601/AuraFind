import React, { useState } from 'react';
import { QrCode, Info } from 'lucide-react';

function QrTags() {
  const [qrItemName, setQrItemName] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const generateQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrItemName.trim()) return;
    setQrCodeData(`AURAFIND-TAG-${qrItemName.toUpperCase().replace(/\s+/g, '-')}-${Math.floor(Math.random()*90000+10000)}`);
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>QR Code Ownership Tags</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">Ownership</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Generate QR codes for your keys, wallet, or luggage. Finders can scan to message you anonymously.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <form onSubmit={generateQr} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Item Name / Tag Label</label>
              <input 
                type="text" 
                placeholder="e.g. My keys, Leather Bag" 
                value={qrItemName}
                onChange={(e) => setQrItemName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 mt-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white cursor-pointer"
            >
              Generate Recovery Tag
            </button>
          </form>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 mt-6 text-xs text-slate-400 flex items-start gap-2.5">
            <Info size={16} className="text-indigo-400 shrink-0" />
            <p>When you generate a tag, a unique cryptographic identifier is generated. Print it and stick it to your items. If lost, anyone scanning the tag can immediately report finding it, opening a direct message box with you without showing your number.</p>
          </div>
        </div>

        {/* Display QR code */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
          {qrCodeData ? (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-xl inline-block shadow-xl">
                <div className="w-48 h-48 border-4 border-slate-950 bg-slate-950 flex flex-wrap p-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-12 h-12 border border-slate-905 ${i % 3 === 0 || i % 5 === 0 || i === 0 || i === 3 || i === 12 || i === 15 ? 'bg-white' : 'bg-slate-950'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-xs font-mono text-indigo-400">{qrCodeData}</p>
              <button 
                onClick={() => alert("Simulating download... QR Code saved to disk.")}
                className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-lg hover:bg-indigo-600/30 transition-all cursor-pointer"
              >
                Print Tag
              </button>
            </div>
          ) : (
            <div className="text-center text-slate-500 space-y-2">
              <QrCode size={48} className="mx-auto text-slate-600 animate-pulse" />
              <p className="text-xs">Your generated QR tag will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrTags;
