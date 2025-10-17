'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';
import Navigation from './Navigation';
import Slide, { SlideData } from './Slide';
import { useAudio } from '@/hooks/useAudio';

const SLIDES: SlideData[] = [
  {
    id: 1,
    title: "For My Mahal 💕",
    content: 'gift',
    bgColor: "from-birthday-blue-100 to-birthday-blue-200"
  },
  {
    id: 2, 
    title: "A Special Message",
    content: 'message',
    bgColor: "from-birthday-blue-200 to-birthday-blue-300"
  },
  {
    id: 3,
    title: "Happy Birthday! 🎂",
    content: 'cake', 
    bgColor: "from-birthday-blue-300 to-birthday-blue-400"
  }
];

export default function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Audio control at the slideshow level to persist across slides
  // Start at full volume, enable loop
  const { isPlaying, play, pause, error, setVolume, setLoop } = useAudio('/audio/placeholder.mp3', 1.0, true);

  // Enforce loop on mount
  useEffect(() => {
    setLoop(true);
  }, [setLoop]);

  // Adjust volume by slide: 2% on slide index 1, 100% elsewhere
  useEffect(() => {
    const targetVolume = currentSlide === 1 ? 0.1 : 1.0;
    setVolume(targetVolume);
  }, [currentSlide, setVolume]);

  // Expose helpers for temporary ducking during voice playback
  const duckMusic = (volume: number) => {
    setVolume(volume);
  };

  const restoreMusic = () => {
    const targetVolume = currentSlide === 1 ? 0.1 : 1.0;
    setVolume(targetVolume);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Autoplay disabled: slides change only via explicit user interaction
  // (buttons, dots, keyboard). Keeping this effect removed prevents
  // automatic advancing.
  // useEffect intentionally omitted

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Background />
      
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Slide 
            slide={SLIDES[currentSlide]} 
            onNext={nextSlide}
            onPrev={prevSlide}
            onPlayMusic={play}
            onDuckMusic={duckMusic}
            onRestoreMusic={restoreMusic}
          />
        </motion.div>
      </AnimatePresence>

      <Navigation 
        currentSlide={currentSlide}
        totalSlides={SLIDES.length}
        isPlaying={isPlaying}
        onPlay={play}
        onPause={pause}
        error={error}
      />
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};


