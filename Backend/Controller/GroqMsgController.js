import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const MESSAGE_PROMPT = `
You are Orbit's WhatsApp message extraction system.

The user wants to send a WhatsApp message.

Extract the recipient and the exact message.

Return ONLY valid JSON.

Required format:

{
  "recipient": "Ali",
  "message": "Hello bro"
}

Rules:

- recipient = person's name only
- correct spelling if some words are worng or just make little enhance.
- do not add explanations
- do not use markdown
- do not use code fences
- do not add extra fields
`;

export const GroqMsgController = async (req, res) => {

    try {

        const { command } = req.body;

        if (!command?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Command is required"
            });

        }

        const completion =
            await groq.chat.completions.create({

                model: "openai/gpt-oss-120b",

                messages: [

                    {
                        role: "system",
                        content: MESSAGE_PROMPT
                    },

                    {
                        role: "user",
                        content: command
                    }

                ],

                temperature: 0,

                max_completion_tokens: 200,

                reasoning_effort: "low",

                stream: false
            });

        const answer =
            completion
                .choices?.[0]
                ?.message
                ?.content
                ?.trim();

        if (!answer) {

            throw new Error(
                "Groq returned empty response."
            );

        }

        return res.status(200).json({
            success: true,
            response: answer
        });

    } catch (error) {

        console.error(
            "Message AI error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};