import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Compass, MapPin, TrendingUp, QrCode, Award, MessageSquare, Bot, Sparkles, X, Send, Menu
} from 'lucide-react';

import UploadUserImage from './pages/UploadUserImage';
import UploadCCTVImage from './pages/UploadCCTVImage';
import ResultPage from './pages/ResultPage';
import RadarMap from './pages/RadarMap';
import Analytics from './pages/Analytics';
import QrTags from './pages/QrTags';
import Reputation from './pages/Reputation';
import ChatInbox from './pages/ChatInbox';

function App() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Hi! I am your AuraFind Recovery Assistant. How can I help you recover lost items today?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = "I've processed your request with our cognitive search. ";
      const lower = userMsg.toLowerCase();
      if (lower.includes('lost') || lower.includes('report') || lower.includes('wallet') || lower.includes('bag')) {
        reply += "You can file a new **Lost Report** on the main page. Fill out your details, upload a photo, and then proceed to upload a CCTV camera frame for structural match comparison.";
      } else if (lower.includes('sms') || lower.includes('phone') || lower.includes('text')) {
        reply += "Our SMS alert dispatcher is active! When you report an item, please enter your correct phone number. If the AI match engine detects a similarity > 75%, it will instantly text you coordinates and details.";
      } else if (lower.includes('qr') || lower.includes('tag')) {
        reply += "You can generate unique stickers in the **QR Tag System** tab. Stick them onto your valuables so finders can scan them and reach you anonymously.";
      } else {
        reply += "You can toggle the top tabs to view our Interactive Radar Map, analytics dashboards, secure inbox, and reputation progress board.";
      }
      setAiChat(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {/* Header & Navbar */}
        <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
                  AuraFind
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                  AI Cognitive Recovery Network
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <Compass size={14} className="text-indigo-400" />
                <span>Match Wizard</span>
              </Link>
              <Link to="/map" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <MapPin size={14} className="text-indigo-400" />
                <span>Radar Map</span>
              </Link>
              <Link to="/analytics" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <TrendingUp size={14} className="text-indigo-400" />
                <span>Analytics</span>
              </Link>
              <Link to="/qr" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <QrCode size={14} className="text-indigo-400" />
                <span>QR System</span>
              </Link>
              <Link to="/reputation" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <Award size={14} className="text-indigo-400" />
                <span>Reputation</span>
              </Link>
              <Link to="/chats" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                <MessageSquare size={14} className="text-indigo-400" />
                <span>Secure Chat</span>
              </Link>
            </nav>

            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SMS Dispatcher Active</span>
            </div>
          </div>
        </header>

        {/* Content Routes */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          <Routes>
            <Route path="/" element={<UploadUserImage />} />
            <Route path="/cctv" element={<UploadCCTVImage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/map" element={<RadarMap />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/qr" element={<QrTags />} />
            <Route path="/reputation" element={<Reputation />} />
            <Route path="/chats" element={<ChatInbox />} />
          </Routes>

          {/* Floating AI Assistant Trigger */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {isAiOpen && (
              <div className="w-80 h-96 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Bot size={14} className="text-indigo-400" />
                    <span>Aura AI assistant</span>
                  </span>
                  <button onClick={() => setIsAiOpen(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {aiChat.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] text-xs p-2 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none ml-auto' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}
                    >
                      <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="self-start bg-slate-800 text-slate-500 rounded-r-xl rounded-tl-none p-2 max-w-[40px] text-center">
                      <span className="animate-pulse">...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAiSend} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950/40">
                  <input 
                    type="text" 
                    placeholder="Ask assistant..." 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 p-1.5 rounded-xl text-white cursor-pointer">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}

            <button 
              onClick={() => setIsAiOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
            >
              <Bot size={16} className={isAiOpen ? '' : 'animate-bounce'} />
              <span>Aura AI Assistant</span>
              <Sparkles size={12} className="text-blue-300" />
            </button>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
