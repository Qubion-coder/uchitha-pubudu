import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroSequenceProps {
  onComplete: () => void;
  onMusicStart: () => void;
  readyToTransition?: boolean;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
  onMusicStart,
}) => {
  const [step, setStep] = useState<'button' | 'video'>('button');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setStep('video');
    onMusicStart();
  };

  const handleVideoEnded = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'button' && (
          <motion.div
            key="button-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-names text-[#C9A96E] mb-4 drop-shadow-lg">
                Kusheli <span className="mx-2 font-light">&</span> Pubudu
              </h1>
              <p className="text-white/80 font-serif italic tracking-widest text-sm uppercase">
                Are getting married
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-transparent border border-[#C9A96E] text-[#C9A96E] rounded-full uppercase tracking-[0.2em] text-sm font-semibold hover:bg-[#C9A96E] hover:text-stone-900 transition-all duration-700 hover:scale-105 shadow-[0_0_20px_rgba(201,169,110,0.2)] hover:shadow-[0_0_30px_rgba(201,169,110,0.6)] cursor-pointer"
            >
              View Invitation
            </button>
          </motion.div>
        )}

        {step === 'video' && (
          <motion.div
            key="video-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src="/intro_video.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover max-w-full max-h-full"
            />
            
            <button 
              onClick={handleVideoEnded}
              className="absolute bottom-8 right-8 z-50 text-white/50 hover:text-white uppercase tracking-widest text-xs border border-white/20 hover:border-white/50 rounded-full px-4 py-2 transition-all backdrop-blur-sm cursor-pointer"
            >
              Skip
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
