import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setFood(generateFood([{ x: 10, y: 10 }]));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling completely if arrows/space are pressed
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (!gameOver) setIsPaused(prev => !prev);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (isPaused) return;

      const keyPaths: { [key: string]: Point } = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      };

      const newDir = keyPaths[e.key];
      if (newDir) {
        setNextDirection(currentNextDir => {
          // Prevent reversing direction
          if (direction.x !== 0 && newDir.x === -direction.x) return currentNextDir;
          if (direction.y !== 0 && newDir.y === -direction.y) return currentNextDir;
          return newDir;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPaused, gameOver]);

  // Game Loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
          // Slightly increase speed
          setSpeed(s => Math.max(50, s - 3)); 
        } else {
          newSnake.pop(); // Remove tail
        }

        setDirection(nextDirection);
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [nextDirection, isPaused, gameOver, food, generateFood, speed, highScore]);

  return (
    <div className="flex flex-col items-center">
      {/* Score Header */}
      <div className="w-full flex justify-between items-end mb-4 text-xl text-[#0ff]">
        <div className="flex flex-col">
          <span className="text-xs text-[#f0f] tracking-widest uppercase mb-1">Score</span>
          <span>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs flex items-center gap-1 text-[#f0f] tracking-widest uppercase mb-1">
            <Trophy className="w-4 h-4 text-[#f0f]" /> Best
          </span>
          <span className="text-white">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black glitch-border overflow-hidden shadow-2xl"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-[#0ff] z-10' : 'bg-[#0ff]/80'}`}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
                boxShadow: isHead ? '0 0 10px #0ff' : 'none',
                transform: 'scale(1)',
                border: '1px solid black'
              }}
            />
          );
        })}

        {/* Render Food */}
        <div
          className="bg-[#f0f] animate-pulse"
          style={{
            gridColumn: food.x + 1,
            gridRow: food.y + 1,
            boxShadow: '0 0 10px #f0f',
            transform: 'scale(0.8)',
            border: '2px solid #0ff'
          }}
        />

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center glitch-wrapper">
            {gameOver ? (
              <>
                <h2 className="text-5xl font-bold text-white mb-4 tracking-widest glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-[#f0f] text-2xl mb-8">&gt; SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black font-bold uppercase tracking-widest transition-all"
                >
                  <RotateCcw className="w-6 h-6" /> REBOOT
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-white mb-8 tracking-widest glitch" data-text="SYS.SNAKE.EXE">SYS.SNAKE.EXE</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-black border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold uppercase tracking-widest transition-all"
                >
                  <Play className="w-6 h-6 fill-current" /> EXECUTE
                </button>
                <p className="mt-8 text-lg text-[#f0f] tracking-widest max-w-[200px] opacity-70">
                  USE W/A/S/D TO NAVIGATE. SPACE TO INTERRUPT.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Controls (visible only on small screens) */}
      <div className="md:hidden grid grid-cols-3 gap-2 mt-8 w-48 mx-auto">
        <div />
        <button 
          onClick={() => !isPaused && setNextDirection({ x: 0, y: -1 })}
          className="bg-black border-2 border-[#0ff] p-4 active:bg-[#0ff] group touch-none"
        >
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-[#0ff] mx-auto group-active:border-b-black" />
        </button>
        <div />
        <button 
          onClick={() => !isPaused && setNextDirection({ x: -1, y: 0 })}
          className="bg-black border-2 border-[#0ff] p-4 active:bg-[#0ff] group touch-none"
        >
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-[#0ff] mx-auto group-active:border-r-black" />
        </button>
        <button 
          onClick={() => !isPaused && setNextDirection({ x: 0, y: 1 })}
          className="bg-black border-2 border-[#0ff] p-4 active:bg-[#0ff] group touch-none"
        >
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-[#0ff] mx-auto group-active:border-t-black" />
        </button>
        <button 
          onClick={() => !isPaused && setNextDirection({ x: 1, y: 0 })}
          className="bg-black border-2 border-[#0ff] p-4 active:bg-[#0ff] group touch-none"
        >
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-[#0ff] mx-auto group-active:border-l-black" />
        </button>
      </div>
    </div>
  );
}
