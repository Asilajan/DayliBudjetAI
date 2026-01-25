# 🔧 Solution : Aucune donnée NocoDB

## Le problème

Les variables d'environnement du fichier `.env` n'étaient pas passées au conteneur Docker.

## ✅ Solution appliquée

Les fichiers `docker-compose.yaml` et `docker-compose-casaos.yaml` ont été mis à jour pour inclure les variables d'environnement.

## 📝 Pour appliquer la correction

### Sur votre serveur CasaOS :

```bash
# 1. Arrêter le conteneur
cd /DATA/AppData/bolt-budget-source
docker compose down

# 2. Mettre à jour les fichiers
git pull

# 3. Redémarrer avec les nouvelles variables
docker compose up -d

# 4. Vérifier les logs
docker logs -f bolt-budget-dashboard
```

Vous devriez maintenant voir dans les logs :
```
🔄 Fetching data from NocoDB...
📍 URL: http://casaoslenovo.duckdns.org:8085/...
✅ X transactions loaded from NocoDB
```

## 🧪 Test de connexion

Depuis le serveur, testez la connexion :

```bash
# Test depuis la machine
curl -H "xc-token: KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm" \
  "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1"
```

Si ça retourne du JSON avec vos données, c'est bon !

## 🔍 Vérification dans le navigateur

1. Ouvrez `http://192.168.1.11:5131`
2. Appuyez sur `F12` pour ouvrir la console
3. Vous devriez voir :
   - `🔄 Fetching data from NocoDB...`
   - `✅ X transactions loaded from NocoDB`

## ⚠️ Si ça ne fonctionne toujours pas

### 1. Vérifiez que le .env est présent

```bash
cd /DATA/AppData/bolt-budget-source
cat .env | grep NOCODB
```

Vous devriez voir :
```
VITE_NOCODB_API_URL=http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records
VITE_NOCODB_API_TOKEN=KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm
```

### 2. Vérifiez que les variables sont passées au conteneur

```bash
docker exec bolt-budget-dashboard env | grep VITE_NOCODB
```

Vous devriez voir les variables.

### 3. Recréez le conteneur complètement

```bash
docker compose down
docker compose up -d --force-recreate
docker logs -f bolt-budget-dashboard
```

### 4. Testez l'API depuis le conteneur

```bash
docker exec bolt-budget-dashboard sh -c "apk add curl && curl -H 'xc-token: KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm' 'http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1'"
```

## 🎯 Checklist

- [ ] `docker-compose.yaml` contient les variables d'environnement
- [ ] `.env` existe et contient le token NocoDB
- [ ] Le conteneur a redémarré : `docker compose down && docker compose up -d`
- [ ] Les logs montrent "✅ X transactions loaded"
- [ ] L'interface affiche vos transactions

## 💡 Note importante

**Les variables VITE_* doivent être définies au démarrage de Vite pour être injectées dans le code JavaScript.**

C'est pourquoi il est essentiel de :
1. Avoir le fichier `.env` avec les bonnes valeurs
2. Passer ces variables dans `docker-compose.yaml`
3. Redémarrer le conteneur après toute modification
