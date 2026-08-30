
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSystem } from "../Context/orbitContext";
import { Maximize2, Minimize2 } from "lucide-react";
import MarkdownRenderer from "./markdownRender";

export default function OrbitRes() {
  const [userPrompt, setUserPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const containerRef = useRef(null);

  const {
    sendOrbitMessage,
    orbitResponse,
    messages,
    setMessages,
    orbitMaximized,
    setOrbitMaximized,
  } = useSystem();

  // ==============================
  // AUTO SCROLL
  // ==============================

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [messages]);

  // ==============================
  // ORBIT RESPONSE
  // ==============================

  useEffect(() => {
    if (!orbitResponse) return;

    setIsThinking(false);

    setMessages((prev) => [
      ...prev,
      orbitResponse,
    ]);
  }, [orbitResponse, setMessages]);

  // ==============================
  // MAXIMIZE
  // ==============================

  const toggleMaximise = useCallback(() => {
    setOrbitMaximized((prev) => !prev);
  }, [setOrbitMaximized]);

  // ==============================
  // SEND
  // ==============================

  const handleSend = () => {
    const text = userPrompt.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text,
      },
    ]);

    setIsThinking(true);

    sendOrbitMessage(text);

    setUserPrompt("");
  };
  const textareaRef = useRef(null);
  // Auto-expand textarea 
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 180;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [userPrompt]);
  return (
    <section
      className="
        relative
        w-full
        h-full
        overflow-hidden
        flex
        flex-col

        bg-transparent
    border-l
   border-white/[0.08]
        text-slate-200
      "
    >

      {/* =========================================
          SUBTLE BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -top-40
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[300px]
          rounded-full
          bg-none
          blur-[120px]
        "
      />

      {/* =========================================
          HEADER
      ========================================= */}

      <div
        className="
          relative
          z-10
          shrink-0
          px-5
          pt-4
          pb-3
          flex
          justify-between
          items-center

          border-b
          border-white/[0.06]

          bg-none
          backdrop-blur-md
        "
      >

        <div className="flex items-center gap-3">

          {/* Orbit indicator */}

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              w-4
              h-4
              rounded-full
              bg-emerald-500
              shadow-[0_0_10px_rgba(96,165,250,0.9)]
            "
          />

          <h2
            className="
              font-mono
              text-lg
              font-semibold
              tracking-[0.25em]

              text-slate-100
            "
          >
            ORBIT
          </h2>

        </div>

        <button
          onClick={toggleMaximise}
          className="
            p-2
            rounded-lg
            cursor-pointer

            text-slate-500

            hover:text-slate-200
            hover:bg-white/[0.06]

            transition-all
            duration-200
          "
        >
          {orbitMaximized ? (
            <Minimize2 size={18} />
          ) : (
            <Maximize2 size={18} />
          )}
        </button>

      </div>


      {/* =========================================
          MESSAGES
      ========================================= */}

      <div
        ref={containerRef}
        className="
          relative
          z-10
          flex-1
          min-h-0
          overflow-y-auto

          px-4
          md:px-6
          py-5

          space-y-5

          scrollbar-custom
        "
      >

        {messages?.map((message, index) => (

          <div
            key={message._id || message.id || index}
            className={`flex ${message.type === "user"
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
              transition={{
                duration: 0.25,
              }}
              className={`
                max-w-[85%]
                md:max-w-[75%]

                px-4
                py-3

                rounded-2xl

                font-mono
                text-sm
                leading-relaxed

                border

                ${message.type === "user"
                  ? `
                      bg-blue-500/[0.08]
                      border-blue-400/[0.18]

                      text-slate-100

                      rounded-br-md

                      shadow-[0_0_20px_rgba(59,130,246,0.04)]
                    `
                  : `
                      bg-white/[0.025]
                      border-white/[0.07]

                      text-slate-300

                      rounded-bl-md
                    `
                }
              `}
            >

              <MarkdownRenderer
                content={message.text}
              />

            </motion.div>

          </div>

        ))}


        {/* =========================================
            THINKING
        ========================================= */}

        {isThinking && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex justify-start"
          >

            <div
              className="
                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-2xl
                rounded-bl-md

                bg-violet-500/[0.06]

                border
                border-violet-400/[0.14]

                text-violet-300
              "
            >

              {/* Orbit animation */}

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  relative
                  w-5
                  h-5
                  rounded-full

                  border
                  border-violet-400/30
                "
              >

                <span
                  className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2

                    w-1.5
                    h-1.5

                    rounded-full

                    bg-violet-400

                    shadow-[0_0_8px_rgba(167,139,250,0.9)]
                  "
                />

              </motion.div>


              {/* Thinking dots */}

              <div className="flex items-center gap-1">

                {[0, 1, 2].map((i) => (

                  <motion.span
                    key={i}
                    className="
                      w-1.5
                      h-1.5
                      rounded-full

                      bg-violet-400
                    "
                    animate={{
                      opacity: [0.25, 1, 0.25],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />

                ))}

              </div>

              <span
                className="
                  text-xs
                  text-slate-500
                  font-mono
                "
              >
                Orbit is thinking
              </span>

            </div>

          </motion.div>

        )}

      </div>


      {/* =========================================
          INPUT
      ========================================= */}
      <div
        className="
    relative
    z-10
    shrink-0
    w-full
    px-3
    pb-3
    pt-2
    md:px-5
    md:pb-5
     
           bg-transparent

    backdrop-blur-xl
  "
      >
        <div
          className="
      mx-auto
      w-full
      max-w-4xl

      flex
      items-end
      gap-2

      rounded-2xl

      bg-none

      border
      border-white/[0.08]

      shadow-[0_8px_30px_rgba(0,0,0,0.25)]

      focus-within:border-blue-400/30
      focus-within:shadow-[0_0_25px_rgba(59,130,246,0.06)]

      transition-all
      duration-200
    "
        >

          {/* TEXTAREA */}

          <textarea
            ref={textareaRef}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Message Orbit..."
            className="
        flex-1
        min-w-0
        max-h-[180px]

        px-4
        py-3

        resize-none
        overflow-y-auto

        bg-transparent

        text-[15px]
        leading-6
        text-slate-200

        placeholder:text-slate-500

        outline-none

        font-sans

        scrollbar-custom
      "
          />

          {/* SEND BUTTON */}

          <button
            onClick={handleSend}
            disabled={!userPrompt.trim()}
            className="
        m-2

        shrink-0

        w-9
        h-9

        flex
        items-center
        justify-center

        rounded-xl

        bg-emerald-500

        text-white

        shadow-[0_0_15px_rgba(59,130,246,0.15)]
cursor pointer
        hover:bg-blue-400
        hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]

        disabled:bg-white/[0.06]
        disabled:text-slate-600
        disabled:shadow-none

        disabled:cursor-not-allowed

        transition-all
        duration-200
      "
            aria-label="Send message"
          >
            ↑
          </button>

        </div>
      </div>


    </section>
  );
}
