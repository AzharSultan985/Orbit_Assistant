import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIProcessPanel({ state }) {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  const logTemplates = {
    idle: [
      "System idle... awaiting voice input.",
      "Background optimization running...",
      "Neural cores in standby mode.",
      "Listening module warmed up.",
      "Environment scan complete.",
      "Low-power diagnostic check passed.",
    ],
    listening: [
      "Voice input channel opened.",
      "Audio normalization active...",
      "Detecting tone and frequency...",
      "Speech-to-text engine ready.",
      "Signal clarity: High.",
    ],
    thinking: [
      "Analyzing intent vectors...",
      "Fetching relevant datasets...",
      "Optimizing neural inference...",
      "Processing logic layers...",
      "Cognitive sequence in progress...",
    ],
    responding: [
      "Compiling natural response...",
      "Refining context embeddings...",
      "Applying language optimization...",
      "Generating structured text...",
      "Dispatching AI response...",
    ],
  };

  // Function to auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Random log generation based on state
  useEffect(() => {
    let interval;
    if (state) {
      interval = setInterval(() => {
        const randomLogs =
          logTemplates[state][
            Math.floor(Math.random() * logTemplates[state].length)
          ];
        setLogs((prev) => [
          ...prev.slice(-10),
          `[${new Date().toLocaleTimeString()}] ${randomLogs}`,
        ]);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div
      className="
                 w-120 h-45 bg-black/50 border border-green-500/40 rounded-md
                 shadow-[0_0_10px_#00ff99] p-3 font-mono text-xs overflow-hidden
                 backdrop-blur-sm select-none"
    >
      <h3 className="text-green-400 font-semibold mb-1 tracking-widest">
        🧠 AI Activity Monitor
      </h3>

      <div
        ref={containerRef}
        className=" overflow-y-auto text-green-300 space-y-0.5  "
      >
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] leading-tight"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
