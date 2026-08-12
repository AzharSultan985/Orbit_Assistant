import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSystem } from "../Context/orbitContext";

export default function OrbitRes() {
  const [userPrompt, setUserPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const containerRef = useRef(null);

  const { sendOrbitMessage ,orbitResponse} = useSystem();

  // ==============================
  // AUTO SCROLL
  // ==============================

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [messages]);
useEffect(() => {

    if (!orbitResponse) {
        return;
    }

    setMessages((prev) => [
        ...prev,
        orbitResponse,
    ]);

}, [orbitResponse]);
  // ==============================
  // SEND
  // ==============================

  const handleSend = () => {
    const text = userPrompt.trim();

    if (!text) return;

    // Show immediately in UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text,
      },
    ]);

    // Send to Node through Socket.IO
    sendOrbitMessage(text);

    // Clear input
    setUserPrompt("");
  };

  return (
    <section className="relative w-full h-full bg-[#0c1c1f] overflow-hidden flex flex-col">

      {/* ==============================
          TOP
      ============================== */}

      <div className="shrink-0 px-4 pt-4">
        <h2
          className="
            font-mono
            text-xl
            font-extrabold
            text-cyan-300
            tracking-widest
            drop-shadow-[0_0_8px_#00ffd1,0_0_18px_#00ffe7]
          "
        >
          ORBIT
        </h2>
      </div>

      {/* ==============================
          MESSAGES
      ============================== */}

      <div
        ref={containerRef}
        className="
          flex-1
          min-h-0
          overflow-y-auto
          px-4
          py-4
          space-y-3
          scrollbar-custom
        "
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`
                max-w-[80%]
                px-4
                py-2.5
                rounded-2xl
                font-mono
                text-sm
                leading-relaxed
                whitespace-pre-wrap
                ${
                  message.type === "user"
                    ? "bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 rounded-br-sm"
                    : "bg-green-500/10 border border-green-400/30 text-green-300 rounded-bl-sm"
                }
              `}
            >
              {message.text}
            </motion.div>
          </div>
        ))}
      </div>

      {/* ==============================
          INPUT
      ============================== */}

      <div className="shrink-0 p-3 border-t border-[#28bebe]/30">
        <div className="flex gap-2">

          <input
            type="text"
            value={userPrompt}
            onChange={(e) =>
              setUserPrompt(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Ask Orbit..."
            className="
              flex-1
              min-w-0
              h-10
              px-3
              rounded-xl
              bg-black/40
              border
              border-[#28bebe]/50
              text-cyan-200
              placeholder:text-slate-600
              outline-none
              font-mono
              text-sm
              focus:border-cyan-400
              focus:shadow-[0_0_10px_rgba(0,255,209,0.2)]
            "
          />

          <button
            onClick={handleSend}
            className="
              h-10
              px-4
              shrink-0
              rounded-xl
              border
              border-green-400/70
              text-green-400
              font-mono
              text-sm
              hover:bg-green-400
              hover:text-black
              transition-all
            "
          >
            Send
          </button>

        </div>
      </div>

    </section>
  );
}