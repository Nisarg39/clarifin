# Production Backend Setup & Serveo Tunnel Configuration

This document outlines the architecture, setup, and maintenance instructions for running the Clarifin production backend on the Windows PC server using a secure Serveo SSH tunnel.

---

## Architecture Overview

To comply with the Google Play Store’s data security policies (which require secure HTTPS endpoints) and to ensure Google Play Reviewers can access the API from external networks, the backend is hosted on a local Windows PC server and exposed securely to the internet.

```mermaid
graph TD
    subgraph Client Devices
        App[Expo/React Native App]
        Admin[Admin Dashboard]
    end
    subgraph Public Internet
        Serveo[Serveo Gateway<br>https://clarifin.serveousercontent.com]
    end
    subgraph Local Production PC (Windows)
        SSHTunnel[SSH Tunnel Client]
        NodeBackend[Node.js Express Backend<br>Port 5001]
        MongoDB[(MongoDB Database<br>Port 27017)]
    end

    App -->|HTTPS Request| Serveo
    Admin -->|HTTPS Request| Serveo
    Serveo -->|Secure SSH Tunnel| SSHTunnel
    SSHTunnel -->|Localhost Forward| NodeBackend
    NodeBackend -->|Database Queries| MongoDB
```

---

## Endpoint Information

* **Public HTTPS Base URL:** `https://clarifin.serveousercontent.com`
* **Local Backend Port:** `5001`
* **Database Connection:** `mongodb://localhost:27017/clarifin`

---

## Step-by-Step Configuration on the Windows Server

### 1. Backend Service
1. The backend repository is located on the Windows PC.
2. Dependencies are installed using:
   ```cmd
   npm install
   ```
3. The server runs on port `5001` using:
   ```cmd
   npm run dev
   ```

### 2. Establishing the Serveo SSH Tunnel
Because the server is a Windows machine, the built-in OpenSSH client is used to forward the local port `5001` to the reserved Serveo subdomain.

Run the following command in Windows PowerShell or Command Prompt:

```cmd
ssh -R clarifin:80:localhost:5001 serveo.net
```

> [!NOTE]
> If you are prompted with `Are you sure you want to continue connecting (yes/no/[fingerprint])?`, type **`yes`** and press Enter.

---

## Client Environment Configurations

Both the mobile application and the administrator panel are updated to target this production URL.

### Expo Mobile App (`app/.env`)
```env
BASEURL=https://clarifin.serveousercontent.com
```

### Admin Panel (`admin/.env`)
```env
BASEURL=https://clarifin.serveousercontent.com
```

---

## Production Reliability & Best Practices

To ensure the tunnel remains active 24/7 and does not disconnect during inactivity or PC reboots, implement the following configurations:

### 1. Enable SSH Keep-Alives
By default, SSH connections can time out if idle. Add keep-alive options to the tunnel command:

```cmd
ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -R clarifin:80:localhost:5001 serveo.net
```
* **`ServerAliveInterval=60`**: Sends a ping request every 60 seconds to keep the connection alive.
* **`ServerAliveCountMax=3`**: Disconnects and allows scripts to detect a failure if 3 consecutive pings fail.

### 2. Auto-Restarting Script (Windows Batch)
Create a batch file named `start-tunnel.bat` on the Windows PC to automatically restart the tunnel if it disconnects:

```batch
@echo off
:loop
echo Starting Serveo SSH Tunnel...
ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -R clarifin:80:localhost:5001 serveo.net
echo Tunnel closed or crashed. Reconnecting in 5 seconds...
timeout /t 5
goto loop
```

### 3. Ensure the PC Doesn't Sleep
1. Go to **Settings > System > Power & sleep**.
2. Set **Screen** and **Sleep** to **Never** when plugged in to prevent the server and tunnel from going offline.
