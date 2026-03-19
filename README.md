# 🖥️ Server Monitor Dashboard

Interface web de monitoring serveur en temps réel — CPU, mémoire, espace disque et services actifs.

> 🤖 Ce projet a été construit avec l'assistance de **Claude Sonnet 4.6** (Anthropic).

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm v9 ou supérieur
- Linux (Ubuntu/Debian recommandé) pour la collecte des métriques système
- `sudo` configuré pour `systemctl` si vous souhaitez redémarrer des services

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/fregent/server-monitoring-dashboard
cd server-monitor
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et l'éditer :

```bash
cp .env.example .env
```

Générer un hash bcrypt pour votre mot de passe :

```bash
node -e "const b = require('bcryptjs'); b.hash('votre_mot_de_passe', 10).then(console.log)"
```

Renseigner le fichier `.env` :

```env
PORT=3000
SESSION_SECRET=votre_secret_de_session_long_et_aleatoire
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=le_hash_genere_ci_dessus
```

> ⚠️ Ne jamais committer le fichier `.env`. Il est déjà inclus dans le `.gitignore`.

---

## ▶️ Lancement

### Mode développement (avec rechargement automatique)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

L'application est accessible sur **http://localhost:3000**

---

## 🔐 Connexion

Rendez-vous sur **http://localhost:3000/login** et connectez-vous avec les identifiants définis dans votre `.env`.

---

## 📁 Structure du projet

```
/server-monitor
  /public
    index.html        ← Dashboard principal (protégé)
    login.html        ← Page de connexion
    style.css         ← Styles globaux
    app.js            ← Logique frontend (fetch, Chart.js, alertes)
  /routes
    metrics.js        ← GET  /api/metrics
    auth.js           ← POST /api/auth/login|logout
    services.js       ← POST /api/services/:name/restart
  /services
    collector.js      ← Collecte des métriques système
  .env                ← Variables d'environnement (non commité)
  .env.example        ← Modèle de configuration
  .gitignore
  package.json
  server.js           ← Point d'entrée Express
```

---

## 🛠️ Stack technique

| Couche      | Technologie                     |
|-------------|----------------------------------|
| Backend     | Node.js + Express                |
| Métriques   | systeminformation                |
| Auth        | express-session + bcryptjs       |
| Frontend    | HTML / CSS / JavaScript vanilla  |
| Graphiques  | Chart.js (CDN)                   |

---

## ⚙️ Fonctionnalités

- 📊 Visualisation en temps réel (CPU, RAM, disque) via jauges Chart.js
- 🔄 Rafraîchissement automatique toutes les **5 secondes**
- 🚨 Alertes visuelles par couleur selon les seuils :
  - 🟡 Avertissement : > 60% CPU / > 70% RAM ou disque
  - 🔴 Danger : > 80% CPU / > 90% RAM ou disque
- 🔐 Authentification par session (login / logout)
- ♻️ Redémarrage de services depuis l'interface (whitelist sécurisée)

---

## 🔒 Sécurité

- Les mots de passe sont **hachés avec bcrypt** — jamais stockés en clair
- Le redémarrage de services est limité à une **whitelist** définie dans `routes/services.js`
- Les routes `/api/metrics` et `/api/services` sont **protégées par session**
- Le secret de session doit être une chaîne longue et aléatoire en production

---

## 📦 Scripts disponibles

```bash
npm start       # Lance le serveur en production
npm run dev     # Lance le serveur avec nodemon (développement)
```

---

## 🤖 Construit avec Claude Sonnet 4.6

Ce projet a été développé avec l'assistance de **Claude Sonnet 4.6**, le modèle d'IA d'[Anthropic](https://www.anthropic.com).  
Claude a guidé l'architecture, la structure du code, les bonnes pratiques de sécurité et la rédaction de cette documentation.

---

## 📄 Licence

MIT