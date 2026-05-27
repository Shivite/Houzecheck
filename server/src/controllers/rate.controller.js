const store = require("../data/store");
const sse = require("../services/sse.service");

exports.rateUser = (req, res) => {
  try {
    const { user, value, isJoin } = req.body;

    // Debug (optional)
    console.log("Request body:", req.body);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    // JOIN EVENT
    if (isJoin) {
      const data = {
        average: store.totalVotes
          ? store.totalScore / store.totalVotes
          : 0,

        totalScore: store.totalScore,
        message: `${user} joined the group`,
        time: new Date().toLocaleTimeString(),
      };

      sse.broadcast(data);
      return res.json({ success: true });
    }

    // RATE EVENT
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

    sse.broadcast(data);

    return res.json({ success: true });

  } catch (err) {
    console.error("RATE CONTROLLER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};