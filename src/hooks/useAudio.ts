import { useState, useEffect, useRef } from 'react';

export const useAudio = (src: string, volume: number = 0.3, loop: boolean = false) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
      audioRef.current.loop = loop;
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('loadstart', () => console.log('Audio loading started'));
      audioRef.current.addEventListener('canplay', () => console.log('Audio can play'));
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Failed to load audio file');
      });
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, volume, loop]);

  const play = async () => {
    if (audioRef.current) {
      try {
        setError(null);
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Audio playing successfully');
      } catch (err) {
        console.error('Play failed:', err);
        setError('Failed to play audio. Check browser console for details.');
        setIsPlaying(false);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const setLoop = (shouldLoop: boolean) => {
    if (audioRef.current) {
      audioRef.current.loop = shouldLoop;
    }
  };

  return {
    isPlaying,
    play,
    pause,
    error,
    setVolume,
    setLoop,
  };
};


