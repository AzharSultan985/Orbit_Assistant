import express from "express";
import SystemRoutes from "./Routes/SystemRoute.js";
import CommandReceiverRoute from "./Routes/cmdReceRoute.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: true,
    })
);

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
    cors: {
        origin: true,
    },
});

// Make Socket.IO available inside controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {
    console.log("React connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("React disconnected:", socket.id);
    });
});

// ==========================================
// ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.use("/api/v1", SystemRoutes);

app.use(
    "/api/v2/orbit",
    CommandReceiverRoute
);

// ==========================================
// START SERVER
// ==========================================

const PORT = 3002;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});