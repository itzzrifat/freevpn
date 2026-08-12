# FreeVPN - 100% Open Source Free VPN Web App

> Bengali: Eta sompurno free, open source VPN web app. Kono taka lagena!

Made with ❤️ using open source: WireGuard + Outline + Shadowsocks + Node.js

## Features
- 🌐 **Web Proxy VPN** - Browser er vitorei VPN, kono install lagena
- 🛡️ **WireGuard Config Generator** - Official WireGuard app e QR scan korlei connect
- 👻 **Outline / Shadowsocks** - UAE, China, Iran e best, censorship bypass
- ⚡ 6 Global Locations (SG, US, DE, UK, UAE, JP)
- 📱 No logs, Kill Switch, Unlimited
- 🎨 Modern Glass UI

## Open Source Stack
- Frontend: Tailwind CSS, Vanilla JS
- Backend: Node.js + Express
- VPN Core:
  - WireGuard: https://www.wireguard.com/ (fastest)
  - Outline: https://getoutline.org/ by Jigsaw/Google
  - Shadowsocks: https://shadowsocks.org/
  - Xray-core (optional upgrade): https://github.com/XTLS/Xray-core

## Deploy Real VPN Server (Free)

### Option 1: Oracle Cloud Always Free (Recommended)
1. Create Oracle Cloud account - get 2 AMD VMs free forever + 10TB traffic
2. Create Ubuntu 22.04 VM
3. SSH and run:
```bash
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
sudo ./wireguard-install.sh
```
4. It will generate a client config. Copy the PublicKey and Endpoint.
5. Put it in this web app's server.js to make it real!

### Option 2: $5/mo VPS
- Hetzner, DigitalOcean, Vultr - any works
- Same script as above

### Option 3: Web App Hosting (for the proxy UI)
- Deploy this Node app to Render.com / Fly.io / Railway.app (all have free tier)
- The web proxy will work instantly

## How to Run Locally
```bash
npm install
npm start
# Open http://localhost:3000
```

## How Real VPN Works?
Browser alone full system VPN korte pare na (security reason). Tai 2 ta way:
1. **Web Proxy Mode**: Amader backend server proxy hisebe kaj kore - site gulo server hoye load hoy, tomar IP hide thake. Eta instant kaj kore.
2. **WireGuard Mode**: Amra valid .conf file generate kori. Tumi WireGuard app (Play Store/App Store) diye QR scan korle tomar full phone/PC VPN hoye jabe.

## Security
- No logs, no tracking code
- Everything is open source, you can self-host
- Replace mock keys with your real server keys in production

## License
MIT - Use freely, even commercially!

---
Banaise: Arena AI Agent for Dubai User
