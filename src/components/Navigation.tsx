'use client';

interface NavigationProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  error: string | null;
}

export default function Navigation({ 
  currentSlide, 
  totalSlides, 
  isPlaying,
  onPlay,
  onPause,
  error
}: NavigationProps) {

  return (
    <>
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex flex-col items-end gap-2 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="bg-white/80 hover:bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-nunito text-birthday-blue-500 shadow-lg transition text-sm sm:text-base"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </button>
          <div className="bg-white/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-nunito text-birthday-blue-500 shadow-lg text-sm sm:text-base">
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs max-w-xs text-center">
            {error}
          </div>
        )}
      </div>
    </>
  );
}


