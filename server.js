const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

console.log("✅ Server running on port", PORT);

wss.on("connection", (ws) => {
  console.log("📱 Client connected");

  ws.on("message", (message) => {
    const data = message.toString();
    console.log("📩 Received:", data);

    // 📱 App tracking
    if (data.startsWith("APP:")) {
      const parts = data.split(":");
      const identity = parts[1];
      const [deviceId, deviceName] = identity.split("|");
      const appName = parts.slice(2).join(":");
      console.log(`📱 [${deviceName || deviceId}] App:`, appName);
    }

    // 🖥️ Screen streaming
    if (data.startsWith("SCREEN:")) {
      const parts = data.split(":");
      const identity = parts[1];
      const [deviceId, deviceName] = identity.split("|");
      console.log(`🖼️ [${deviceName || deviceId}] Screen frame received`);
    }

    // 🔁 Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
