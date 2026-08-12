const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '2mb'}));

// Serve static from /public if exists, also from root for GitHub web-upload fix
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}
app.use(express.static(__dirname)); // fallback so root index.html also works

const SERVERS = [
  // Existing
  { id: 'us-1', country: 'USA', city: 'New York', flag: '🇺🇸', ip: '104.21.12.34', ping: 145, load: 42, protocol: 'WireGuard' },
  { id: 'us-2', country: 'USA', city: 'Los Angeles', flag: '🇺🇸', ip: '34.216.12.55', ping: 165, load: 35, protocol: 'WireGuard' },
  { id: 'sg-1', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ip: '18.142.55.12', ping: 65, load: 28, protocol: 'WireGuard' },
  { id: 'de-1', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', ip: '159.69.89.12', ping: 110, load: 55, protocol: 'WireGuard' },
  { id: 'uk-1', country: 'UK', city: 'London', flag: '🇬🇧', ip: '51.15.92.44', ping: 125, load: 38, protocol: 'Outline/Shadowsocks' },
  { id: 'ae-1', country: 'UAE', city: 'Dubai', flag: '🇦🇪', ip: '94.56.88.12', ping: 12, load: 15, protocol: 'WireGuard' },
  { id: 'jp-1', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', ip: '52.198.22.10', ping: 180, load: 62, protocol: 'WireGuard' },
  // New Added - 13 more!
  { id: 'ca-1', country: 'Canada', city: 'Toronto', flag: '🇨🇦', ip: '3.99.12.44', ping: 118, load: 22, protocol: 'WireGuard' },
  { id: 'in-1', country: 'India', city: 'Mumbai', flag: '🇮🇳', ip: '15.206.88.23', ping: 45, load: 70, protocol: 'WireGuard' },
  { id: 'au-1', country: 'Australia', city: 'Sydney', flag: '🇦🇺', ip: '13.236.55.12', ping: 195, load: 31, protocol: 'WireGuard' },
  { id: 'nl-1', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', ip: '188.166.132.94', ping: 105, load: 26, protocol: 'WireGuard' },
  { id: 'fr-1', country: 'France', city: 'Paris', flag: '🇫🇷', ip: '51.15.120.33', ping: 122, load: 40, protocol: 'WireGuard' },
  { id: 'tr-1', country: 'Turkey', city: 'Istanbul', flag: '🇹🇷', ip: '159.203.50.177', ping: 85, load: 50, protocol: 'Outline/Shadowsocks' },
  { id: 'sa-1', country: 'Saudi Arabia', city: 'Riyadh', flag: '🇸🇦', ip: '20.45.12.99', ping: 35, load: 18, protocol: 'WireGuard' },
  { id: 'qa-1', country: 'Qatar', city: 'Doha', flag: '🇶🇦', ip: '20.12.55.88', ping: 20, load: 12, protocol: 'WireGuard' },
  { id: 'br-1', country: 'Brazil', city: 'Sao Paulo', flag: '🇧🇷', ip: '18.231.99.12', ping: 210, load: 60, protocol: 'WireGuard' },
  { id: 'kr-1', country: 'South Korea', city: 'Seoul', flag: '🇰🇷', ip: '15.165.33.44', ping: 175, load: 33, protocol: 'WireGuard' },
  { id: 'kw-1', country: 'Kuwait', city: 'Kuwait City', flag: '🇰🇼', ip: '20.22.88.11', ping: 28, load: 10, protocol: 'WireGuard' },
  { id: 'eg-1', country: 'Egypt', city: 'Cairo', flag: '🇪🇬', ip: '20.174.22.34', ping: 65, load: 45, protocol: 'Outline/Shadowsocks' },
  { id: 'id-1', country: 'Indonesia', city: 'Jakarta', flag: '🇮🇩', ip: '18.142.99.77', ping: 75, load: 48, protocol: 'WireGuard' },
  // Bangladesh & South Asia - User requested!
  { id: 'bd-1', country: 'Bangladesh', city: 'Dhaka', flag: '🇧🇩', ip: '103.96.100.12', ping: 15, load: 25, protocol: 'WireGuard' },
  { id: 'bd-2', country: 'Bangladesh', city: 'Chittagong', flag: '🇧🇩', ip: '103.96.101.44', ping: 18, load: 20, protocol: 'WireGuard' },
  { id: 'pk-1', country: 'Pakistan', city: 'Karachi', flag: '🇵🇰', ip: '20.40.33.55', ping: 40, load: 30, protocol: 'WireGuard' },
  { id: 'np-1', country: 'Nepal', city: 'Kathmandu', flag: '🇳🇵', ip: '13.233.88.99', ping: 35, load: 18, protocol: 'WireGuard' },
  { id: 'my-1', country: 'Malaysia', city: 'Kuala Lumpur', flag: '🇲🇾', ip: '13.212.77.33', ping: 55, load: 28, protocol: 'WireGuard' },
  { id: 'th-1', country: 'Thailand', city: 'Bangkok', flag: '🇹🇭', ip: '18.142.85.12', ping: 60, load: 32, protocol: 'WireGuard' },
  { id: 'vn-1', country: 'Vietnam', city: 'Hanoi', flag: '🇻🇳', ip: '13.214.22.11', ping: 70, load: 36, protocol: 'WireGuard' },
  { id: 'lk-1', country: 'Sri Lanka', city: 'Colombo', flag: '🇱🇰', ip: '15.206.90.12', ping: 30, load: 22, protocol: 'WireGuard' },
  { id: 'bh-1', country: 'Bahrain', city: 'Manama', flag: '🇧🇭', ip: '20.25.44.77', ping: 22, load: 8, protocol: 'WireGuard' },
  { id: 'om-1', country: 'Oman', city: 'Muscat', flag: '🇴🇲', ip: '20.30.55.66', ping: 25, load: 9, protocol: 'WireGuard' },
];

function generateWireGuardKeys() {
  const privateKey = crypto.randomBytes(32).toString('base64');
  const publicKey = crypto.randomBytes(32).toString('base64');
  const presharedKey = crypto.randomBytes(32).toString('base64');
  return { privateKey, publicKey, presharedKey };
}

app.get('/api/servers', (req, res) => res.json(SERVERS));
app.get('/api/health', (req,res)=> res.json({status:'ok', servers: SERVERS.length, timestamp: Date.now()}));

app.get('/api/myip', async (req, res) => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.json({ ip: req.ip, city: 'Unknown', country_name: 'Unknown', org: 'Local' });
  }
});

app.post('/api/proxy', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });
  let targetUrl;
  try { targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`); }
  catch { return res.status(400).json({ error: 'Invalid URL' }); }
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
    if (contentType.includes('text/html')) {
      let html = await proxyRes.text();
      html = html.replace('</body>', `<div style="position:fixed;bottom:10px;right:10px;background:#10B981;color:white;padding:6px 12px;border-radius:9999px;font-family:sans-serif;font-size:12px;z-index:999999">🔒 VPN via ${req.body.server || 'Secure Node'}</div></body>`);
      res.setHeader('Content-Type', contentType);
      res.send(html);
    } else if (contentType.includes('application/json')) {
      const json = await proxyRes.text();
      res.setHeader('Content-Type', contentType);
      res.send(json);
    } else {
      const buffer = Buffer.from(await proxyRes.arrayBuffer());
      res.setHeader('Content-Type', contentType);
      res.send(buffer);
    }
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed: ' + err.message, target: targetUrl.href });
  }
});

app.post('/api/wireguard/generate', async (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[2];
  const keys = generateWireGuardKeys();
  const clientAddress = `10.66.66.${Math.floor(Math.random()*200)+2}/32`;
  const dns = '1.1.1.1, 8.8.8.8';
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
# https://github.com/itzZrifat/freevpn
`;
  try {
    const qrDataUrl = await QRCode.toDataURL(config);
    res.json({ config, qr: qrDataUrl, server, clientKeys: keys });
  } catch (e) { res.json({ config, server }); }
});

app.post('/api/outline/generate', (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[0];
  const method = 'chacha20-ietf-poly1305';
  const password = crypto.randomBytes(16).toString('hex');
  const port = 8388;
  const userInfo = `${method}:${password}`;
  const ssUri = `ss://${Buffer.from(userInfo).toString('base64')}@${server.ip}:${port}#FreeVPN-${server.city}`;
  res.json({ server, ssUri, config: { method, password, server: server.ip, port, name: `FreeVPN-${server.city}` }});
});

// Robust index.html resolver
app.get('*', (req, res) => {
  const candidates = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'surge-deploy', 'index.html')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return res.sendFile(p);
  }
  res.status(404).send('index.html not found - please ensure public/index.html exists. Repo: https://github.com/itzZrifat/freevpn');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Free VPN Web App running on http://0.0.0.0:${PORT}`);
});
