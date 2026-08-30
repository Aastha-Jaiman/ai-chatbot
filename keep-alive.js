const axios = require("axios");

const SERVICES = [
  "https://ai-chatbot-api-gateway.onrender.com/health",
  "https://ai-chatbot-1-0bh5.onrender.com/health",
  "https://ai-chatbot-2-xavp.onrender.com/health",
  "https://ai-chatbot-b130.onrender.com/health",
  "https://ai-chatbot-3-c5xi.onrender.com/health",
  "https://ai-chatbot-4-ubvw.onrender.com/health"
];

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

async function pingServices() {
  console.log(`\n[${new Date().toISOString()}] Starting keep-alive pings...`);
  
  for (const url of SERVICES) {
    try {
      const start = Date.now();
      const response = await axios.get(url, { timeout: 30000 });
      const duration = Date.now() - start;
      console.log(`✅ SUCCESS: ${url} (Status: ${response.status}, Time: ${duration}ms)`);
    } catch (error) {
      console.error(`❌ FAILED: ${url} - Error: ${error.message}`);
    }
  }
}

// Initial ping on start
pingServices();

// Schedule periodic pings
setInterval(pingServices, PING_INTERVAL);

console.log("Keep-alive scheduler started. Pinging every 10 minutes...");
