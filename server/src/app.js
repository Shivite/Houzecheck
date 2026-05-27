const express = require("express");
const cors = require("cors");
require("dotenv").config();

const store = require("./data/store");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Middleware usage
app.use(express.json());

// Rate api on submit name and user enter to dashboard
app.post("/rate", (req, res) => {
  try {
    const { user, value, isJoin, userId } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    // check already joined or new joiner
    if (isJoin) {
      const data = {
        average: store.totalVotes
          ? store.totalScore / store.totalVotes
          : 0,
        totalScore: store.totalScore,
        message: `${user} joined the group`,
        time: new Date().toLocaleTimeString(),
      };

      store.clients.forEach((client) => {
        try {
          client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
          console.error("SSE error:", err);
        }
      });

      return res.json({ success: true });
    }

    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      return res.status(400).json({
        success: false,
        message: "Invalid value",
      });
    }

    store.totalScore += numericValue;
    store.totalVotes++;

    const data = {
      average: store.totalScore / store.totalVotes,
      totalScore: store.totalScore,
      message: `${user} rated ${numericValue}`,
      time: new Date().toLocaleTimeString(),
    };

    store.clients.forEach((client) => {
      try {
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (err) {
        console.error("SSE error:", err);
      }
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("RATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// SSE Event handling
app.get("/events", (req, res) => {
  const userId = req.query.userId;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  res.flushHeaders();

  store.clients.push({ res, userId });

  // initial connection message
  res.write(
    `data: ${JSON.stringify({
      average: store.totalVotes ? store.totalScore / store.totalVotes : 0,
      totalScore: store.totalScore,
      message: "connected",
      time: new Date().toLocaleTimeString(),
    })}\n\n`
  );

  // keep connection alive
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    store.clients = store.clients.filter((c) => c.res !== res);
  });
});

module.exports = app;