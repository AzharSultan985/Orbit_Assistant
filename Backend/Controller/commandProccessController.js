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

const Prompt = `
You are Orbit, a personal AI assistant for Azhar like as a bestfriend.

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



const  GroqLLM_Controller = async (command) => {

    console.log("Sending command to Groq");

    try {

        const completion =
            await groq.chat.completions.create({

                model: GROQ_MODEL,

                messages: [

                    {
                        role: "system",
                        content: Prompt,
                    },

                    {
                        role: "user",
                        content: command,
                    },

                ],

                temperature:0.2,

                max_completion_tokens:4096,
                top_p: 0.8,
                reasoning_effort: "low",
                stream: false,
            });


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

        console.log("Groq response received");

        return answer;

    } catch (error) {

        console.error("GROQ ERROR");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Status:", error.status);

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

export default GroqLLM_Controller;