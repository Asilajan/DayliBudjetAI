# Guide de déploiement sur CasaOS

## 📋 Modifications effectuées

### 1. Connexion directe à NocoDB
- ✅ Suppression du proxy Vite/Supabase
- ✅ Connexion HTTP directe à `http://192.168.1.11:8085`
- ✅ Authentification avec token NocoDB (`xc-token`)
- ✅ Mapping automatique des données NocoDB vers l'interface Transaction

### 2. Gestion des erreurs
- Si l'API NocoDB échoue, l'application affiche un tableau vide au lieu de crasher
- Les erreurs sont loggées dans la console du navigateur

---

## 🚀 Procédure de déploiement

### Étape 1 : Préparer le serveur

```bash
# Se connecter en SSH au serveur CasaOS
ssh votre-utilisateur@votre-serveur

# Créer le dossier de l'application
sudo mkdir -p /DATA/AppData/bolt-budget

# Donner les permissions
sudo chown -R 1000:1000 /DATA/AppData/bolt-budget
```

### Étape 2 : Transférer les fichiers

**Depuis votre machine locale :**

```bash
# Option A : Avec rsync (recommandé)
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  /tmp/cc-agent/62728410/project/ \
  votre-utilisateur@votre-serveur:/DATA/AppData/bolt-budget/

# Option B : Avec scp
scp -r /tmp/cc-agent/62728410/project/* \
  votre-utilisateur@votre-serveur:/DATA/AppData/bolt-budget/
```

### Étape 3 : Démarrer le conteneur

```bash
# Se placer dans le dossier
cd /DATA/AppData/bolt-budget

# Démarrer avec Docker Compose
docker compose up -d

# Vérifier les logs
docker compose logs -f
```

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur :
```
http://192.168.1.11:5173
```

---

## 🔧 Configuration avancée

### Modifier l'URL de NocoDB

Si votre instance NocoDB change d'adresse, éditez :
```
src/services/api.ts
```

Lignes 1-3 :
```typescript
const NOCODB_API_URL = 'http://VOTRE_IP:PORT/api/v2/tables/TABLE_ID/records';
const NOCODB_TOKEN = 'VOTRE_TOKEN';
const VIEW_ID = 'VOTRE_VIEW_ID';
```

### Changer le port d'écoute

Éditez `docker-compose.yaml` :
```yaml
ports:
  - "8080:5173"  # Remplacez 8080 par le port souhaité
```

---

## 🐛 Dépannage

### L'application ne charge pas les données

1. Vérifiez que NocoDB est accessible :
```bash
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=10
```

2. Ouvrez la console du navigateur (F12) et cherchez les erreurs.

### Erreur CORS

Si vous voyez une erreur CORS dans la console :
- NocoDB doit être configuré pour accepter les requêtes depuis l'origine de votre application
- Ajoutez `http://192.168.1.11:5173` dans les origines autorisées de NocoDB

### Le conteneur ne démarre pas

```bash
# Vérifier les logs d'erreur
docker compose logs

# Redémarrer le conteneur
docker compose restart

# Reconstruire si nécessaire
docker compose down
docker compose up -d --force-recreate
```

---

## 📝 Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Arrêter l'application
docker compose down

# Redémarrer l'application
docker compose restart

# Mettre à jour après modification des fichiers
docker compose restart
```

---

## ✅ Checklist de vérification

- [ ] NocoDB est accessible sur `http://192.168.1.11:8085`
- [ ] Le dossier `/DATA/AppData/bolt-budget` existe
- [ ] Les fichiers sont bien copiés dans ce dossier
- [ ] Le conteneur Docker est démarré (`docker ps`)
- [ ] Le port 5173 est accessible
- [ ] Les transactions s'affichent dans le dashboard
- [ ] Aucune erreur CORS dans la console du navigateur
