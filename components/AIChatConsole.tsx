import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';

const AIChatConsole: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: MessageRole.SYSTEM, text: "Welcome to the Neural Net. Select a mode to begin." }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'standard' | 'search' | 'maps' | 'fast'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: MessageRole.USER, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let location = undefined;
      if (mode === 'maps') {
        // Simple mock location or try basic navigator if permitted.
        // For best UX in this demo, we use a default if geolocation fails or is denied.
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => 
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (e) {
            console.warn("Location access denied/failed, using San Francisco default.");
            location = { lat: 37.7749, lng: -122.4194 };
        }
      }

      const result = await chatWithGemini(userMsg.text, mode, location);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: result.text,
        groundingUrls: result.groundingChunks?.map((chunk: any) => {
          if (chunk.web?.uri) return { uri: chunk.web.uri, title: chunk.web.title };
          if (chunk.maps?.uri) return { uri: chunk.maps.uri, title: chunk.maps.title || "View on Maps" };
          return null;
        }).filter(Boolean)
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: MessageRole.SYSTEM, 
        text: "Error: Connection interrupted. " + (error as Error).message 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1221] border border-gray-800 rounded-lg overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
      {/* Header */}
      <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-cyan-400 font-cyber flex items-center gap-2">
          <span className="material-icons text-lg">terminal</span> AI_CONSOLE
        </h2>
        <div className="flex gap-2">
           {[
             { id: 'standard', label: 'Pro Chat' },
             { id: 'fast', label: 'Flash Lite' },
             { id: 'search', label: 'Web Grounding' },
             { id: 'maps', label: 'Maps' }
           ].map((m) => (
             <button 
               key={m.id}
               onClick={() => setMode(m.id as any)}
               className={`text-xs px-3 py-1 rounded font-mono transition-colors ${
                 mode === m.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
               }`}
             >
               {m.label}
             </button>
           ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyber-black/80">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
              msg.role === MessageRole.USER 
                ? 'bg-cyan-900/30 border border-cyan-500/50 text-cyan-100 rounded-br-none' 
                : msg.role === MessageRole.SYSTEM
                ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                : 'bg-gray-800/50 border border-gray-700 text-gray-300 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {/* Grounding Sources */}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">SOURCES:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-green-400 hover:underline flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded"
                      >
                         🔗 {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="text-green-500 font-mono text-xs animate-pulse">
             > GEMINI_IS_THINKING...
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Enter command for ${mode} mode...`}
          className="flex-1 bg-black border border-gray-700 rounded p-2 text-white font-mono focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold font-cyber disabled:opacity-50"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default AIChatConsole;