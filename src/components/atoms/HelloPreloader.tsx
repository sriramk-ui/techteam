'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREETINGS = [
  'Hello',
  'Bonjour',
  'Hola',
  'Ciao',
  'Namaste',
  'hello'
];

export default function HelloPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'counter' | 'greeting' | 'exiting' | 'complete'>('counter');
  const [greetingIndex, setGreetingIndex] = useState(0);

  // SVG Curve dimensions
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Check if preloader has already run in this session
    const hasSeen = sessionStorage.getItem('hasSeenHelloPreloader');
    if (hasSeen === 'true') {
      setIsLoading(false);
      setStage('complete');
      return;
    }

    // Set screen dimensions for SVG curve wipe
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Counter progress animation (0% -> 100%)
  useEffect(() => {
    if (stage !== 'counter') return;

    const duration = 1400; // ms
    const interval = 20; // ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step + Math.random() * 2;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage('greeting'), 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stage]);

  // Greeting cycling sequence
  useEffect(() => {
    if (stage !== 'greeting') return;

    const interval = setInterval(() => {
      setGreetingIndex((prev) => {
        if (prev < GREETINGS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStage('exiting');
            // Mark preloader as seen
            sessionStorage.setItem('hasSeenHelloPreloader', 'true');
          }, 300);
          return prev;
        }
      });
    }, 220);

    return () => clearInterval(interval);
  }, [stage]);

  // Completion callback
  const handleExitComplete = () => {
    setIsLoading(false);
    setStage('complete');
  };

  if (!isLoading || stage === 'complete') return null;

  // SVG curve morph paths
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} Z`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} 0 Q${dimension.width / 2} 0 0 0 Z`;

  const curveAnimation = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0c] text-[#f1e7dd] selection:bg-transparent overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{
          y: '-100%',
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
        }}
      >
        {/* Main Preloader Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <AnimatePresence mode="wait">
            {stage === 'counter' && (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center space-y-5"
              >
                {/* Percentage Counter */}
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#f1e7dd] font-mono">
                  {Math.round(progress)}%
                </span>

                {/* Circular Arc Loader */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
                    {/* Background Track */}
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="rgba(241, 231, 221, 0.15)"
                      strokeWidth="3.5"
                      fill="none"
                    />
                    {/* Animated Arc */}
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="#f1e7dd"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 - (125.6 * progress) / 100}
                      className="transition-all duration-75 ease-out"
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {(stage === 'greeting' || stage === 'exiting') && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center min-h-[120px]"
              >
                <motion.h1
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.18 }}
                  className="font-script text-7xl sm:text-8xl md:text-9xl text-[#f1e7dd] font-bold tracking-wide drop-shadow-[0_10px_25px_rgba(241,231,221,0.2)]"
                >
                  {GREETINGS[greetingIndex]}
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Curved SVG Mask Unveil Effect */}
        {dimension.height > 0 && (
          <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#0a0a0c]">
            <motion.path
              variants={curveAnimation}
              initial="initial"
              exit="exit"
            />
          </svg>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
