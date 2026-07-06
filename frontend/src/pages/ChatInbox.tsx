import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';

function ChatInbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'finder',
      text: "Hello! I reported finding a matching item. Let's coordinate recovery anonymously.",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket for real-time messaging
  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:5000`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'CHAT_MSG') {
          setMessages(prev => [...prev, msg.payload]);
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'owner',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MSG',
        payload: msg
      }));
    } else {
      setMessages(prev => [...prev, msg]);
      
      // Local reply simulation
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'finder',
          text: "I have the item safely with me at the terminal security gate. Let me know when you can verify it!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }

    setChatInput('');
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Secure Chat Session: Owner & Finder</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[80%] text-xs p-3 rounded-2xl ${msg.sender === 'owner' ? 'bg-emerald-600 text-white rounded-tr-none ml-auto' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}
          >
            <p>{msg.text}</p>
            <span className="text-[9px] text-slate-400 self-end mt-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-2 bg-slate-950/20">
        <input 
          type="text" 
          placeholder="Type secure message..." 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-500 p-2.5 rounded-xl text-white cursor-pointer shadow-lg shadow-emerald-600/20"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatInbox;
