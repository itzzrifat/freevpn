# FreeVPN - Pura Ready Deploy Guide (Bangla)

Tumi bolso "pora ready kore daw" - tai sob kichu ready korlam!

## ✅ Ki Ki Ready Ache?

### 1. Live Surge Site (Static)
- **Link:** https://freevpn-dubai-2026.surge.sh
- **Account:** freevpn.dubai.2026@proton.me / FreeVPN2026!Dubai
- **Update cmd:** `npx surge ./surge-deploy --domain freevpn-dubai-2026.surge.sh`

### 2. Full Node.js Backend (Powerful)
- File: `server.js` + `public/index.html`
- Features: Real Web Proxy, WireGuard generator, Outline, IP hide
- Local run: `npm install && npm start` -> http://localhost:3000

---

## 🚀 1-Click Deploy Options

### Option A: Render.com (Recommended for Full VPN - FREE)
1. Github e ei folder push koro
2. https://render.com -> New Web Service -> Connect GitHub
3. Build: `npm install` , Start: `node server.js`
4. FREE! Auto HTTPS paba, e.g., `freevpn-full.onrender.com`
5. **render.yaml file already ache, Render auto detect korbe**

### Option B: Fly.io (Full VPN - FREE)
```bash
npm i -g flyctl
fly launch
fly deploy
```

### Option C: Surge.sh (Static - Already Done)
```bash
npm i -g surge
cd surge-deploy
surge --domain tumar-nam.surge.sh
```

### Option D: Docker (Any VPS)
```bash
docker build -t freevpn .
docker run -p 3000:3000 freevpn
```

### Option E: Oracle Cloud FREE VPS (Real WireGuard Server)
Eta te tomar REAL VPN server hobe jeta 10TB/month free:

```bash
# VPS e Ubuntu 22.04 niye:
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
sudo ./wireguard-install.sh
# Client add koro, config paba /root/client.conf e
# Oi PublicKey server.js e bosiye dao
```

---

## 📁 Project Structure

```
free-vpn-web/
├── server.js           # Full backend (Express + Proxy + WG gen)
├── package.json
├── Dockerfile          # Docker ready
├── render.yaml         # Render 1-click
├── vercel.json         # Vercel ready
├── public/
│   └── index.html      # Full app UI (needs backend)
├── surge-deploy/
│   ├── index.html      # Static version (Surge ready, no backend)
│   └── CNAME           # Domain file
├── README.md
└── DEPLOY_GUIDE_BN.md  # Ei file
```

---

## 🔐 Security Note

- Mock IP gulo real server e replace koro for production
- `.env` e `PORT` set korte paro
- No logs, open source, MIT

---

## 🆘 Help Lagle?

- WireGuard Official App: https://www.wireguard.com/install/
- Outline App: https://getoutline.org/
- WireGuard Install Script: https://github.com/angristan/wireguard-install

Ready! Zip kore download kore nao ba GitHub e push koro.
