import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SystemContext from "../Context/orbitContext";
import { useContext } from "react";

export default function AIProcessPanel() {
  const containerRef = useRef(null);

  const { logs } = useContext(SystemContext);

  // -----------------------------
  // Auto scroll
  // -----------------------------
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="
        w-full
        h-full
        bg-black/50
        border border-green-500/40
        rounded-md
        shadow-[0_0_10px_#00ff99]
        p-3
        font-mono
        text-xs
        overflow-hidden
        backdrop-blur-sm
        select-none
      "
    >
      <h3 className="text-green-400 font-semibold mb-2 tracking-widest">
        AI ACTIVITY MONITOR
      </h3>

      <div
        ref={containerRef}
        className="
          h-[calc(100%-28px)]
          overflow-y-auto
          text-green-300
          space-y-1
          scrollbar-custom
        "
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="text-[11px] leading-tight"
            >
              <span className="text-green-500">
                [{log.timestamp}]
              </span>{" "}
              <span>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}