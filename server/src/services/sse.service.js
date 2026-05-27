const store = require("../data/store");

exports.broadcast = (data) => {
  store.clients.forEach((client) => {
    try {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error("SSE error:", err);
    }
  });
};