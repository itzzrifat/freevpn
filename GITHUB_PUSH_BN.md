# GitHub e Kivabe Diba? - 3 Ta Sohoj Upay (Bangla)

Ami tomar project git ready kore disi, ekhon sudhu push korte hobe. Jei upay easy lage seta koro.

---

### 🔥 Upay 1: GitHub Website diye (Sobcheye Sohoj - 1 minute)

Git install charai hobe:

1. **GitHub e jao:** https://github.com -> Login
2. **New Repository banao:**
   - Click `New` (upore + icon)
   - Name dao: `freevpn-web` ba `my-vpn-app`
   - Public select koro
   - **IMPORTANT:** `Add a README` UNCHECK rakho (khali repo lagbe)
   - Create Repository click

3. **File Upload:**
   - Notun repo te gele dekhba `uploading an existing file` link ache - oitate click
   - Ekhon tomar computer theke `freevpn-full-ready.zip` ta unzip kore sob file drag-and-drop kore dao
   - Niche `Commit changes` click

Bas! Done! Ekhon link paba: `https://github.com/tumar-username/freevpn-web`

**Render e deploy:**
- render.com -> New Web Service -> GitHub repo select -> Deploy

---

### 💻 Upay 2: Tumar Computer e Git diye (Developer der jonno)

Tumar PC te terminal/cmd khule:

```bash
# 1. Zip ta unzip koro, folder e dhuko
cd free-vpn-web

# 2. GitHub e khali repo banaiso (Upay 1 er step 2), link copy koro, example:
# https://github.com/YOUR_USERNAME/freevpn-web.git

# 3. Remote add koro
git remote add origin https://github.com/YOUR_USERNAME/freevpn-web.git

# 4. Push koro
git branch -M main
git push -u origin main
```

Password chaile GitHub Personal Access Token (PAT) lagbe:
- GitHub -> Settings -> Developer Settings -> Personal Access Tokens -> Tokens (classic) -> Generate New Token
- Scope: `repo` tick dao
- Token ta password er jaygay paste koro

---

### 🌐 Upay 3: Ei Arena Workspace thekei Direct Push (Amar theke)

Tumi jodi chao ami ekhuni GitHub e push kore dei, tahole:

1. GitHub e giye ekta **khali repo** banao name `freevpn-web`
2. Amake tomar GitHub username + ekta PAT token dao (temporary)

Tahole ami ei command diye push kore dibo:

```bash
git remote add origin https://TOKEN@github.com/USERNAME/freevpn-web.git
git push -u origin main
```

**Security:** Token diye dile pore tumi GitHub theke delete kore dite parba.

---

### Already Git Ready!

Ami `free-vpn-web` folder e already:

```bash
git init
git commit -m "FreeVPN ready"
```

kore disi. Sudhu `git remote add` + `push` baki.

---

### Render e Deploy Korar Por ki Hobe?

GitHub push korar por:
1. https://render.com e jao -> Free account
2. New Web Service -> tomar repo select
3. Render `render.yaml` auto peye jabe
4. Deploy click - 2 minute e live link paba: `https://freevpn-xxx.onrender.com`

Shei link tai hobe tomar Real Full VPN (backend soho)!

---

### Help Lagle Bolo

Tumar GitHub username ta dao, ami full command ready kore dibo copy-paste er jonno.
