import React from "react";
import { motion } from "framer-motion";
import { Orbit } from "lucide-react";

export default function OrbitLoader({
  text = "ORBIT IS THINKING",
  fullscreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center">
      {/* Orbit Icon */}
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-400/30"
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating ring */}
        <motion.div
          className="
            absolute
            inset-1
            rounded-full
            border
            border-dashed
            border-cyan-400/60
          "
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Orbit
            size={28}
            strokeWidth={1.5}
            className="text-cyan-300"
          />
        </motion.div>
      </div>

      {/* Text */}
      <div className="mt-4 flex items-center gap-1">
        <span className="font-mono text-xs tracking-[0.25em] text-cyan-300">
          {text}
        </span>

        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
          className="text-cyan-400"
        >
          .
        </motion.span>

        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            repeat: Infinity,
          }}
          className="text-cyan-400"
        >
          .
        </motion.span>

        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            repeat: Infinity,
          }}
          className="text-cyan-400"
        >
          .
        </motion.span>
      </div>

      {/* Status */}
      <motion.div
        animate={{
          opacity: [0.35, 0.8, 0.35],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="
          mt-2
          font-mono
          text-[9px]
          tracking-widest
          text-cyan-400/40
        "
      >
        PROCESSING REQUEST
      </motion.div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#061114]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}