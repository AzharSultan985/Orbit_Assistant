import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onFinish = () => {} }) {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(1); // glitch
      setTimeout(() => {
        setPhase(2); // explode
        setTimeout(() => {
          setShow(false);
          setTimeout(onFinish, 500);
        }, 1200);
      }, 800);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Heavy scan lines + CRT effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`scan-${i}`}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent h-px"
              style={{ top: `${i * 5}%` }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 + i * 0.01 }}
            />
          ))}
          
          {/* CRT curve overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/50 via-transparent to-transparent" />

          {/* HACKER TERMINAL GRID */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, x) => (
              <div key={`grid-v-${x}`} className="absolute inset-0 bg-green-900/50" style={{ left: `${x * 8.33}%` }} />
            ))}
            {[...Array(20)].map((_, y) => (
              <div key={`grid-h-${y}`} className="absolute inset-0 bg-green-900/50 h-px" style={{ top: `${y * 5}%` }} />
            ))}
          </div>

          {/* PURE HACKER LOGO - DARK RING + PLANET */}
          <motion.div
            className="relative w-[340px] h-[340px]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            {/* SINGLE DARK HACKER RING */}
            <motion.svg
              width="340"
              height="340"
              viewBox="0 0 340 340"
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            >
              <circle
                cx="170"
                cy="170"
                r="145"
                fill="none"
                stroke="url(#darkHackGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="900 150"
                className="drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]"
              />
              <defs>
                <linearGradient id="darkHackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.85" />
                  <stop offset="30%" stopColor="#0891b2" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#ec4899" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.85" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* HACKER PLANET - REVOLVING ON RING */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            >
              <div 
                className="w-22 h-22 ml-[145px] rounded-full bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-800 shadow-[0_0_35px_rgba(34,197,94,0.7)] border-2 border-emerald-500/80 overflow-hidden relative"
                style={{ transform: 'translateX(50%)' }}
              >
                {/* Hacker matrix shine */}
                <div className="absolute w-10 h-10 bg-gradient-to-r from-white/30 to-transparent rounded-full top-0 right-0" />
                <div className="absolute w-8 h-8 bg-white/20 rounded-full bottom-1 left-1" />
                
                {/* Dark glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-600/50 shadow-[0_0_25px_rgba(34,197,94,0.6)]"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 2.8 }}
                />
              </div>

              {/* Dark trail */}
              <motion.div 
                className="absolute w-48 h-1 bg-gradient-to-r from-transparent via-emerald-600/60 to-transparent top-1/2 -left-48 rounded-full"
                animate={{ scaleX: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                style={{ transformOrigin: "right center" }}
              />
            </motion.div>

            {/* Glitch distortion */}
            {phase === 1 && (
              <motion.div
                className="absolute inset-0 bg-green-900/30 rounded-full"
                animate={{ 
                  scaleX: [1, 1.05, 0.95, 1.02, 1],
                  skewX: [-2, 3, -1, 2, 0]
                }}
                transition={{ duration: 0.08, repeat: 12, repeatDelay: 0.06 }}
              />
            )}
          </motion.div>

          {/* HACKER TERMINAL - DARK MODE */}
          <motion.div
            className="absolute bottom-8 px-8 py-5 bg-black/95 border border-emerald-800/60 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.4)]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-center text-sm font-mono text-emerald-400/90 tracking-wider">
              <span className="w-3 h-3 bg-emerald-600 rounded-full shadow-emerald-600/50 animate-pulse mr-4"></span>
              <span className="font-bold">root@orbit:</span>
              <span className="text-emerald-500 ml-1">~#</span>
              <span className="ml-auto text-cyan-400 font-bold tracking-widest">● LIVE</span>
            </div>
            <div className="text-xs text-emerald-500/70 mt-2 font-mono tracking-wider">
              [ NEURAL CORE v4.2 | Azhar Sultan ]
            </div>
          </motion.div>

          {/* HACKER BURST EXIT */}
          {phase === 2 && (
            [...Array(60)].map((_, i) => (
              <motion.div
                key={`exp-${i}`}
                className={`absolute w-1.5 h-1.5 rounded-full shadow-lg top-1/2 left-1/2 ${
                  i % 4 === 0 ? 'bg-emerald-600 shadow-emerald-600/70' :
                  i % 4 === 1 ? 'bg-emerald-500 shadow-emerald-500/70' :
                  i % 4 === 2 ? 'bg-cyan-600 shadow-cyan-600/70' :
                  'bg-pink-600 shadow-pink-600/70'
                }`}
                animate={{
                  x: Math.cos(i * 0.2) * (150 + i * 2),
                  y: Math.sin(i * 0.2) * (150 + i * 2),
                  opacity: [1, 0],
                  scale: [1, 2.2]
                }}
                transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.015 }}
              />
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
