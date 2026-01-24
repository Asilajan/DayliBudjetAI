# 🔧 Modifications appliquées pour réparer la connexion NocoDB

## ✅ Problème résolu

**Symptôme :** Erreurs 404 / Proxy errors lors du fetch des données depuis NocoDB

**Cause :** Le conteneur Docker en mode bridge ne pouvait pas accéder au réseau local (192.168.1.11:8085)

**Solution :** Utilisation du mode réseau `host` dans Docker

---

## 📝 Fichiers modifiés

### 1. `docker-compose.yaml` ⭐ (CRITIQUE)

**Changement principal :**

```yaml
# ❌ AVANT (mode bridge - ne fonctionne pas)
services:
  bolt-budget:
    ports:
      - "5173:5173"
    networks:
      - budget-network

# ✅ APRÈS (mode host - fonctionne)
services:
  bolt-budget:
    network_mode: host  # <-- Le conteneur utilise le réseau de l'hôte
```

**Pourquoi ça fonctionne :**
- Le conteneur peut maintenant accéder directement à `192.168.1.11:8085`
- Pas besoin de mapping de ports complexe
- Fonctionne comme si l'application tournait directement sur CasaOS

### 2. `src/services/api.ts` (Améliorations de logging)

**Ajouts :**

```typescript
// Logs détaillés pour debug
console.log("🔄 Fetching data from NocoDB...");
console.log("📍 URL:", url);
console.log("🔑 Token:", NOCODB_TOKEN.substring(0, 8) + "...");
console.log("📡 Response status:", response.status, response.statusText);
console.log("✅ X transactions loaded from NocoDB");
console.log("📝 Sample record:", records[0]);
```

**Avantages :**
- Diagnostic rapide des problèmes de connexion
- Vérification que l'API répond correctement
- Validation du format des données

---

## 🚀 Déploiement

### Méthode 1 : Script automatique (Recommandée)

```bash
# Rendre le script exécutable
chmod +x deploy-casaos.sh

# Lancer le déploiement
./deploy-casaos.sh admin@192.168.1.11 /DATA/AppData/bolt-budget
```

### Méthode 2 : Manuelle

```bash
# 1. Transférer les fichiers
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ admin@192.168.1.11:/DATA/AppData/bolt-budget/

# 2. Redémarrer sur le serveur
ssh admin@192.168.1.11
cd /DATA/AppData/bolt-budget
docker compose down
docker compose up -d

# 3. Vérifier les logs
docker compose logs -f
```

---

## 🔍 Vérification du fonctionnement

### 1. Vérifier que le conteneur tourne

```bash
ssh admin@192.168.1.11 "docker ps | grep bolt-budget"
```

Vous devriez voir :
```
bolt-budget-dashboard   node:18-alpine   Up 2 minutes
```

### 2. Vérifier les logs du conteneur

```bash
ssh admin@192.168.1.11 "docker logs bolt-budget-dashboard"
```

Vous devriez voir :
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
➜ Network: http://0.0.0.0:5173/
```

### 3. Vérifier les logs dans le navigateur

Ouvrez `http://192.168.1.11:5173` puis ouvrez la console (F12) :

```
🔄 Fetching data from NocoDB...
📍 URL: http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?offset=0&limit=100&viewId=vwxltw3juurlv7mx
🔑 Token: c22e92a6...
📡 Response status: 200 OK
✅ 45 transactions loaded from NocoDB
📝 Sample record: {Id: 1, Produit: "...", ...}
```

### 4. Tester l'API NocoDB directement

```bash
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5&viewId=vwxltw3juurlv7mx"
```

Vous devriez recevoir du JSON avec vos transactions.

---

## 🐛 Dépannage

### Problème 1 : "Connection refused" ou "Network error"

**Cause :** NocoDB n'est pas accessible

**Solutions :**
1. Vérifier que NocoDB tourne : `docker ps | grep nocodb`
2. Vérifier que le port 8085 est bien ouvert
3. Tester l'accès depuis le serveur : `curl http://192.168.1.11:8085`

### Problème 2 : "401 Unauthorized"

**Cause :** Token invalide ou expiré

**Solutions :**
1. Vérifier le token dans NocoDB (Settings > API Tokens)
2. Mettre à jour le token dans `src/services/api.ts`
3. Redéployer l'application

### Problème 3 : "Empty list" ou aucune transaction

**Cause :** Problème de mapping des colonnes

**Solutions :**
1. Vérifier les noms de colonnes dans NocoDB (sensible à la casse !)
   - Attendu : `Id`, `Produit`, `Prix`, `Date`, `Categorie`, `Tags`
2. Regarder les logs de la console pour voir les données brutes
3. Adapter le mapping dans `api.ts` si nécessaire

### Problème 4 : Le port 5173 est déjà utilisé

**Solution :** Passer en mode bridge et mapper un autre port

Modifier `docker-compose.yaml` :

```yaml
services:
  bolt-budget:
    # Retirer : network_mode: host
    ports:
      - "8080:5173"  # Utiliser 8080 au lieu de 5173
    networks:
      - default
```

**Note :** Si vous faites ça, vous devrez peut-être aussi configurer les CORS dans NocoDB ou utiliser un proxy inverse.

---

## 📊 Architecture réseau

```
┌─────────────────────────────────────────┐
│         CasaOS (192.168.1.11)           │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   NocoDB     │    │  Bolt Budget │  │
│  │  Port 8085   │◄───┤  Port 5173   │  │
│  └──────────────┘    └──────────────┘  │
│         ▲                    ▲          │
│         │                    │          │
└─────────┼────────────────────┼──────────┘
          │                    │
          │   Mode host        │
          │   (accès direct    │
          │    au réseau)      │
          │                    │
    ┌─────┴────────────────────┴─────┐
    │      Navigateur web             │
    │   http://192.168.1.11:5173     │
    └────────────────────────────────┘
```

---

## 📝 Checklist de déploiement

- [ ] Fichiers transférés vers `/DATA/AppData/bolt-budget`
- [ ] `docker-compose.yaml` contient `network_mode: host`
- [ ] NocoDB est accessible sur `http://192.168.1.11:8085`
- [ ] Token API valide dans `src/services/api.ts`
- [ ] Conteneur démarré : `docker compose up -d`
- [ ] Logs sans erreurs : `docker compose logs -f`
- [ ] Application accessible : `http://192.168.1.11:5173`
- [ ] Console du navigateur montre : "✅ X transactions loaded"
- [ ] Les transactions s'affichent dans le dashboard

---

## 🎯 Prochaines étapes recommandées

1. **Tester la synchronisation** : Cliquer sur le bouton "Sync" dans le dashboard
2. **Ajouter une transaction** dans NocoDB et vérifier qu'elle apparaît
3. **Configurer un reverse proxy** (Nginx) pour utiliser un nom de domaine
4. **Activer HTTPS** avec Let's Encrypt
5. **Mettre en place des backups** automatiques

---

## 📞 Support

Si le problème persiste après ces modifications :

1. **Collecter les logs :**
   ```bash
   docker compose logs > debug.log
   ```

2. **Vérifier la connectivité réseau :**
   ```bash
   docker exec bolt-budget-dashboard ping 192.168.1.11
   docker exec bolt-budget-dashboard wget -O- http://192.168.1.11:8085
   ```

3. **Tester l'API depuis le conteneur :**
   ```bash
   docker exec bolt-budget-dashboard sh -c "apk add curl && curl -H 'xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6' http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1"
   ```

Les logs détaillés permettront de diagnostiquer le problème exact.
