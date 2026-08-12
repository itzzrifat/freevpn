# Fix for itzZrifat/freevpn - index.html location

Tumi root e index.html upload korso, tai puran server.js public/index.html khujto ar fail korto.

Ami server.js fix kore disi:

- Ekhon public/index.html thakle o kaj korbe
- Root e index.html thakle o kaj korbe
- Surge-deploy folder thakle o kaj korbe

## Ki korte hobe ekhon?

1. Ei repo te `server.js` file ta delete koro
2. Notun fixed `server.js` upload koro (ami niche dilam / free-vpn-web folder e ache)
3. Commit

Tarpor Render e deploy.

New server.js path: /home/user/free-vpn-web/server.js
