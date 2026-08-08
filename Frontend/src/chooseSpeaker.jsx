import React from "react";

export default function ChooseSpeak() {
  return (
    <div>
      <label className="relative flex items-center justify-center cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors duration-300">
        {/* Hidden checkbox */}
        <input type="checkbox" className="peer hidden" />

        {/* Speak OFF (Idle) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 absolute text-red-500 peer-checked:hidden drop-shadow-[0_0_5px_#ff4444]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zM128 256c0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128-128-57.3-128-128z" />
        </svg>

        {/* Speak ON (Active) with animated waves */}
        <div className="hidden peer-checked:flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_10px_#00eaff]"
            fill="currentColor"
            viewBox="0 0 384 512"
          >
            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96z" />
          </svg>

          {/* Animated sound waves */}
          <span className="absolute flex space-x-1">
            <span className="w-1 h-3 bg-cyan-400 rounded-sm animate-[pulse_1s_ease-in-out_infinite]"></span>
            <span className="w-1 h-5 bg-cyan-400 rounded-sm animate-[pulse_1.2s_ease-in-out_infinite]"></span>
            <span className="w-1 h-4 bg-cyan-400 rounded-sm animate-[pulse_1.4s_ease-in-out_infinite]"></span>
          </span>
        </div>
      </label>
    </div>
  );
}
