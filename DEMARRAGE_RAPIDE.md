# ⚡ Démarrage rapide - Bolt Budget sur CasaOS

## 🚀 Installation en 5 minutes

### 📋 Prérequis

1. **Token NocoDB** : Créez un token dans NocoDB (Profil → Account Settings → Tokens)
2. **SSH** : Accès SSH à votre serveur CasaOS

### Installation

```bash
# 1. Cloner le projet
cd /DATA/AppData
git clone https://github.com/Asilajan/DayliBudjetAI.git bolt-budget-source
cd bolt-budget-source

# 2. Configurer le token NocoDB
nano .env
# Mettez à jour : VITE_NOCODB_API_TOKEN=VOTRE_TOKEN

# 3. Tester la connexion (optionnel)
./test-nocodb-connection.sh

# 4. Installer
chmod +x install-casaos.sh
./install-casaos.sh

# 5. Vérifier
docker logs -f bolt-budget-dashboard
```

Accédez à : `http://VOTRE_IP:5131`

---

## 🔧 Installation manuelle (si le script ne fonctionne pas)

```bash
# Sur votre machine locale
cd /tmp/cc-agent/62728410/project
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ admin@192.168.1.11:/DATA/AppData/bolt-budget/

# Sur le serveur CasaOS (SSH)
ssh admin@192.168.1.11
cd /DATA/AppData/bolt-budget
docker compose down
docker compose up -d

# Vérifier
docker compose logs -f
```

---

## ✅ Vérification rapide

### 1. Le conteneur tourne ?
```bash
docker ps | grep bolt-budget
# ✅ Doit afficher : bolt-budget-dashboard ... Up X minutes
```

### 2. Les logs sont bons ?
```bash
docker logs bolt-budget-dashboard | tail -n 20
# ✅ Doit contenir : "VITE ready" et "Local: http://localhost:5173/"
```

### 3. L'application répond ?
```bash
curl http://192.168.1.11:5173
# ✅ Doit retourner du HTML
```

### 4. L'API NocoDB fonctionne ?
```bash
# Utilisez votre token et votre URL depuis le .env
./test-nocodb-connection.sh
# ✅ Doit afficher "Connexion réussie"
```

---

## 🐛 Problèmes courants

### ❌ "Connection refused" ou erreur 404

**Cause :** Le conteneur ne peut pas accéder à NocoDB

**Solution express :**
```bash
# Vérifier que docker-compose.yaml contient :
grep "network_mode" docker-compose.yaml
# ✅ Doit afficher : network_mode: host

# Si absent, ajouter cette ligne et redémarrer :
docker compose down
docker compose up -d
```

---

### ❌ Aucune transaction ne s'affiche

**Cause :** Problème de token ou de configuration

**Solution express :**
```bash
# 1. Tester la connexion
./test-nocodb-connection.sh

# 2. Vérifier le .env
cat .env | grep NOCODB

# 3. Créer un nouveau token dans NocoDB si nécessaire
# 4. Mettre à jour le .env et redémarrer
docker restart bolt-budget-dashboard
```

---

### ❌ Port 5131 déjà utilisé

**Solution express :**
```bash
# Voir quel processus utilise le port
netstat -tulpn | grep 5131

# Arrêter le processus ou changer le port dans vite.config.ts
```

---

## 📦 Contenu de docker-compose.yaml

```yaml
version: "3.8"

services:
  bolt-budget:
    image: node:18-alpine
    container_name: bolt-budget-dashboard
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    network_mode: host
    volumes:
      - /DATA/AppData/bolt-budget:/app
    environment:
      - NODE_ENV=development
    restart: unless-stopped
```

**Important :** La ligne `network_mode: host` est CRITIQUE !

---

## 🔍 Commandes de diagnostic

```bash
# Statut du conteneur
docker ps | grep bolt-budget

# Logs en direct
docker compose logs -f

# Redémarrer
docker compose restart

# Recréer complètement
docker compose down
docker compose up -d --force-recreate

# Tester l'API depuis le conteneur
./test-nocodb-connection.sh
```

---

## 🎯 Checklist de succès

- [ ] Projet cloné dans `/DATA/AppData/bolt-budget-source`
- [ ] Token NocoDB configuré dans `.env`
- [ ] `./test-nocodb-connection.sh` affiche "✅ Connexion réussie"
- [ ] `docker ps` montre le conteneur "bolt-budget-dashboard"
- [ ] `docker logs` affiche "VITE ready in XXX ms"
- [ ] `http://VOTRE_IP:5131` affiche l'interface
- [ ] Console du navigateur (F12) montre "✅ X transactions loaded"
- [ ] Les transactions s'affichent dans les widgets
- [ ] L'icône apparaît dans CasaOS

---

## 📚 Documentation complète

Si vous avez besoin de plus de détails :

- **Guide complet** : `GUIDE_INSTALLATION_CASAOS.md`
- **Doc technique** : `MODIFICATIONS_RESEAU.md`
- **Résumé des modifs** : `RESUME_MODIFICATIONS.md`

---

## 🧪 Script de test

Pour tester automatiquement la connexion :

```bash
chmod +x test-nocodb-connection.sh
./test-nocodb-connection.sh
```

Ce script teste la connexion à NocoDB depuis :
1. Votre machine locale
2. Le serveur CasaOS
3. Le conteneur Docker

---

## 💡 Astuce

Pour voir en temps réel ce qui se passe :

**Terminal 1 :** Logs Docker
```bash
docker compose logs -f
```

**Terminal 2 :** Logs HTTP
```bash
docker logs bolt-budget-dashboard 2>&1 | grep -i "http\|error\|vite"
```

**Navigateur :** Console (F12)
- Onglet "Console" : Voir les logs JavaScript
- Onglet "Network" : Voir les requêtes HTTP

---

**Temps d'installation estimé :** 5 minutes
**Prérequis :** Docker, SSH, NocoDB avec token API

## 📚 Documentation

- **Configuration NocoDB** : `CONFIGURATION_NOCODB.md` (détails complets)
- **Installation CasaOS** : `INSTALLATION_CASAOS.md` (3 méthodes)
- **Index complet** : `INDEX_DOCUMENTATION.md`
