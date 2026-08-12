# Kivabe Aro Server Add Korba? (Bangla Guide)

## Easy Method - server.js edit koro:

```js
const SERVERS = [
  { id: 'us-1', country: 'USA', city: 'New York', flag: '🇺🇸', ip: '104.21.12.34', ping: 145, load: 42, protocol: 'WireGuard' },
  // Ekhane notun add koro 👇
  { id: 'my-1', country: 'Malaysia', city: 'Kuala Lumpur', flag: '🇲🇾', ip: 'YOUR_VPS_IP', ping: 55, load: 20, protocol: 'WireGuard' },
];
```

Field gulo:
- `id`: unique name, jemon `bd-1`, `my-1`
- `country`: Desh er naam
- `city`: City
- `flag`: Emoji flag
- `ip`: Tomar VPS er IP (free Oracle VPS use koro)
- `ping`: Estimated ping (ms)
- `load`: 0-100%
- `protocol`: WireGuard / Outline

## GitHub e push korle auto Railway te update hobe:

```bash
git add server.js
git commit -m "Added new servers"
git push
```

Railway auto deploy kore dibe 1 min e!

## Tomarjonno 20 ta server ready kore disi:

Ager 6 ta + notun 14 ta:
- Canada, India, Australia, Netherlands, France, Turkey, Saudi Arabia, Qatar, Brazil, South Korea, Kuwait, Egypt, Indonesia, USA LA

File: `servers.json` + `server.js` e already add ache.

## Real Server Add Korar System:

1. Oracle Cloud free VPS nao (2 ta free lifetime)
2. Ubuntu 22.04
3. Run:
```
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
sudo ./wireguard-install.sh
```
4. Je IP paba seta server.js e bosao

## Unlimited Server Kora Jabe?

Yes! 100+ server add korte paro. Just array te aro object add koro.
