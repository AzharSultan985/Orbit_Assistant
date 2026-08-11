import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3.2:3b";

export const OllamaController = async (req, res) => {
    try {
        const { command } = req.body;

        if (!command) {
            return res.status(400).json({
                success: false,
                message: "Command is required",
            });
        }

        console.log("Orbit command received:", command);

        const prompt = `
You are Orbit, a personal AI voice assistant.

Answer only what the user asks. and give aswer according to exact question and compelete answer in 5 lines 


User:
${command}

Answer:
`;

        console.log("Sending command to Ollama...");

        const response = await axios.post(
            OLLAMA_URL,
            {
                model: OLLAMA_MODEL,
                prompt,
                stream: false,
                think: false,
                options: {
                    temperature: 0.1,
                    num_predict: 100,
                    top_p: 0.8,
                },
            },
            {
                timeout: 60000,
            }
        );

        const answer = response.data?.response?.trim();

        console.log("Ollama:", answer);

        if (!answer) {
            return res.status(500).json({
                success: false,
                message: "Ollama returned an empty response",
            });
        }

        return res.status(200).json({
            success: true,
            response: answer,
        });

    } catch (error) {

        console.error("Command Controller Error:");
        console.error(error.message);

        // Axios error from Ollama
        if (error.response) {
            console.error("Ollama status:", error.response.status);
            console.error("Ollama data:", error.response.data);
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};