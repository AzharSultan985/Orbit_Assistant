import askOllama from "./commandProccessController.js";

export const receiveOrbitMessage = async (socket, data) => {

    try {

        const message = data?.message?.trim();

        if (!message) {
            return;
        }

        console.log("================================");
        console.log("ORBIT MESSAGE RECEIVED");
        console.log("Socket:", socket.id);
        console.log("Message:", message);
        console.log("================================");

        // Send directly to Ollama
        const answer = await askOllama(message);

        // Send Ollama response back to this React client
        socket.emit("orbit:response", {
            success: true,
            response: answer,
            type:"orbit",
            timestamp: new Date().toISOString(),
        });

    } catch (error) {

        console.error(
            "Orbit message controller error:",
            error.message
        );

        socket.emit("orbit:response:error", {
            success: false,
            message: error.message,
        });
    }
};