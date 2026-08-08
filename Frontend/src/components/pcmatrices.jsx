import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PcMetrics() {
  const [metrics, setMetrics] = useState({ cpu: 22, ram: 48, disk: 66 });

  // simulate metric updates (replace with backend data later)
  useEffect(() => {
    const id = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 100),
        ram: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);


  const MetricBox = ({ title, value, color }) => (
    <div className="relative bg-black/50 border border-cyan-400/30 rounded-xl p-2 h-25
    w-[150px]   shadow-[0_0_20px_rgba(0,255,209,0.15)] overflow-hidden">
      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-cyan-400"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            boxShadow: "0 0 8px #00ffd1",
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Title */}
      <h2 className="text-cyan-300 font-mono text-sm tracking-widest uppercase relative z-10">
        {title}
      </h2>

      {/* Value */}
      <div className="relative z-10 mt-0 mx-2 flex items-center justify-between">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-3xl text-cyan-100"
        >
          {value}%
        </motion.span>

        {/* Bar */}
        <div className="w-32 h-3  bg-gray-800/40 rounded-full border border-cyan-400/20 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-2  bg-black">
      <MetricBox title="CPU Usage" value={metrics.cpu} color="bg-gradient-to-r from-cyan-400 to-purple-600" />
      <MetricBox title="RAM Usage" value={metrics.ram} color="bg-gradient-to-r from-green-400 to-cyan-500" />
      <MetricBox title="Disk Usage" value={metrics.disk} color="bg-gradient-to-r from-pink-500 to-cyan-400" />
    </div>
  );
}
