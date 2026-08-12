import Groq from "groq-sdk";

// =====================================================
// GROQ CLIENT
// =====================================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "openai/gpt-oss-120b";

// =====================================================
// SYSTEM PROMPT
// =====================================================

const SYSTEM_PROMPT = `
You are Orbit, a personal AI assistant for Azhar.

Your job is to help Azhar with programming, software development,
problem solving, learning, planning, and technical work.

IMPORTANT RULES:

1. Answer exactly what the user asks.
2. Do not add unnecessary explanations.
3. If the user asks a simple question, give a concise answer.
4. If the user asks a programming question, provide a complete solution.
5. If the user asks for a complete component, feature, page, or implementation,
   provide the complete implementation and do not intentionally truncate it.
6. Follow all instructions given by the user.
7. Preserve important technical context provided by the user.
8. For coding tasks, prefer production-quality code.
9. If multiple files are required, clearly separate them by filename.
10. Never replace working code with incomplete pseudo-code unless the user asks for it.
`;

// =====================================================
// HTTP CONTROLLER
// =====================================================

export const OllamaController = async (req, res) => {
    try {
        const { command } = req.body;

        if (!command?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Command is required",
            });
        }
console.log("cmd",command);

        const answer = await askOllama(command);

        return res.status(200).json({
            success: true,
            response: answer,
        });

    } catch (error) {

        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: getAIError(error),
        });
    }
};

// =====================================================
// GROQ REQUEST
// =====================================================

const askOllama = async (command) => {

    console.log("================================");
    console.log("Sending command to Groq");
    console.log("Command:", command);
    console.log("Model:", GROQ_MODEL);
    console.log("================================");

    try {

        const completion = await groq.chat.completions.create({

            model: GROQ_MODEL,

            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: command,
                },
            ],

            temperature: 0.2,

            max_completion_tokens: 4096,

            top_p: 0.8,

            reasoning_effort: "low",

            stream: false,
        });

        const answer =
            completion.choices?.[0]?.message?.content?.trim();

        if (!answer) {
            throw new Error(
                "Groq returned an empty response."
            );
        }

        console.log("================================");
        console.log("Groq response received");
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

    if (error.status >= 500) {
        return "Groq AI server error. Please try again.";
    }

    return (
        error.message ||
        "Orbit AI failed to generate a response."
    );
};

export default askOllama;