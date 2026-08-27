import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

export default function OrbitAlert({
  show,
  type = "info",
  title = "ORBIT",
  message = "",
  duration = 4000,
  onClose,
}) {
  const Icon = icons[type] || Info;

  useEffect(() => {
    if (!show || !duration) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: -30,
            scale: 0.95,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="
            fixed
            top-5
            right-5
            z-[99999]
            w-[360px]
          "
        >
          <div
            className={`
              relative
              overflow-hidden
              rounded-xl
              border
              bg-[#08171a]/95
              backdrop-blur-xl
              shadow-2xl
              ${
                type === "success"
                  ? "border-green-400/40 shadow-green-400/10"
                  : type === "warning"
                  ? "border-yellow-400/40 shadow-yellow-400/10"
                  : type === "error"
                  ? "border-red-400/40 shadow-red-400/10"
                  : "border-cyan-400/40 shadow-cyan-400/10"
              }
            `}
          >
            {/* Top scanning line */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.4,
                ease: "linear",
              }}
              className={`
                absolute
                top-0
                left-0
                h-[1px]
                w-full
                ${
                  type === "success"
                    ? "bg-green-400"
                    : type === "warning"
                    ? "bg-yellow-400"
                    : type === "error"
                    ? "bg-red-400"
                    : "bg-cyan-400"
                }
              `}
            />

            <div className="flex gap-3 p-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-black/30
                  ${
                    type === "success"
                      ? "text-green-400"
                      : type === "warning"
                      ? "text-yellow-400"
                      : type === "error"
                      ? "text-red-400"
                      : "text-cyan-400"
                  }
                `}
              >
                <Icon size={21} />
              </motion.div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-mono text-sm font-semibold tracking-widest text-cyan-200">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs font-mono text-slate-400">
                      {message}
                    </p>
                  </div>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="
                      shrink-0
                      text-slate-500
                      transition
                      hover:text-red-400
                      cursor-pointer
                    "
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t border-white/5 px-4 py-2">
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  animate-pulse
                  ${
                    type === "success"
                      ? "bg-green-400"
                      : type === "warning"
                      ? "bg-yellow-400"
                      : type === "error"
                      ? "bg-red-400"
                      : "bg-cyan-400"
                  }
                `}
              />

              <span className="font-mono text-[9px] tracking-widest text-slate-600">
                ORBIT SYSTEM NOTIFICATION
              </span>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: duration / 1000,
                  ease: "linear",
                }}
                className={`
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  ${
                    type === "success"
                      ? "bg-green-400"
                      : type === "warning"
                      ? "bg-yellow-400"
                      : type === "error"
                      ? "bg-red-400"
                      : "bg-cyan-400"
                  }
                `}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}