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

  // Screen dimensions for SVG curve wipe
  const [dimension, setDimension] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    // 1. Session check with safe try-catch
    try {
      const hasSeen = sessionStorage.getItem('hasSeenHelloPreloader');
      if (hasSeen === 'true') {
        setIsLoading(false);
        setStage('complete');
        return;
      }
    } catch (e) {
      // Ignore storage errors in restricted browser environments
    }

    // Set initial window size
    if (typeof window !== 'undefined') {
      setDimension({
        width: window.innerWidth || 1200,
        height: window.innerHeight || 800,
      });

      const handleResize = () => {
        setDimension({
          width: window.innerWidth || 1200,
          height: window.innerHeight || 800,
        });
      };
      window.addEventListener('resize', handleResize);

      // Hard safety timer: Guaranteed unmount after 2.6 seconds total
      const hardSafetyTimer = setTimeout(() => {
        setIsLoading(false);
        setStage('complete');
        try {
          sessionStorage.setItem('hasSeenHelloPreloader', 'true');
        } catch (e) {}
      }, 2600);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(hardSafetyTimer);
      };
    }
  }, []);

  // Stage 1: Fast counter progress (0% -> 100%)
  useEffect(() => {
    if (stage !== 'counter') return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage('greeting'), 100);
          return 100;
        }
        return prev + 12;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [stage]);

  // Stage 2: Greeting text cycling
  useEffect(() => {
    if (stage !== 'greeting') return;

    let index = 0;
    const greetingTimer = setInterval(() => {
      index++;
      if (index < GREETINGS.length) {
        setGreetingIndex(index);
      } else {
        clearInterval(greetingTimer);
        // Step to exiting stage
        setStage('exiting');
        try {
          sessionStorage.setItem('hasSeenHelloPreloader', 'true');
        } catch (e) {}
      }
    }, 150);

    return () => clearInterval(greetingTimer);
  }, [stage]);

  // Stage 3: Slide exit transition to complete
  useEffect(() => {
    if (stage === 'exiting') {
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        setStage('complete');
      }, 550);
      return () => clearTimeout(exitTimer);
    }
  }, [stage]);

  // Unmount completely if not loading or stage is complete
  if (!isLoading || stage === 'complete') return null;

  // SVG curve morph paths
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} Z`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} 0 Q${dimension.width / 2} 0 0 0 Z`;

  const curveAnimation = {
    initial: {
      d: initialPath,
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const, delay: 0.05 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0c] text-[#f1e7dd] selection:bg-transparent overflow-hidden"
        style={{ pointerEvents: stage === 'exiting' ? 'none' : 'auto' }}
        initial={{ opacity: 1, y: 0 }}
        animate={stage === 'exiting' ? { y: '-100%' } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Main Preloader Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <AnimatePresence mode="wait">
            {stage === 'counter' && (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center space-y-5"
              >
                {/* Percentage Counter */}
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#f1e7dd] font-mono">
                  {Math.round(progress)}%
                </span>

                {/* Circular Arc Loader */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="rgba(241, 231, 221, 0.15)"
                      strokeWidth="3.5"
                      fill="none"
                    />
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
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center min-h-[120px]"
              >
                <motion.h1
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.12 }}
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
              animate={stage === 'exiting' ? 'exit' : 'initial'}
            />
          </svg>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
