import AgentAPI from "apminsight";
AgentAPI.config();

import http from "http";
import express from "express";
import { attachWebSocketServer } from "./ws/server.js";
import { matchRouter } from "./routes/matches.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Sportz server is running." });
});

app.use(securityMiddleware());

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.listen(PORT, HOST, () => {
    const baseUrl =
        HOST === "0.0.0.0"
            ? `http://localhost:${PORT}`
            : `http://${HOST}:${PORT}`;
    console.log(`Server running on ${baseUrl}`);
    console.log(
        `Websocket server running on ${baseUrl.replace("http", "ws")}/ws`,
    );
});
