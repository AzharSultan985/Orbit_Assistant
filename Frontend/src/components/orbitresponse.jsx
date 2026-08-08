import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ChooseMIC_Lis from "../chooseMIC";

export default function OrbitRes() {
  
  const [displayedText, setDisplayedText] = useState("");
  const containerRef = useRef(null);

  // Full response text (can be multi-line & long)
  const response = `
      No Response yet
`;

  // Typing effect logic
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + response.charAt(i));
      i++;
      if (i >= response.length) clearInterval(interval);
    }, 40); // typing speed (ms per letter)
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom whenever text updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText]);

  // Sparkles generator
  const Sparkles = ({ count = 10 }) =>
    [...Array(count)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full bg-cyan-300"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          boxShadow: "0 0 6px #00ffe7",
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.8 + Math.random() * 2,
          delay: Math.random() * 2,
        }}
      />
    ));

  return (
    <>
    <section className="relative border h-[50vh] w-[50vh] bg-[#0c1c1f] shadow-[0_0_30px_rgba(0,255,209,0.25)] overflow-hidden border-[#28bebe] rounded-[10px] p-4 flex flex-col">
      {/* sparkles layer */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles count={16} />
      </div>

      {/* ORBIT title */}
      <h2
        className="font-mono text-1xl font-extrabold text-cyan-300 tracking-widest relative z-10 
                   drop-shadow-[0_0_8px_#00ffd1,0_0_18px_#00ffe7] animate-pulse"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        ORBIT
      </h2>

      {/* RESPONSE heading */}
      <motion.h2
        className="mt-1 font-mono text-lg text-green-400 relative z-10 
                   tracking-widest drop-shadow-[0_0_6px_#00ff99]"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        RESPONSE :
      </motion.h2>

      {/* Scrollable response area */}
  <div ref={containerRef}
  className=" overflow-y-auto mt-[-8px]  z-10 scrollbar-custom">

  <p
    className="font-mono text-sm leading-relaxed text-green-300 whitespace-pre-wrap
               "
    style={{ fontFamily: '"JetBrains Mono", monospace' }}
  >
    {displayedText}
    {/* Blinking cursor */}
    <motion.span
      className="ml-1 inline-block w-2 h-4 bg-green-400 align-middle"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    />
  </p>
</div>

    </section>

</>
  );
}
