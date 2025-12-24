import React from 'react';
import { Music, Snowflake, Palette, Heart, Send } from 'lucide-react';
import { TreeMode } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  currentMode: TreeMode;
  onCycleMode: () => void;
  showWishInput: boolean;
  onToggleWishInput: () => void;
  wishes: string[];
  onAddWish: (text: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onToggleMusic,
  currentMode,
  onCycleMode,
  showWishInput,
  onToggleWishInput,
  wishes,
  onAddWish,
}) => {
  const [inputText, setInputText] = React.useState('');

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddWish(inputText.trim());
      setInputText('');
    }
  };

  return (
    <>
      {/* Bottom Control Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-6 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
        
        <button 
          onClick={onToggleMusic}
          className={`p-3 rounded-full transition-all duration-300 group relative ${isPlaying ? 'bg-rose-500/80 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          title="Toggle Ambient"
        >
          <Music size={24} className={isPlaying ? "animate-pulse" : ""} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isPlaying ? 'Pause' : 'Play Music'}
          </span>
        </button>

        <button 
          onClick={onCycleMode}
          className="p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300 group relative"
          title="Change Theme"
        >
          <Palette size={24} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Theme: {currentMode}
          </span>
        </button>

        <button 
          onClick={onToggleWishInput}
          className={`p-3 rounded-full transition-all duration-300 group relative ${showWishInput ? 'bg-amber-400/80 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          title="Make a Wish"
        >
          <Heart size={24} className={showWishInput ? "fill-current" : ""} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Make a Wish
          </span>
        </button>

      </div>

      {/* Wish Input Overlay */}
      {showWishInput && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onToggleWishInput}>
            <div className="bg-slate-900/90 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-script text-amber-300 mb-4 text-center">Make a Christmas Wish</h3>
                <form onSubmit={handleSubmitWish} className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Write your wish..."
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                        maxLength={30}
                    />
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                        <Send size={20} />
                    </button>
                </form>
                
                {wishes.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-white/60 text-sm mb-2 font-medium">Recent Wishes floating in the stars:</h4>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {wishes.map((wish, idx) => (
                                <span key={idx} className="bg-white/10 text-amber-100 text-xs px-3 py-1 rounded-full border border-white/5 animate-fade-in-up">
                                    {wish}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default Controls;