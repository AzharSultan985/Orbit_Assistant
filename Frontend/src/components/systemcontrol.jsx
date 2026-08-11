import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Settings } from "lucide-react";
import SettingsModal from "./settingmodal";
import SystemContext from "../Context/orbitContext";

export default function NetworkAndSettings() {
  const [open, setOpen] = useState(false);

  const { systemInfo } = useContext(SystemContext);

  // Network information from backend
  const signal = systemInfo?.network?.signal ?? 0;

  // Signal greater than 0 = connected
  const online = signal > 0;

  return (
    <div className="transform -translate-y-1/2 mt-8">

      <div
        className="
          flex items-center justify-between gap-6
          border border-green-400
          bg-black/40 backdrop-blur-sm
          shadow-[0_0_5px_#00ff99]
          rounded-sm
          px-4 py-2
          w-75
        "
      >

        {/* Settings */}
        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2
            text-green-400
            hover:text-cyan-300
            transition-colors duration-200
          "
        >
          <Settings className="w-5 h-5 animate-spin-slow" />

          <span className="font-mono text-sm tracking-wider">
            Settings
          </span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-green-500/50" />

        {/* Network */}
        <div className="flex items-center gap-2">

          {online ? (
            <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500 animate-pulse" />
          )}

          <motion.span
            key={online ? "connected" : "offline"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`font-mono text-sm ${
              online
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {online ? "Connected" : "No Internet"}
          </motion.span>

        </div>

      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {open && (
          <SettingsModal
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}