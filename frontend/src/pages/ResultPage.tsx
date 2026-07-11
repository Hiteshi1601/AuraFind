import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, ShieldAlert, Award, MessageSquare } from 'lucide-react';

function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state && state.formData) {
      const { itemName, matched, userPreview, formData } = state;
      const saved = localStorage.getItem('aurafind_reports');
      let reports = [];
      if (saved) {
        try {
          reports = JSON.parse(saved);
        } catch (e) {}
      }

      // Check if duplicate entry
      const exists = reports.some((r: any) => r.title === itemName && r.phone === formData.phone);
      if (!exists) {
        const newReport = {
          id: Date.now().toString(),
          type: 'lost',
          title: itemName,
          description: formData.description,
          category: 'Electronics',
          locationName: formData.location || 'Delhi Terminal 3',
          latitude: formData.latitude || 28.5562,
          longitude: formData.longitude || 77.0810,
          imageUrl: userPreview,
          date: new Date().toLocaleDateString(),
          phone: formData.phone,
          status: matched ? 'resolved' : 'active'
        };
        reports.unshift(newReport);
        localStorage.setItem('aurafind_reports', JSON.stringify(reports));
      }
    }
  }, [state]);

  if (!state) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl mt-12">
        <h3 className="text-lg font-bold text-slate-500">No Result Available</h3>
        <p className="text-xs text-slate-400 mt-2">No active comparison result is loaded. Try reporting a lost item first.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white cursor-pointer"
        >
          Go to Step 1
        </button>
      </div>
    );
  }

  const { similarity, matched, userPreview, cctvPreview, itemName, aiEngine, boxes } = state;

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl mt-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>Step 3: Comparison Result</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full font-bold">Analysis</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">AI match verification results based on structural perceptual hashing (pHash) analysis.</p>
      </div>

      {/* Matching result badge */}
      <div className="mb-6 flex justify-center">
        {matched ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3 animate-bounce">
            <Check size={20} className="text-emerald-500 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">Item Match Confirmed ✔</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">An SMS alert notification has been successfully dispatched to your registered phone number!</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl flex items-center gap-3">
            <X size={20} className="text-red-500 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">No Match Identified ✘</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">The structural similarity did not cross the 75% matching threshold.</p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-850">
        <div className="text-center space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Reported Image</h3>
          <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <img src={userPreview} alt="User lost report" className="w-full h-full object-cover" />
          </div>
          <span className="inline-block text-xs font-semibold text-slate-300">{itemName}</span>
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CCTV Snapshot Image</h3>
          <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative">
            <img src={cctvPreview} alt="CCTV camera snapshot" className="w-full h-full object-cover" />
            
            {/* YOLO Bounding Box Overlay */}
            {boxes && boxes.map((boxObj: any, index: number) => {
              const [x1, y1, x2, y2] = boxObj.box;
              const left = (x1 / 6.4).toFixed(1) + "%";
              const top = (y1 / 6.4).toFixed(1) + "%";
              const width = ((x2 - x1) / 6.4).toFixed(1) + "%";
              const height = ((y2 - y1) / 6.4).toFixed(1) + "%";
              
              return (
                <div 
                  key={index} 
                  style={{ left, top, width, height }} 
                  className="absolute border-2 border-indigo-500 bg-indigo-500/10 flex flex-col justify-start items-start pointer-events-none"
                >
                  <span className="bg-indigo-600 text-white font-bold text-[8px] px-1 py-0.2 rounded-br leading-none uppercase">
                    {boxObj.label} ({(boxObj.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
          <span className="inline-block text-xs font-semibold text-slate-300">
            CCTV Frame (AI Engine: {aiEngine || 'simulator'})
          </span>
        </div>
      </div>

      {/* Similarity score */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase">Structural Similarity Rating</p>
        <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
          {similarity}
        </h3>
        <p className="text-xs text-slate-500">Matches are verified using discrete cosine transform (DCT) shape matrices, bypassing color cast and light shift differences.</p>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-200 cursor-pointer"
        >
          File New Report
        </button>
        {matched && (
          <button 
            onClick={() => navigate('/chats')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold rounded-xl text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <MessageSquare size={13} />
            <span>Open Secure Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultPage;
