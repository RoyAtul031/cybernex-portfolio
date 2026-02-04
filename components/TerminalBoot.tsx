import React, { useState, useEffect, useRef } from 'react';

interface TerminalBootProps {
  onComplete: () => void;
}

const TerminalBoot: React.FC<TerminalBootProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([
    "Booting CyberNex OS v2.5...",
    "Initializing kernel...",
    "Loading security protocols...",
    "IDENTITY VERIFICATION REQUIRED...",
  ]);
  const [input, setInput] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setLines(prev => [...prev, `user@portfolio:~$ ${cmd}`]);

      // Secret Key Check
      if (cmd.toUpperCase() === "HI I AM ATUL") {
        setLines(prev => [
          ...prev,
          ">> IDENTITY CONFIRMED",
          ">> WELCOME BOSS ITS YOUR PAGE ..",
          ">> INITIATING MATRIX PROTOCOL..."
        ]);
        setInput('');
        setTimeout(onComplete, 2500); // Slightly longer delay to read the message
      } else {
        setIsError(true);
        setLines(prev => [
          ...prev,
          ">> ACCESS DENIED",
          ">> INCORRECT IDENTITY. ACCESS RESTRICTED."
        ]);
        setInput('');
        setTimeout(() => setIsError(false), 200);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black text-[#00ff41] font-mono p-4 md:p-10 text-sm md:text-base overflow-hidden z-[100] flex items-center justify-center"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full max-w-3xl border border-[#00ff41]/30 bg-black/90 p-6 rounded shadow-[0_0_20px_rgba(0,255,65,0.2)] h-[80vh] flex flex-col relative">
        {/* CRT Scanline */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

        <div className="flex-1 overflow-y-auto space-y-2 pb-4 scrollbar-hide">
          {lines.map((line, i) => (
            <div key={i} className="break-words">{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex items-center border-t border-[#00ff41]/30 pt-4">
          <span className="mr-2 text-[#00d4ff]">user@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-transparent border-none outline-none flex-1 font-mono ${isError ? 'text-red-500' : 'text-white'}`}
            autoFocus
            autoComplete="off"
          />
          <span className="animate-pulse bg-[#00ff41] w-2.5 h-5 ml-1 inline-block"></span>
        </div>

        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
          System Status: WAITING_FOR_INPUT
        </div>
      </div>
    </div>
  );
};

export default TerminalBoot;