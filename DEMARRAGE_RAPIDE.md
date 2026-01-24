# ⚡ Démarrage rapide - Budget Dashboard sur CasaOS

## 🚀 Installation en 3 commandes

```bash
# 1. Transférer les fichiers
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ admin@192.168.1.11:/DATA/AppData/bolt-budget/

# 2. Déployer
./deploy-casaos.sh admin@192.168.1.11

# 3. Ouvrir
open http://192.168.1.11:5173
```

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
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1"
# ✅ Doit retourner du JSON avec vos données
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

**Cause :** Problème de token ou de mapping

**Solution express :**
```bash
# Tester l'API directement
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5&viewId=vwxltw3juurlv7mx"

# Si ça retourne des données, le problème est dans le code
# Vérifier les logs du navigateur (F12)
```

---

### ❌ Port 5173 déjà utilisé

**Solution express :**

Modifier `docker-compose.yaml` :
```yaml
# Remplacer :
network_mode: host

# Par :
ports:
  - "8080:5173"
```

Puis redémarrer et utiliser : `http://192.168.1.11:8080`

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
docker exec bolt-budget-dashboard sh -c "apk add curl && curl -H 'xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6' http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1"
```

---

## 🎯 Checklist de succès

- [ ] Fichiers copiés dans `/DATA/AppData/bolt-budget`
- [ ] `docker-compose.yaml` contient `network_mode: host`
- [ ] `docker ps` montre le conteneur "bolt-budget-dashboard"
- [ ] `docker logs` affiche "VITE ready in XXX ms"
- [ ] `http://192.168.1.11:5173` affiche l'interface
- [ ] Console du navigateur (F12) montre "✅ X transactions loaded"
- [ ] Les transactions s'affichent dans les widgets

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
**Prérequis :** Docker, SSH, NocoDB accessible sur 192.168.1.11:8085
