import "dotenv/config";

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import SystemRoutes from "./Routes/SystemRoute.js";
import CommandReceiverRoute from "./Routes/cmdReceRoute.js";
import { receiveOrbitMessage } from "./Controller/orbitMessageController.js";
import ConnectDB from "./Model/dbConnection.js";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: true,
    })
);




ConnectDB()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
    },
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on("connection", (socket) => {

    console.log("React connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("React disconnected:", socket.id);

    });


    // React -> Node

    socket.on("user:message", (data) => {
        receiveOrbitMessage(socket, data);
    });

});

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.use("/api/v1/orbit", SystemRoutes);

app.use(
    "/api/v2/orbit",
    CommandReceiverRoute
);

const PORT = 3002;

server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

    console.log(
        "Groq API key:",
        process.env.GROQ_API_KEY
            ? "Loaded ✓"
            : "Missing ✗"
    );

});