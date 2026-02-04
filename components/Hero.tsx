import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 px-6 md:px-12 border-b border-gray-800 bg-gradient-to-b from-cyber-black to-[#050f1e]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center space-x-2 mb-4">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-green-500 font-mono text-sm">ONLINE // SYSTEM ACTIVE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-cyber font-bold text-white mb-6 leading-tight">
            WEB_DEV <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
              GAMER
            </span> <br />
            SECURITY
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-mono mb-8 max-w-lg">
            Navigating the digital frontier with precision code and advanced AI integration. 
            Powered by Gemini 2.5 & 3.0.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-bold font-cyber rounded-sm transition-all skew-x-[-10deg]">
              <span className="skew-x-[10deg] inline-block">DEPLOY PROJECT</span>
            </button>
            <button className="px-6 py-3 border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold font-cyber rounded-sm transition-all skew-x-[-10deg]">
               <span className="skew-x-[10deg] inline-block">INITIATE CHAT</span>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-purple-600 rounded-lg blur opacity-25 animate-pulse"></div>
          <div className="relative bg-cyber-black border border-gray-800 p-6 rounded-lg font-mono text-sm text-gray-300 shadow-2xl">
             <div className="flex space-x-2 mb-4">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <p className="text-green-400">$ whoami</p>
             <p className="mb-2">> Full Stack Engineer | White Hat | MMORPG Veteran</p>
             <p className="text-green-400">$ stack --list</p>
             <p className="mb-2">> React, TypeScript, Node.js, Python, Kali Linux</p>
             <p className="text-green-400">$ ai --status</p>
             <p className="mb-2">> Gemini 3 Pro: <span className="text-green-500">READY</span></p>
             <p className="mb-2">> Veo Video Gen: <span className="text-green-500">READY</span></p>
             <p className="animate-pulse">_</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;