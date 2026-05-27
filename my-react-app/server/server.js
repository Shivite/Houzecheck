const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

let totalScore = 0;
let totalVotes = 0;
let clients = [];


// rate api 
app.post("/rate", (req, res) => {
  try {
    const { user, value, isJoin, userId } = req.body;

    // user validation
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    // join user to dashboard 
    if (isJoin) {
      const data = {
        average: totalVotes === 0
          ? 0
          : totalScore / totalVotes,

        totalScore,

        message: `${user} joined the group`,
      };

      clients.forEach((client) => {
        try {
          // Prevent broadcasting "new user joined" event to all users.
          // It should not be sent back to the user who just joined.
          if (client.userId === userId) return;

          client.res.write(
            `data: ${JSON.stringify(data)}\n\n`
          );
        } catch (err) {
          console.error("SSE write error:", err);
        }
      });

      return res.json({
        success: true,
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Value is required",
      });
    }

    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      return res.status(400).json({
        success: false,
        message: "Invalid score value",
      });
    }

    // update score
    totalScore += numericValue;
    totalVotes++;

    const average =
      totalVotes === 0 ? 0 : totalScore / totalVotes;

    const data = {
      average,
      totalScore,
      message: `${user} rated ${numericValue}`,
    };

    // Brodcasting to all other users 
    clients.forEach((client) => {
      try {
        client.res.write(
          `data: ${JSON.stringify(data)}\n\n`
        );
      } catch (err) {
        console.error("SSE write error:", err);
      }
    });

    return res.json({
      success: true,
    });

  } catch (error) {
    console.error("POST /rate error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


// ---------------- SSE Endpoints ----------------
app.get("/events", (req, res) => {
  try {
    const userId = req.query.userId;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });

    res.flushHeaders();

    clients.push({
      res,
      userId,
    });

    // Keep connection alive - prevents connection timeout 
    const keepAlive = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAlive);

      clients = clients.filter(
        (c) => c.res !== res
      );
    });

  } catch (error) {
    //unexpected server-level failures only 
    console.error("SSE ERROR:", error);
    res.status(500).end();
  }
});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});