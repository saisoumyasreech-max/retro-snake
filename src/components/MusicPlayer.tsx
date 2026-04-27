import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Code2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO.CORRUPT.01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'NOISE.STREAM.02',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'STATIC.BURST.03',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[currentTrack].url);
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = TRACKS[currentTrack].url;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch((e) => console.log('Autoplay blocked:', e));
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
           console.log('Play failed:', e);
           setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const handlePrev = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full glitch-border bg-black/80 p-4 transition-all hover:bg-black">
      <div className="flex items-center justify-between border-b-2 border-[#0ff] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-[#f0f]" />
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest glitch" data-text="DECRYPT">
              DECRYPT
            </h3>
            <p className="text-[#0ff] text-lg">
              {TRACKS[currentTrack].title}
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-4 border-2 border-[#0ff] bg-black relative overflow-hidden mb-4 p-0.5">
        <div 
          className="h-full bg-[#f0f] relative"
          style={{ width: `${progress}%` }}
        >
           <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2rVrl2sPAwPgJAEgwwAEHwMQ01XWfQAAAABJRU5ErkJggg==')] opacity-50" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev} 
            className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff]/10 p-2 border-2 border-transparent hover:border-[#f0f] transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 flex items-center justify-center bg-black border-2 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext} 
            className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff]/10 p-2 border-2 border-transparent hover:border-[#f0f] transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-[#0ff] hover:text-[#f0f] p-2">
            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-2 bg-black border-2 border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
          />
        </div>
      </div>
    </div>
  );
}
