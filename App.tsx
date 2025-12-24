import React, { useState, useEffect, useRef, useCallback } from 'react';
import SnowSystem from './components/SnowSystem';
import TreeCanvas from './components/TreeCanvas';
import MagicOverlay from './components/MagicOverlay';
import Controls from './components/Controls';
import ShootingStar from './components/ShootingStar';
import { TreeMode } from './types';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [treeMode, setTreeMode] = useState<TreeMode>(TreeMode.CLASSIC);
  const [showWishInput, setShowWishInput] = useState(false);
  const [wishes, setWishes] = useState<string[]>(['Love', 'Peace', 'Joy']);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background gradient based on mode
  const getBackgroundClass = () => {
    switch (treeMode) {
      case TreeMode.FROZEN:
        return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1026] to-black";
      case TreeMode.NEON:
        return "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black";
      case TreeMode.CLASSIC:
      default:
        // Warm, Romantic Night Sky: Deep Blue -> Dark Purple -> Black
        return "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#16213e] to-[#0f0f1a]";
    }
  };

  const getTextColor = () => {
     switch (treeMode) {
      case TreeMode.NEON: return 'fill-fuchsia-300 drop-shadow-[0_0_8px_rgba(216,27,96,0.8)]';
      case TreeMode.FROZEN: return 'fill-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]';
      case TreeMode.CLASSIC: default: return 'fill-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]'; // Gold
    }
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
                console.error("Audio play failed, maybe user gesture required:", e);
                // Try again or show visual feedback
            });
    } else {
        audioRef.current.pause();
        setIsPlaying(false);
    }
  };

  const cycleMode = () => {
    if (treeMode === TreeMode.CLASSIC) setTreeMode(TreeMode.FROZEN);
    else if (treeMode === TreeMode.FROZEN) setTreeMode(TreeMode.NEON);
    else setTreeMode(TreeMode.CLASSIC);
  };

  const handleAddWish = (text: string) => {
    setWishes(prev => [text, ...prev]);
  };

  // 处理关闭许愿页面 - 触发流星
  const handleToggleWishInput = useCallback(() => {
    if (showWishInput) {
      // 关闭许愿页面时，触发流星
      setShowShootingStar(true);
    }
    setShowWishInput(!showWishInput);
  }, [showWishInput]);

  // 流星动画完成后的回调
  const handleShootingStarComplete = useCallback(() => {
    setShowShootingStar(false);
  }, []);

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${getBackgroundClass()}`}>
      
      {/* 0. Moon Element (Behind everything) */}
      <div className={`absolute top-10 right-10 md:right-20 w-24 h-24 rounded-full opacity-90 blur-[1px] transition-colors duration-1000 animate-pulse-slow
        ${treeMode === TreeMode.CLASSIC ? 'bg-[#ffe082] shadow-[0_0_80px_20px_rgba(255,224,130,0.4)]' : ''}
        ${treeMode === TreeMode.FROZEN ? 'bg-[#e0f7fa] shadow-[0_0_80px_20px_rgba(224,247,250,0.4)]' : ''}
        ${treeMode === TreeMode.NEON ? 'bg-[#e040fb] shadow-[0_0_80px_20px_rgba(224,64,251,0.3)] opacity-70' : ''}
      `}>
        {/* Inner glow ring */}
        <div className="absolute inset-[-10px] rounded-full border-4 border-white/10 blur-[4px]"></div>
        {/* Crater details for fun */}
        <div className="absolute top-4 left-6 w-4 h-4 bg-black/5 rounded-full blur-[1px]"></div>
        <div className="absolute bottom-6 right-8 w-6 h-6 bg-black/5 rounded-full blur-[1px]"></div>
        <div className="absolute top-8 right-6 w-2 h-2 bg-black/5 rounded-full blur-[1px]"></div>
      </div>

      {/* 1. Background Snow & Stars Layer */}
      <SnowSystem mode={treeMode} />

      {/* 2. Main Tree Layer */}
      <TreeCanvas mode={treeMode} isRotatingFast={isPlaying} />
      
      {/* NEW: Magic Mouse Trail Overlay */}
      <MagicOverlay />

      {/* NEW: Cinematic Vignette (CSS Overlay) */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]"></div>

      {/* 3. Text & Overlay Layer */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 flex flex-col items-center justify-between py-8">
        
        {/* Curved Header Text */}
        <div className="w-full max-w-4xl mx-auto mt-4 md:mt-8 animate-fade-in-down flex flex-col items-center justify-center">
            
            <svg viewBox="0 0 500 120" className="w-full h-auto max-h-[160px] overflow-visible drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                <defs>
                    <path id="curve" d="M 50,110 Q 250,10 450,110" fill="transparent" />
                </defs>
                <text className="font-script text-[55px]" textAnchor="middle">
                    <textPath href="#curve" startOffset="50%" className={`${getTextColor()} transition-colors duration-1000`}>
                        Merry Christmas
                    </textPath>
                </text>
            </svg>

            <p className={`${treeMode === TreeMode.CLASSIC ? 'text-amber-100/80' : 'text-white/70'} text-xs md:text-sm font-light tracking-[0.3em] uppercase -mt-4 drop-shadow-md`}>
                Wishing you warmth & magic
            </p>
        </div>

        {/* Floating Wishes Display (Passive) */}
        <div className="absolute top-1/4 w-full h-1/2 overflow-hidden pointer-events-none opacity-40">
           {wishes.map((wish, i) => {
             // Random positioning for wishes
             const left = (i * 37) % 80 + 10; // Pseudo random
             const top = (i * 23) % 80 + 10;
             const delay = i * 2;
             return (
               <div 
                  key={i} 
                  className="absolute text-amber-100/60 text-xs font-script animate-pulse"
                  style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
               >
                 ✨ {wish}
               </div>
             )
           })}
        </div>

      </div>

      {/* 4. Controls UI */}
      <Controls 
        isPlaying={isPlaying} 
        onToggleMusic={handleToggleMusic}
        currentMode={treeMode}
        onCycleMode={cycleMode}
        showWishInput={showWishInput}
        onToggleWishInput={handleToggleWishInput}
        wishes={wishes}
        onAddWish={handleAddWish}
      />

      {/* 5. Shooting Star - 许愿后的流星 */}
      <ShootingStar 
        isVisible={showShootingStar} 
        onComplete={handleShootingStarComplete} 
      />

      {/* Audio element pointing to constant URL */}
      <audio ref={audioRef} loop preload="auto">
        <source src={`${import.meta.env.BASE_URL}all-i-want-for-xmas-is-you.mp3`} type="audio/mpeg" />
      </audio>

    </div>
  );
};

export default App;