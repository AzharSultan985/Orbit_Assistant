import React, { useState } from "react";
import { motion } from "framer-motion";
import SystemContext from "../Context/orbitContext";
import { useContext } from "react";

export default function OrbitFace() {
  const { OrbitMode, setOrbitMode } =useContext(SystemContext);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Head Circle */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border-2 border-green-400 shadow-[0_0_30px_#00ff99] backdrop-blur-sm"
          animate={OrbitMode === "thinking" ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />

        {/* Idle Core Glow */}
        {OrbitMode === "idle" && (
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 blur-xl opacity-70"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        {/* Listening Pulse */}
        {OrbitMode === "listening" && (
          <motion.div
            className="absolute w-24 h-24 rounded-full border border-cyan-400/50"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Thinking Animation (3D energy rings) */}
        {OrbitMode === "thinking" && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-green-400/40"
                style={{ width: `${100 - i * 20}%`, height: `${100 - i * 20}%` }}
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                  borderColor: ["#00ff99", "#00ffff", "#00ff99"],
                }}
                transition={{ repeat: Infinity, duration: 5 + i * 2, ease: "linear" }}
              />
            ))}
          </>
        )}

        {/* Eyes */}
        <div className="flex gap-12">
          <motion.div
            className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00ffff]"
            animate={OrbitMode === "listening" ? { scale: [1, 1.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.div
            className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00ffff]"
            animate={OrbitMode === "listening" ? { scale: [1, 1.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
        </div>

        {/* Response Wave */}
        {OrbitMode === "speaking" && (
          <motion.div
            className="absolute bottom-0 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-green-400 rounded"
                style={{ height: "10px" }}
                animate={{
                  height: ["10px", "30px", "10px"],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Static ORBIT Text */}
        {/* <h2 className="absolute text-green-400 font-mono text-xl tracking-widest drop-shadow-[0_0_10px_#00ff99]">
          ORBIT
        </h2> */}
      </div>

      {/* Control Buttons */}
      {/* <div className="mt-6 flex gap-3">
        <button onClick={() => setOrbitMode("idle")} className="px-3 py-1 border border-gray-600 text-xs hover:text-green-400">Idle</button>
        <button onClick={() => setOrbitMode("listening")} className="px-3 py-1 border border-green-500 text-xs hover:text-green-400">Listening</button>
        <button onClick={() => setOrbitMode("thinking")} className="px-3 py-1 border border-cyan-500 text-xs hover:text-cyan-400">Thinking</button>
        <button onClick={() => setOrbitMode("responding")} className="px-3 py-1 border border-blue-500 text-xs hover:text-blue-400">Responding</button>
      </div> */}
    </div>
  );
}