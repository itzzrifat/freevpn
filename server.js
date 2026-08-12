const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const QRCode = require('qrcode');
const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '2mb'}));

const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) app.use(express.static(publicPath));
app.use(express.static(__dirname));

const SERVERS = [
  // REAL WORKING - Cloudflare WARP (1-click real internet!)
  { id: 'warp-1', country: 'Cloudflare', city: 'WARP Global', flag: '🌐', ip: '162.159.193.1', ping: 8, load: 5, protocol: 'WARP - REAL', real: true },
  // Bangladesh - Requested
  { id: 'bd-1', country: 'Bangladesh', city: 'Dhaka', flag: '🇧🇩', ip: '103.96.100.12', ping: 15, load: 25, protocol: 'WireGuard', real: false },
  { id: 'bd-2', country: 'Bangladesh', city: 'Chittagong', flag: '🇧🇩', ip: '103.96.101.44', ping: 18, load: 20, protocol: 'WireGuard', real: false },
  { id: 'ae-1', country: 'UAE', city: 'Dubai', flag: '🇦🇪', ip: '94.56.88.12', ping: 12, load: 15, protocol: 'WireGuard', real: false },
  { id: 'qa-1', country: 'Qatar', city: 'Doha', flag: '🇶🇦', ip: '20.12.55.88', ping: 20, load: 12, protocol: 'WireGuard', real: false },
  { id: 'sa-1', country: 'Saudi Arabia', city: 'Riyadh', flag: '🇸🇦', ip: '20.45.12.99', ping: 35, load: 18, protocol: 'WireGuard', real: false },
  { id: 'sg-1', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ip: '18.142.55.12', ping: 65, load: 28, protocol: 'WireGuard', real: false },
  { id: 'in-1', country: 'India', city: 'Mumbai', flag: '🇮🇳', ip: '15.206.88.23', ping: 45, load: 70, protocol: 'WireGuard', real: false },
  { id: 'us-1', country: 'USA', city: 'New York', flag: '🇺🇸', ip: '104.21.12.34', ping: 145, load: 42, protocol: 'WireGuard', real: false },
  { id: 'us-2', country: 'USA', city: 'Los Angeles', flag: '🇺🇸', ip: '34.216.12.55', ping: 165, load: 35, protocol: 'WireGuard', real: false },
  { id: 'de-1', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', ip: '159.69.89.12', ping: 110, load: 55, protocol: 'WireGuard', real: false },
  { id: 'uk-1', country: 'UK', city: 'London', flag: '🇬🇧', ip: '51.15.92.44', ping: 125, load: 38, protocol: 'Outline/Shadowsocks', real: false },
  { id: 'jp-1', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', ip: '52.198.22.10', ping: 180, load: 62, protocol: 'WireGuard', real: false },
  { id: 'ca-1', country: 'Canada', city: 'Toronto', flag: '🇨🇦', ip: '3.99.12.44', ping: 118, load: 22, protocol: 'WireGuard', real: false },
  { id: 'au-1', country: 'Australia', city: 'Sydney', flag: '🇦🇺', ip: '13.236.55.12', ping: 195, load: 31, protocol: 'WireGuard', real: false },
  { id: 'nl-1', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', ip: '188.166.132.94', ping: 105, load: 26, protocol: 'WireGuard', real: false },
  { id: 'fr-1', country: 'France', city: 'Paris', flag: '🇫🇷', ip: '51.15.120.33', ping: 122, load: 40, protocol: 'WireGuard', real: false },
  { id: 'tr-1', country: 'Turkey', city: 'Istanbul', flag: '🇹🇷', ip: '159.203.50.177', ping: 85, load: 50, protocol: 'Outline/Shadowsocks', real: false },
  { id: 'br-1', country: 'Brazil', city: 'Sao Paulo', flag: '🇧🇷', ip: '18.231.99.12', ping: 210, load: 60, protocol: 'WireGuard', real: false },
  { id: 'kr-1', country: 'South Korea', city: 'Seoul', flag: '🇰🇷', ip: '15.165.33.44', ping: 175, load: 33, protocol: 'WireGuard', real: false },
  { id: 'kw-1', country: 'Kuwait', city: 'Kuwait City', flag: '🇰🇼', ip: '20.22.88.11', ping: 28, load: 10, protocol: 'WireGuard', real: false },
  { id: 'pk-1', country: 'Pakistan', city: 'Karachi', flag: '🇵🇰', ip: '20.40.33.55', ping: 40, load: 30, protocol: 'WireGuard', real: false },
  { id: 'my-1', country: 'Malaysia', city: 'Kuala Lumpur', flag: '🇲🇾', ip: '13.212.77.33', ping: 55, load: 28, protocol: 'WireGuard', real: false },
  { id: 'id-1', country: 'Indonesia', city: 'Jakarta', flag: '🇮🇩', ip: '18.142.99.77', ping: 75, load: 48, protocol: 'WireGuard', real: false },
  { id: 'bh-1', country: 'Bahrain', city: 'Manama', flag: '🇧🇭', ip: '20.25.44.77', ping: 22, load: 8, protocol: 'WireGuard', real: false },
  { id: 'lk-1', country: 'Sri Lanka', city: 'Colombo', flag: '🇱🇰', ip: '15.206.90.12', ping: 30, load: 22, protocol: 'WireGuard', real: false },
];

function generateWireGuardKeys() {
  const privateKey = crypto.randomBytes(32).toString('base64');
  const publicKey = crypto.randomBytes(32).toString('base64');
  const presharedKey = crypto.randomBytes(32).toString('base64');
  return { privateKey, publicKey, presharedKey };
}

// REAL WARP CONFIG GENERATOR - This gives real internet!
async function generateRealWarpConfig() {
  try {
    const keyPair = nacl.box.keyPair();
    const privateKeyB64 = Buffer.from(keyPair.secretKey).toString('base64');
    const publicKeyB64 = Buffer.from(keyPair.publicKey).toString('base64');
    const installId = crypto.randomUUID();

    const regRes = await fetch('https://api.cloudflareclient.com/v0a2158/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'okhttp/3.12.1',
        'CF-Client-Version': 'a-6.30-2158',
      },
      body: JSON.stringify({
        key: publicKeyB64,
        install_id: installId,
        fcm_token: `${installId}:APA91b${crypto.randomBytes(16).toString('hex')}`,
        tos: new Date().toISOString(),
        model: 'PC',
        serial_number: installId,
        locale: 'en_US'
      })
    });

    if (!regRes.ok) {
      const txt = await regRes.text();
      throw new Error(`WARP register failed ${regRes.status}: ${txt}`);
    }
    const regData = await regRes.json();

    // Enable warp
    const patchRes = await fetch(`https://api.cloudflareclient.com/v0a2158/reg/${regData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${regData.token}`,
        'User-Agent': 'okhttp/3.12.1',
        'CF-Client-Version': 'a-6.30-2158',
      },
      body: JSON.stringify({ warp_enabled: true })
    });

    if (!patchRes.ok) throw new Error('WARP enable failed');
    const patchData = await patchRes.json();

    const peer = patchData.config.peers[0];
    const iface = patchData.config.interface;
    const v4 = iface.addresses.v4;
    const v6 = iface.addresses.v6;

    const endpointHost = peer.endpoint.host.includes(':') ? peer.endpoint.host.split(':')[0] : peer.endpoint.host;
    const config = `[Interface]
PrivateKey = ${privateKeyB64}
Address = ${v4}/32
DNS = 1.1.1.1, 1.0.0.1
MTU = 1280

[Peer]
PublicKey = ${peer.public_key}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${endpointHost}:2408
# Cloudflare WARP - Real working internet!
# Client ID: ${patchData.config.client_id}
# Generated: ${new Date().toISOString()}
`;

    return config;
  } catch (e) {
    console.error('WARP gen error:', e);
    // Fallback to simple WARP-like config using public endpoint (may still work with WARP client but not WG)
    throw e;
  }
}

app.get('/api/servers', (req, res) => res.json(SERVERS));
app.get('/api/health', (req, res) => res.json({ status: 'ok', servers: SERVERS.length, real: 'WARP available', timestamp: Date.now() }));

app.get('/api/myip', async (req, res) => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    res.json(data);
  } catch { res.json({ ip: req.ip, city: 'Unknown', country_name: 'Unknown', org: 'Local' }); }
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
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120', 'Accept': 'text/html,*/*;q=0.8' }
    });
    clearTimeout(timeout);
    const ct = proxyRes.headers.get('content-type') || 'text/html';
    if (ct.includes('text/html')) {
      let html = await proxyRes.text();
      html = html.replace('</body>', `<div style="position:fixed;bottom:10px;right:10px;background:#10B981;color:white;padding:6px 12px;border-radius:9999px;font-family:sans-serif;font-size:12px;z-index:999999">🔒 VPN via ${req.body.server || 'WARP'}</div></body>`);
      res.setHeader('Content-Type', ct); res.send(html);
    } else {
      const buffer = Buffer.from(await proxyRes.arrayBuffer());
      res.setHeader('Content-Type', ct); res.send(buffer);
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// WARP REAL ENDPOINT - This gives real internet!
app.post('/api/warp/generate', async (req, res) => {
  try {
    const config = await generateRealWarpConfig();
    const qr = await QRCode.toDataURL(config);
    res.json({ config, qr, server: SERVERS[0], real: true, msg: 'Real working VPN! Scan with WireGuard app - full mobile internet will work!' });
  } catch (e) {
    res.status(500).json({ error: 'WARP generation failed: ' + e.message + '. Try again or use demo servers.' });
  }
});

app.post('/api/wireguard/generate', async (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[0];

  // If WARP server selected, generate REAL config
  if (server.id === 'warp-1' || server.real === true) {
    try {
      const config = await generateRealWarpConfig();
      const qr = await QRCode.toDataURL(config);
      return res.json({ config, qr, server, real: true });
    } catch (e) {
      // fallback to demo if WARP fails
    }
  }

  // Demo config for other servers
  const keys = generateWireGuardKeys();
  const clientAddress = `10.66.66.${Math.floor(Math.random()*200)+2}/32`;
  const config = `[Interface]
PrivateKey = ${keys.privateKey}
Address = ${clientAddress}
DNS = 1.1.1.1, 8.8.8.8
MTU = 1280

[Peer]
PublicKey = ${crypto.randomBytes(32).toString('base64')} # <-- Demo - Replace with YOUR SERVER PublicKey
PresharedKey = ${keys.presharedKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${server.ip}:51820
PersistentKeepalive = 25
# Server: ${server.city}, ${server.country} (${server.flag})
# Demo config - For real internet use WARP server or your own VPS
# https://github.com/itzZrifat/freevpn
`;
  try {
    const qr = await QRCode.toDataURL(config);
    res.json({ config, qr, server, real: false, note: 'Demo config - internet will not work. Use WARP server for real internet!' });
  } catch { res.json({ config, server }); }
});

app.post('/api/outline/generate', (req, res) => {
  const { serverId } = req.body;
  const server = SERVERS.find(s => s.id === serverId) || SERVERS[0];
  const method = 'chacha20-ietf-poly1305';
  const password = crypto.randomBytes(16).toString('hex');
  const port = 8388;
  const ssUri = `ss://${Buffer.from(`${method}:${password}`).toString('base64')}@${server.ip}:${port}#FreeVPN-${server.city}`;
  res.json({ server, ssUri });
});

app.get('*', (req, res) => {
  const candidates = [path.join(__dirname, 'public', 'index.html'), path.join(__dirname, 'index.html'), path.join(__dirname, 'surge-deploy', 'index.html')];
  for (const p of candidates) if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send('index.html not found');
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ VPN running on ${PORT} - ${SERVERS.length} servers - WARP REAL enabled`));
