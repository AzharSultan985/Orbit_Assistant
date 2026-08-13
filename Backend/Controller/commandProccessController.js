import Groq from "groq-sdk";

// =====================================================
// GROQ CLIENT
// =====================================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "openai/gpt-oss-120b";

// =====================================================
// BASE SYSTEM PROMPT
// =====================================================

const General_PROMPT = `
You are Orbit, a personal AI assistant for Azhar.

Your job is to help Azhar with programming, software development,
problem solving, learning, planning, technical work, automation,
and general questions.

IMPORTANT RULES:

1. Answer exactly what the user asks.
2. Do not add unnecessary information.
3. Follow the user's instructions precisely.
4. Preserve important technical context.
5. For programming tasks, provide production-quality solutions.
6. If multiple files are required, clearly separate them by filename.
7. Never intentionally truncate a requested implementation.
8. Never replace requested working code with pseudo-code unless asked.
`;

// =====================================================
// SPEAK MODE PROMPT
// =====================================================

const SPEAK_PROMPT = `
You are Orbit, a personal AI assistant for Azhar.
You are responding through Orbit's voice assistant.

The response will be converted to speech using Microsoft Edge TTS.

Therefore:

1. Write naturally for spoken conversation.
2. Use short, clear paragraphs.
3. Keep sentences reasonably short.
4. Do not use Markdown.
5. Do not use code blocks.
6. Do not use bullet points unless absolutely necessary.
7. Do not use tables.
8. Do not use symbols that are difficult for speech synthesis.
9. Avoid unnecessary technical formatting.
10. Explain things conversationally and professionally.
11. For simple questions, keep the answer concise.
12. For technical questions, explain the important points clearly,
    but divide the answer into natural spoken paragraphs.
13. If the user asks for code while using voice mode,
    explain the solution rather than reading a large code block aloud.
14. Never say "here is the code" and then output a huge code block.
15. Make the response comfortable to listen to.
16. not use in response quotes etc beacuse edge tts speak same thing so avoid it .
`;

// =====================================================
// CHAT MODE PROMPT
// =====================================================



// =====================================================
// HTTP CONTROLLER
// =====================================================

export const OllamaController = async (req, res) => {

    try {

        const { command, content = "speak" } = req.body;

        if (!command?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Command is required",
            });

        }

        console.log("================================");
        console.log("AI REQUEST");
        console.log("Command:", command);
        console.log("Mode:", content);
        console.log("================================");

        const answer = await askOllama(
            command,
            content
        );

        return res.status(200).json({
            success: true,
            response: answer,
            mode: content,
        });

    } catch (error) {

        console.error("================================");
        console.error("AI CONTROLLER ERROR");
        console.error(error);
        console.error("================================");

        return res.status(500).json({
            success: false,
            message: getAIError(error),
        });
    }
};

// =====================================================
// GROQ REQUEST
// =====================================================

const askOllama = async (
    command,
    mode = "General_PROMPT"
) => {

    console.log("================================");
    console.log("Sending command to Groq");
    console.log("Command:", command);
    console.log("Model:", GROQ_MODEL);
    console.log("Mode:", mode);
    console.log("================================");

    try {

        // ---------------------------------------------
        // SELECT RESPONSE STYLE
        // ---------------------------------------------

        const modePrompt =
            mode === "speak"
                ? SPEAK_PROMPT
                : General_PROMPT;

        // ---------------------------------------------
        // CREATE SYSTEM PROMPT
        // ---------------------------------------------

//         const systemPrompt = `
// ${SYSTEM_PROMPT}

// ${modePrompt}
// `;

        // ---------------------------------------------
        // GROQ REQUEST
        // ---------------------------------------------

        const completion =
            await groq.chat.completions.create({

                model: GROQ_MODEL,

                messages: [

                    {
                        role: "system",
                        content: modePrompt,
                    },

                    {
                        role: "user",
                        content: command,
                    },

                ],

                temperature:
                    mode === "speak"
                        ? 0.3
                        : 0.2,

                max_completion_tokens:
                    mode === "speak"
                        ? 1200
                        : 4096,

                top_p: 0.8,

                reasoning_effort: "low",

                stream: false,
            });

        // ---------------------------------------------
        // GET RESPONSE
        // ---------------------------------------------

        const answer =
            completion
                .choices?.[0]
                ?.message
                ?.content
                ?.trim();

        if (!answer) {

            throw new Error(
                "Groq returned an empty response."
            );
        }

        console.log("================================");
        console.log("Groq response received");
        console.log("Mode:", mode);
        console.log("================================");

        return answer;

    } catch (error) {

        console.error("================================");
        console.error("GROQ ERROR");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Status:", error.status);
        console.error("================================");

        throw error;
    }
};

// =====================================================
// ERROR HANDLER
// =====================================================

export const getAIError = (error) => {

    if (
        error.code === "ECONNREFUSED" ||
        error.code === "ERR_NETWORK"
    ) {

        return "Orbit AI server could not be reached.";
    }

    if (error.status === 401) {

        return "Invalid Groq API key.";
    }

    if (error.status === 429) {

        return "Groq rate limit reached. Please try again shortly.";
    }

    if (error.status === 413) {

        return "The request is too large for the AI model. Please shorten the request.";
    }

    if (error.status >= 500) {

        return "Groq AI server error. Please try again.";
    }

    return (
        error.message ||
        "Orbit AI failed to generate a response."
    );
};

export default askOllama;