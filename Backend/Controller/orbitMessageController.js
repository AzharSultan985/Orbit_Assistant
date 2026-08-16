import GroqLLM_Controller, {
    getAIError,
} from "./commandProccessController.js";

export const receiveOrbitMessage = async (socket, data) => {

    try {

        const message = data?.message?.trim();

        if (!message) {
            return;
        }

        console.log("ORBIT MESSAGE RECEIVED");       
        console.log("Message:", message);
        

        const answer = await GroqLLM_Controller(message);

       
        socket.emit("orbit:response", {
            success: true,
            response: answer,
            type: "orbit",
            timestamp: new Date().toISOString(),
        });

    } catch (error) {

        console.error(
            "Orbit message controller error:",
            error.message
        );

        socket.emit("orbit:response:error", {
            success: false,
            message: getAIError(error),
        });
    }
};