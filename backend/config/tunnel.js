const { spawn } = require("child_process");

const startTunnel = () => {
  console.log("Starting Serveo tunnel...");
  const tunnel = spawn("ssh", [
    "-o", "StrictHostKeyChecking=no",
    "-o", "ServerAliveInterval=60",
    "-o", "ServerAliveCountMax=3",
    "-R", "clarifin:80:localhost:5001",
    "serveo.net"
  ]);

  tunnel.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`Tunnel: ${output}`);
  });

  tunnel.stderr.on("data", (data) => {
    const output = data.toString();
    if (output.includes("Forwarding HTTP traffic from")) {
        console.log(`Tunnel Online: ${output.trim()}`);
    } else {
        console.error(`Tunnel Error: ${output}`);
    }
  });

  tunnel.on("close", (code) => {
    console.log(`Tunnel process exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(startTunnel, 5000);
  });

  tunnel.on("error", (err) => {
    console.error(`Failed to start tunnel: ${err.message}`);
  });
};

module.exports = startTunnel;
