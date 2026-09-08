'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LiquidTextHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [displacementScale, setDisplacementScale] = useState(0);
  const [baseFreq, setBaseFreq] = useState(0.012);
  const requestRef = useRef<number | null>(null);

  // Animate liquid wave distortion on hover
  useEffect(() => {
    let targetScale = isHovered ? 45 : 0;
    let targetFreq = isHovered ? 0.035 : 0.012;

    const animate = () => {
      setDisplacementScale((prev) => {
        const diff = targetScale - prev;
        return Math.abs(diff) < 0.2 ? targetScale : prev + diff * 0.12;
      });

      setBaseFreq((prev) => {
        const diff = targetFreq - prev;
        return Math.abs(diff) < 0.0005 ? targetFreq : prev + diff * 0.12;
      });

      if (Math.abs(targetScale - displacementScale) > 0.1 || isHovered) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHovered, displacementScale]);

  return (
    <section className="relative w-full min-h-[calc(100vh-68px)] bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-8 pb-6 sm:pt-12 sm:pb-8 select-none">
      
      {/* SVG Liquid Distortion Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquid-wave-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${baseFreq} ${baseFreq * 1.5}`}
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Background High-Tech Ambient Neon Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#EC170F]/15 blur-[140px]" />
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#0B3B9B]/20 blur-[160px]" />
        <div className="absolute -bottom-[10%] left-[30%] w-[450px] h-[450px] rounded-full bg-[#EC170F]/10 blur-[120px]" />
        
        {/* Subtle Background Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(120, 120, 120, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Top Tagline Pill - Positioned Exactly Halfway In Between Navbar & Headline */}
      <div className="relative z-10 w-full flex justify-center pt-12 sm:pt-16 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-md transition-colors duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-[#EC170F] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[var(--text-primary)] uppercase">
            Tech Team Portfolio • 2026 Edition
          </span>
        </motion.div>
      </div>

      {/* Main Center Headline Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-2 sm:py-4 w-full">
        
        {/* Giant Ultra-Tall Condensed Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1
            className="font-condensed text-[9.5vw] sm:text-[10.5vw] md:text-[11.5vw] leading-[0.84] tracking-[0.02em] font-extrabold uppercase transition-all duration-300 drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
            style={{
              filter: displacementScale > 0.5 ? 'url(#liquid-wave-filter)' : 'none',
              transform: isHovered ? 'scale(1.015)' : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-primary)] via-[var(--text-secondary)] to-slate-400">
              CREATIVE
            </span>{' '}
            <span className="text-[#EC170F] drop-shadow-[0_0_25px_rgba(236,23,15,0.4)]">
              ENGINEERING
            </span>
            <br />
            <span className="text-[var(--text-primary)]">
              THE NEXT IDEA<span className="text-[#EC170F]">.</span>
            </span>
          </h1>

          {/* Subtitle banner */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B3B9B]" />
            <span className="font-mono text-xs sm:text-sm text-[var(--text-secondary)] tracking-widest uppercase">
              Student-Driven Studio • Build • Compete • Deliver
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC170F]" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Metadata Tags & Rotating Stamp Badge */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--border-subtle)]">
        
        {/* Left: Location & Copyright */}
        <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
          <span>© 2026 TECH TEAM</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
          <span className="text-[var(--text-primary)]">WE BUILD • WE COMPETE • WE DELIVER</span>
        </div>

        {/* Center: Minimal Pill Badges */}
        <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)]">
          <span className="hover:text-[#EC170F] transition-colors cursor-pointer">VISUALS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EC170F]" />
          <span className="hover:text-[#EC170F] transition-colors cursor-pointer">CODE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B9B]" />
          <span className="hover:text-[#EC170F] transition-colors cursor-pointer">EXPERIENCE</span>
        </div>

        {/* Right: Rotating Circular Stamp Badge */}
        <div className="relative flex items-center justify-center">
          <Link href="/projects" className="group relative block w-24 h-24 sm:w-28 sm:h-28">
            {/* Spinning Text SVG */}
            <motion.svg
              className="w-full h-full text-[var(--text-primary)] group-hover:text-[#EC170F] transition-colors"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              <path
                id="stampCirclePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="text-[10.5px] font-mono font-bold tracking-widest uppercase fill-current">
                <textPath xlinkHref="#stampCirclePath">
                  SCROLL TO EXPLORE • WORK WITH US •
                </textPath>
              </text>
            </motion.svg>

            {/* Inner Icon Arrow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-[var(--border-default)] group-hover:border-[#EC170F] group-hover:bg-[#EC170F]/10 flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4 text-[var(--text-primary)] group-hover:text-[#EC170F] group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

      </div>

    </section>
  );
}
