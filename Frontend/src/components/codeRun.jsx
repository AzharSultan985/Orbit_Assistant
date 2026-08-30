import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Code2 } from "lucide-react";

export default function CodeRun() {
  const location = useLocation();
  const navigate = useNavigate();

  const { code, language } = location.state || {};

  // ==========================================
  // NO CODE
  // ==========================================

  if (!code) {
    return (
      <div className="min-h-screen bg-[#080b10] text-slate-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">
            No code provided.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="
              px-4
              py-2
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.03]
              text-slate-300
              hover:bg-white/[0.07]
              transition
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const normalizedLanguage =
    language?.toLowerCase() || "text";

  // ==========================================
  // SVG
  // ==========================================

  if (normalizedLanguage === "svg") {
    return (
      <div className="min-h-screen bg-[#080b10] text-slate-200">

        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-20
            h-14
            px-4
            flex
            items-center
            justify-between
            border-b
            border-white/[0.07]
            bg-[#080b10]/90
            backdrop-blur-xl
          "
        >

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(-1)}
              className="
                p-2
                rounded-lg
                text-slate-400
                hover:text-white
                hover:bg-white/[0.06]
                transition
              "
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2">

              <Code2
                size={17}
                className="text-blue-400"
              />

              <div>
                <h1 className="text-sm font-medium">
                  Run Code
                </h1>

                <p className="text-[10px] text-slate-500 uppercase">
                  SVG Preview
                </p>
              </div>

            </div>

          </div>

          <span
            className="
              px-2.5
              py-1
              rounded-md
              bg-blue-400/[0.08]
              border
              border-blue-400/20
              text-[10px]
              font-mono
              text-blue-300
              uppercase
            "
          >
            SVG
          </span>

        </div>


        {/* SVG PREVIEW */}

        <div className="p-4 md:p-8">

          <div
            className="
              min-h-[500px]
              rounded-2xl
              border
              border-white/[0.08]
              bg-white
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >

            <div
              className="
                max-w-full
                max-h-full
                flex
                items-center
                justify-center
              "
              dangerouslySetInnerHTML={{
                __html: code,
              }}
            />

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // OTHER LANGUAGES
  // ==========================================

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-200">

      {/* HEADER */}

      <div
        className="
          sticky
          top-0
          z-20
          h-14
          px-4
          flex
          items-center
          justify-between
          border-b
          border-white/[0.07]
          bg-[#080b10]/90
          backdrop-blur-xl
        "
      >

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="
              p-2
              rounded-lg
              text-slate-400
              hover:text-white
              hover:bg-white/[0.06]
              transition
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">

            <Code2
              size={17}
              className="text-blue-400"
            />

            <div>
              <h1 className="text-sm font-medium">
                Run Code
              </h1>

              <p className="text-[10px] text-slate-500">
                Orbit Code Runner
              </p>
            </div>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <span
            className="
              px-2.5
              py-1
              rounded-md
              bg-white/[0.03]
              border
              border-white/[0.07]
              text-[10px]
              font-mono
              text-slate-400
              uppercase
            "
          >
            {normalizedLanguage}
          </span>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-4 md:p-6">

        <div
          className="
            rounded-2xl
            overflow-hidden
            border
            border-white/[0.08]
            bg-[#0b0f17]
          "
        >

          {/* CODE HEADER */}

          <div
            className="
              h-11
              px-4
              flex
              items-center
              justify-between
              border-b
              border-white/[0.06]
              bg-white/[0.02]
            "
          >

            <span
              className="
                text-[11px]
                font-mono
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              {normalizedLanguage}
            </span>


            <button
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-lg
                text-[11px]
                font-medium
                text-emerald-400
                border
                border-emerald-400/20
                bg-emerald-400/[0.04]
                hover:bg-emerald-400/10
                transition
              "
            >
              <Play size={12} />
              Run
            </button>

          </div>


          {/* CODE */}

     
        </div>


        {/* OUTPUT */}

        <div className="mt-5">

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-slate-500
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            Output
          </div>

          <div
            className="
              min-h-[150px]
              rounded-xl
              border
              border-white/[0.07]
              bg-black/20
              p-4
              text-sm
              font-mono
              text-slate-500
            "
          >
            Code execution for{" "}
            <span className="text-slate-300">
              {normalizedLanguage}
            </span>{" "}
            is not connected yet.
          </div>

        </div>

      </div>

    </div>
  );
}

