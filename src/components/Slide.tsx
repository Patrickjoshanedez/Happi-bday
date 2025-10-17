'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAudio } from '@/hooks/useAudio';

export type SlideContent = 'gift' | 'message' | 'cake';

export interface SlideData {
  id: number;
  title: string;
  content: SlideContent;
  bgColor: string;
}

interface SlideProps {
  slide: SlideData;
  onNext: () => void;
  onPrev: () => void;
  onPlayMusic: () => void;
  onDuckMusic: (volume: number) => void;
  onRestoreMusic: () => void;
}

export default function Slide({ slide, onNext, onPlayMusic, onDuckMusic, onRestoreMusic }: SlideProps) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showHugAnimation, setShowHugAnimation] = useState(false);

  const handleGiftOpen = () => {
    setGiftOpened(true);
    
    // Play music using the function from parent component
    onPlayMusic();
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    });
    
    // No auto-transition - wait for photo click
  };

  const handlePhotoClick = () => {
    // Show hug animation first
    setShowHugAnimation(true);
    
    // Transition to next slide after animation completes
    setTimeout(() => {
      setShowHugAnimation(false);
      onNext();
    }, 2000); // 2 seconds for animation
  };

  const renderContent = () => {
    switch (slide.content) {
      case 'gift':
        return (
          <div className="text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-dancing text-birthday-blue-500 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-gradient-to-r from-birthday-blue-500 via-birthday-pink to-birthday-blue-500 bg-clip-text text-transparent animate-pulse">
                A Gift For You, Mahal ko!
              </span>
            </motion.h1>
            
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGiftOpen}
            >
              <GiftBox isOpen={giftOpened} onPhotoClick={handlePhotoClick} />
            </motion.div>

            <motion.p 
              className="mt-6 sm:mt-8 text-lg sm:text-xl font-nunito text-birthday-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="inline-block animate-bounce">Click the gift to open!</span>
            </motion.p>

            {/* Hug Animation */}
            {showHugAnimation && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-8xl sm:text-9xl md:text-[12rem]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut",
                    times: [0, 0.6, 1]
                  }}
                >
                  🤗
                </motion.div>
              </motion.div>
            )}
          </div>
        );

      case 'message':
        return <MessageSlide onNext={onNext} onDuckMusic={onDuckMusic} onRestoreMusic={onRestoreMusic} />;
        
      case 'cake':
        return <CakeSlide />;
        
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br ${slide.bgColor} overflow-hidden`}>
      <div className="max-w-4xl mx-auto text-center px-2 w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}

function GiftBox({ isOpen, onPhotoClick }: { isOpen: boolean; onPhotoClick: () => void }) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-birthday-blue-400 to-birthday-blue-300 rounded-xl shadow-2xl relative"
        animate={isOpen ? {
          scale: [1, 1.2, 0.8],
          rotateY: [0, 180, 360],
          opacity: [1, 0.8, 0]
        } : {}}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-56 sm:w-64 md:w-72 h-6 sm:h-8 bg-birthday-blue-500 rounded-t-lg"
          animate={isOpen ? { y: -100, opacity: 0 } : {}}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 sm:w-8 h-full bg-birthday-pink absolute left-1/2 transform -translate-x-1/2" />
          <div className="h-6 sm:h-8 w-full bg-birthday-pink absolute top-1/2 transform -translate-y-1/2" />
        </div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={isOpen ? { scale: 0, opacity: 0 } : {}}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-birthday-pink rounded-full relative">
            <div className="absolute w-6 sm:w-8 h-6 sm:h-8 bg-birthday-pink rounded-full -left-1.5 sm:-left-2 top-1.5 sm:top-2" />
            <div className="absolute w-6 sm:w-8 h-6 sm:h-8 bg-birthday-pink rounded-full -right-1.5 sm:-right-2 top-1.5 sm:top-2" />
          </div>
        </motion.div>
      </motion.div>

      {isOpen && (
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-32 h-32 sm:w-40 sm:h-40 bg-white/90 rounded-lg shadow-lg flex items-center justify-center border-2 border-birthday-blue-200 cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPhotoClick}
          >
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/images/gift-photo.jpg" 
                  alt="Special gift photo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="text-gray-500 text-xs sm:text-sm hidden">Your Photo</span>
                
                {/* Click me text overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs sm:text-sm font-nunito text-center px-2">
                    Click me mahal koooo! 💕
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-birthday-blue-500 font-nunito">Ako ra akong mahatag hehe, click me po : ))</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const FULL_MESSAGE = `My Dearest Mahal,

On this beautiful day, even though we're far apart, 
I want you to know how much you mean to me.
How your voice brightens my days, how your laughter 
is my favorite melody, and your love is a gift I carry 
with me. I hope this birthday brings you joy, success, 
and quiet moments that make your heart smile.
You are amazing mahal ko. 

I miss you : (( and I love you so much!

Happy Birthday Mahal ko! ❤️`;

function MessageSlide({ onNext, onDuckMusic, onRestoreMusic }: { onNext: () => void; onDuckMusic: (v: number) => void; onRestoreMusic: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const hasStartedRecording = useRef(false);
  // Ensure the voice recording stays loud and clear regardless of music ducking
  const { play: playRecording } = useAudio('/audio/Recording.mp3', 1.0);

  useEffect(() => {
    // Ensure music is ducked while message plays
    onDuckMusic(0.1);

    let index = 0;
    
    const timer = setInterval(() => {
      if (index <= FULL_MESSAGE.length) {
        setDisplayedText(FULL_MESSAGE.slice(0, index));
        
        // Play recording when typing starts (first character)
        if (index === 1 && !hasStartedRecording.current) {
          playRecording();
          hasStartedRecording.current = true;
        }
        
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => {
      clearInterval(timer);
      onRestoreMusic();
    };
  }, []); // Empty dependency array to run only once

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
      {/* Flickering lights background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto border-2 border-birthday-blue-200 relative z-10 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-dancing text-birthday-blue-500 mb-4 sm:mb-6 md:mb-8 text-center">
          To My Beautiful Mahal 💕
        </h2>
        
        <div className="text-sm sm:text-base md:text-lg font-nunito text-birthday-blue-500 leading-relaxed whitespace-pre-line min-h-32 sm:min-h-48 md:min-h-64">
          {displayedText}
          <span className="animate-pulse">|</span>
        </div>

        <motion.div
          className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-birthday-blue-400 font-nunito text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          Forever yours...
        </motion.div>

        <motion.button
          onClick={onNext}
          className="mt-6 sm:mt-8 bg-gradient-to-r from-birthday-blue-500 to-birthday-pink text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-nunito text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Cake 🎂
        </motion.button>
      </motion.div>
    </div>
  );
}

function CakeSlide() {
  const [candlesLit, setCandlesLit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCandlesLit(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-dancing text-birthday-blue-500 mb-4 relative -top-[100px]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Happy Birthday Mahal! 🎂
      </motion.h1>
      
      <motion.p 
        className="text-base sm:text-lg md:text-xl font-nunito text-birthday-blue-500 mb-8 md:mb-12 relative -top-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Make a wish and blow out the candles!
      </motion.p>

      {/* Spacing handled via margin on cake container below */}

      <motion.div
        className="relative inline-block mt-[120px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <div className="w-64 sm:w-72 md:w-80 h-32 sm:h-36 md:h-40 bg-gradient-to-b from-amber-200 to-amber-400 rounded-t-lg relative">
          <div className="absolute -top-4 left-0 w-full h-8 bg-pink-200 rounded-full" />
          
          <div className="absolute top-2 left-1/4 w-4 h-4 bg-birthday-blue-400 rounded-full" />
          <div className="absolute top-2 left-1/2 w-4 h-4 bg-birthday-pink rounded-full" />
          <div className="absolute top-2 left-3/4 w-4 h-4 bg-birthday-blue-400 rounded-full" />
        </div>
        
        <div className="absolute -top-16 sm:-top-20 left-1/2 transform -translate-x-1/2 flex space-x-3 sm:space-x-4">
          {[1, 2, 3, 4, 5].map((candle) => (
            <motion.div key={candle} className="relative">
              <div className="w-1.5 sm:w-2 h-10 sm:h-12 bg-red-500 mx-auto" />
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-3 sm:w-4 h-5 sm:h-6 bg-yellow-300 rounded-full"
                animate={candlesLit ? {
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.1, 1]
                } : { opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-8 md:mt-12 text-base sm:text-lg font-nunito text-birthday-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        You are loved more than you know! 💙
      </motion.div>
    </div>
  );
}


