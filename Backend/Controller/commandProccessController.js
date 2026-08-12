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

        const answer = await askOllama(command);

        return res.status(200).json({
            success: true,
            response: answer,
        });

    } catch (error) {
        console.error("Ollama Controller Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// OLLAMA REQUEST
// =====================================================

const askOllama = async (command) => {

    console.log("Sending command to Ollama:", command);

    const prompt = `
Instruction :'You are Orbit, a personal AI voice assistant of Azhar.
Answer only what the user asks. and give aswer according to exact question 
if ask for solving math , any logic just give answer with little title and if asking for write code about any anthing like html js or making something like login page landing page or feature
just return code with litle tile and must follow if user give you use instruction in query  '

User query:
${command}

Answer:
`;

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

    if (!answer) {
        throw new Error("Ollama returned an empty response");
    }

    console.log("Ollama response:", answer);

    return answer;
};


export default askOllama