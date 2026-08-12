const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '2mb'}));
app.use(express.static(path.join(__dirname, 'public')));

// --- Mock Data: Free Open Source Servers ---
// In real deployment, replace with your own VPS IPs
// You can spin up WireGuard using: https://github.com/angristan/wireguard-install
const SERVERS = [
  { id: 'us-1', country: 'USA', city: 'New York', flag: '🇺🇸', ip: '104.21.12.34', ping: 145, load: 42, protocol: 'WireGuard' },
  { id: 'sg-1', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ip: '18.142.55.12', ping: 65, load: 28, protocol: 'WireGuard' },
  { id: 'de-1', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', ip: '159.69.89.12', ping: 110, load: 55, protocol: 'WireGuard' },
  { id: 'uk-1', country: 'UK', city: 'London', flag: '🇬🇧', ip: '51.15.92.44', ping: 125, load: 38, protocol: 'Outline/Shadowsocks' },
  { id: 'ae-1', country: 'UAE', city: 'Dubai', flag: '🇦🇪', ip: '94.56.88.12', ping: 12, load: 15, protocol: 'WireGuard' },
  { id: 'jp-1', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', ip: '52.198.22.10', ping: 180, load: 62, protocol: 'WireGuard' },
];

function generateWireGuardKeys() {
  // Real WireGuard keys are 32 bytes base64. We mock it for demo.
  // In production, use: wg genkey | tee privatekey | wg pubkey > publickey
  const privateKey = crypto.randomBytes(32).toString('base64');
  const publicKey = crypto.randomBytes(32).toString('base64');
  const presharedKey = crypto.randomBytes(32).toString('base64');
  return { privateKey, publicKey, presharedKey };
}

app.get('/api/servers', (req, res) => {
  res.json(SERVERS);
});

app.get('/api/myip', async (req, res) => {
  try {
    // Get client's apparent IP info
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.json({ ip: req.ip, city: 'Unknown', country_name: 'Unknown', org: 'Local' });
  }
});

// Web Proxy - The core of browser VPN
app.post('/api/proxy', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  let targetUrl;
  try {
    targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const proxyRes = await fetch(targetUrl.href, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    clearTimeout(timeout);

    const contentType = proxyRes.headers.get('content-type') || 'text/html';
    
    // If HTML, we return text, else proxy as is
    if (contentType.includes('text/html')) {
      let html = await proxyRes.text();
      // Basic injection to show it's proxied
      html = html.replace('</body>', `<div style="position:fixed;bottom:10px;right:10px;background:#10B981;color:white;padding:6px 12px;border-radius:9999px;font-family:sans-serif;font-size:12px;z-index:999999">🔒 VPN via ${req.body.server || 'Secure Node'}</div></body>`);
      res.setHeader('Content-Type', contentType);
      res.send(html);
    } else if (contentType.includes('application/json')) {
      const json = await proxyRes.text();
      res.setHeader('Content-Type', contentType);
      res.send(json);
    } else {
      // For images, css, js etc - stream
      const buffer = Buffer.from(await proxyRes.arrayBuffer());
      res.setHeader('Content-Type', contentType);
      res.send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed: ' + err.message, target: targetUrl.href });
  }
});

// Generate WireGuard config - 100% compatible with official WireGuard app
app.post('/api/wireguard/generate', async (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[2];
  
  const keys = generateWireGuardKeys();
  const clientAddress = `10.66.66.${Math.floor(Math.random()*200)+2}/32`;
  const dns = '1.1.1.1, 8.8.8.8';

  // This is a real valid WireGuard config format
  // User just needs to replace Server PublicKey and Endpoint with their real server
  const config = `[Interface]
PrivateKey = ${keys.privateKey}
Address = ${clientAddress}
DNS = ${dns}
MTU = 1280

[Peer]
PublicKey = ${crypto.randomBytes(32).toString('base64')} # <-- Replace with YOUR SERVER PublicKey
PresharedKey = ${keys.presharedKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${server.ip}:51820
PersistentKeepalive = 25
# Server: ${server.city}, ${server.country} (${server.flag})
# Generated by FreeVPN Open Source
# Setup guide: https://github.com/angristan/wireguard-install
`;

  try {
    const qrDataUrl = await QRCode.toDataURL(config);
    res.json({
      config,
      qr: qrDataUrl,
      server,
      clientKeys: keys,
      instructions: `1. Install WireGuard app (iOS/Android/Windows)\n2. Import this config or scan QR\n3. For your own server: Run https://github.com/angristan/wireguard-install on a VPS (costs ~$5/mo, or free Oracle Cloud)\n4. Replace PublicKey and Endpoint with real values from /etc/wireguard/wg0.conf`
    });
  } catch (e) {
    res.json({ config, server });
  }
});

// Generate Outline / Shadowsocks key (Alternative open source)
app.post('/api/outline/generate', (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[0];
  const method = 'chacha20-ietf-poly1305';
  const password = crypto.randomBytes(16).toString('hex');
  const port = 8388;
  // ss:// URI format
  const userInfo = `${method}:${password}`;
  const ssUri = `ss://${Buffer.from(userInfo).toString('base64')}@${server.ip}:${port}#FreeVPN-${server.city}`;
  
  res.json({
    server,
    ssUri,
    config: {
      method,
      password,
      server: server.ip,
      port,
      name: `FreeVPN-${server.city}`
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Free VPN Web App running on http://0.0.0.0:${PORT}`);
  console.log(`Open Source Stack: Express + WireGuard + Outline/Shadowsocks`);
});
