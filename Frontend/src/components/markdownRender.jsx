
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useNavigate } from "react-router-dom";

import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({ content }) {
  const [copied, setCopied] = useState(null);

  const navigate = useNavigate();

  // ==========================================
  // COPY CODE
  // ==========================================

  const handleCopy = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(id);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ==========================================
  // RUN CODE
  // ==========================================

  const handleRun = (code, language) => {
    navigate("/run-code", {
      state: {
        code,
        language,
      },
    });
  };

  return (
    <div className="orbit-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // ==========================================
          // HEADINGS
          // ==========================================

          h1: ({ children }) => (
            <h1 className="orbit-h1">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="orbit-h2">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="orbit-h3">
              {children}
            </h3>
          ),

          // ==========================================
          // PARAGRAPH
          // ==========================================

          p: ({ children }) => (
            <p className="orbit-p">
              {children}
            </p>
          ),

          // ==========================================
          // TEXT
          // ==========================================

          strong: ({ children }) => (
            <strong className="orbit-strong">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="orbit-em">
              {children}
            </em>
          ),

          // ==========================================
          // LIST
          // ==========================================

          ul: ({ children }) => (
            <ul className="orbit-ul">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="orbit-ol">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="orbit-li">
              {children}
            </li>
          ),

          // ==========================================
          // BLOCKQUOTE
          // ==========================================

          blockquote: ({ children }) => (
            <blockquote className="orbit-blockquote">
              {children}
            </blockquote>
          ),

          // ==========================================
          // LINKS
          // ==========================================

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="orbit-link"
            >
              {children}
            </a>
          ),

          // ==========================================
          // HR
          // ==========================================

          hr: () => (
            <hr className="orbit-hr" />
          ),

          // ==========================================
          // TABLE
          // ==========================================

          table: ({ children }) => (
            <div className="orbit-table-wrapper">
              <table className="orbit-table">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="orbit-thead">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="orbit-th">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="orbit-td">
              {children}
            </td>
          ),

          // ==========================================
          // DELETE
          // ==========================================

          del: ({ children }) => (
            <del className="orbit-del">
              {children}
            </del>
          ),

          // ==========================================
          // INLINE CODE
          // ==========================================

          code: ({ children, className }) => {
            const isBlock =
              className?.includes("language-");

            if (isBlock) {
              return (
                <code
                  className={`orbit-code ${className || ""}`}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className="orbit-inline-code">
                {children}
              </code>
            );
          },

          // ==========================================
          // CODE BLOCK
          // ==========================================

       
pre: ({ children }) => {

  // ==========================================
  // EXTRACT CODE ELEMENT
  // ==========================================

  const codeElement = children?.props;

  // ==========================================
  // GET RAW CODE
  // ==========================================

  const extractText = (value) => {

    if (value == null) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map(extractText)
        .join("");
    }

    if (typeof value === "object") {

      if ("props" in value) {
        return extractText(value.props?.children);
      }

      return "";
    }

    return "";
  };


  const code = extractText(
    codeElement?.children
  ).replace(/\n$/, "");


  // ==========================================
  // GET LANGUAGE
  // ==========================================

  const className =
    codeElement?.className || "";

  const languageMatch =
    className.match(
      /language-([\w-]+)/
    );

  const language =
    languageMatch?.[1]?.toLowerCase() || "text";


  // ==========================================
  // LANGUAGE ALIASES
  // ==========================================

  const languageMap = {

    js: "javascript",
    jsx: "javascript",

    ts: "typescript",
    tsx: "typescript",

    py: "python",

    sh: "shell",
    bash: "shell",

    html: "html",

    css: "css",

    json: "json",

    java: "java",

    cpp: "cpp",

    c: "c",

    php: "php",

    go: "go",

    rust: "rust",

    svg: "svg",

  };


  const normalizedLanguage =
    languageMap[language] || language;


  // ==========================================
  // RUNNABLE
  // ==========================================

  const runnableLanguages = [

    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "json",
    "java",
    "cpp",
    "c",
    "php",
    "go",
    "rust",
    "svg",

  ];


  const canRun =
    runnableLanguages.includes(
      normalizedLanguage
    );


  // ==========================================
  // COPY
  // ==========================================

  // Replace this line in your `pre` component:
const copyId = `${normalizedLanguage}-${code}-${Math.random()}`;


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div
      className="
        relative
        my-4
        overflow-hidden
        rounded-xl
        border
        border-white/[0.08]
        bg-[#0b0f17]
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          px-3
          py-2
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


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* RUN */}

          {canRun && (

            <button
              type="button"
              onClick={() => {

                navigate(
                  "/run-code",
                  {
                    state: {
                      code,
                      language:
                        normalizedLanguage,
                    },
                  }
                );

              }}
              className="
                flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-md
                text-[11px]
                font-mono
                text-emerald-400
                border
                border-emerald-400/20
                bg-emerald-400/[0.04]
                hover:bg-emerald-400/10
                hover:border-emerald-400/40
                transition-all
                cursor-pointer
              "
            >

              <span>
                ▶
              </span>

              Run

            </button>

          )}


          {/* COPY */}

          <button
            type="button"
            onClick={() =>
              handleCopy(
                code,
                copyId
              )
            }
            className="
              flex
              items-center
              gap-1.5
              px-2.5
              py-1
              rounded-md
              text-[11px]
              font-mono
              text-slate-400
              border
              border-white/[0.08]
              bg-white/[0.02]
              hover:bg-white/[0.07]
              hover:text-slate-200
              transition-all
              cursor-pointer
            "
          >

            {copied === copyId ? (
              <>
                <span className="text-emerald-400">
                  ✓
                </span>

                Copied
              </>
            ) : (
              <>
                <span>
                  ⧉
                </span>

                Copy
              </>
            )}

          </button>

        </div>

      </div>


      {/* CODE */}

      <pre
        className="
          orbit-pre
          !m-0
          overflow-x-auto
          p-4
          scrollbar-custom
        "
      >

        {children}

      </pre>

    </div>

  );
},

        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
