import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function SettingsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      {/* Background Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-black/80 border border-green-400/60 rounded-lg 
                   shadow-[0_0_30px_#00ff99a0] p-6 w-[700px] h-[450px] 
                   flex flex-col items-center justify-center text-green-400"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-green-400 hover:text-red-400 
                     transition-colors duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Empty Center Space */}
        <div className="flex flex-col items-center justify-center h-full text-lg font-mono tracking-wide">
          <p className="text-green-400/70 animate-pulse">
            Settings Panel (Under Construction)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
