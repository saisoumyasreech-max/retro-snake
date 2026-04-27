import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col pt-4 pb-10 px-4 md:px-8 relative overflow-hidden bg-black text-[#0ff] font-['VT323']">
      {/* Glitch overlays */}
      <div className="scanlines" />
      <div className="static-noise" />

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 mb-8 z-10 p-4 glitch-border bg-black/80 backdrop-blur-sm mt-4">
        <div className="flex flex-col items-center">
          <h1 
            className="text-6xl md:text-7xl font-bold text-white tracking-widest glitch" 
            data-text="SYS.SNAKE"
          >
            SYS.SNAKE
          </h1>
          <p className="text-[#f0f] text-xl tracking-[0.3em] mt-2 uppercase">
            [ERR: SIMULATION_BREACH]
          </p>
        </div>
      </header>

      {/* Main Grid Layout for Desktop, Stacked for Mobile */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 z-10 relative">
        <div className="w-full md:w-1/3 flex flex-col gap-8 order-2 md:order-1">
           <MusicPlayer />
           <div className="glitch-border p-4 bg-black/80">
              <h2 className="text-[#f0f] text-2xl mb-2">&gt; SYS.LOG</h2>
              <ul className="text-[#0ff] text-lg space-y-1 opacity-70">
                 <li>INIT SEQUENCE... OK</li>
                 <li>USER DETECTED... YES</li>
                 <li><span className="text-[#f0f]">WARNING:</span> DATA CORRUPTION HIGH</li>
                 <li>COMM LINK... UNSTABLE</li>
                 <li className="animate-pulse">AWAITING INPUT...</li>
              </ul>
           </div>
        </div>
        <div className="w-full md:w-2/3 flex justify-center order-1 md:order-2">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
