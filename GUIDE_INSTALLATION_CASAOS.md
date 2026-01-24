# 🚀 Guide d'installation sur CasaOS - Budget Dashboard

## 📋 Prérequis

- CasaOS installé et fonctionnel
- Accès SSH à votre serveur (optionnel mais recommandé)
- NocoDB accessible sur `http://192.168.1.11:8085`

---

## 🔧 Méthode 1 : Installation via SSH (Recommandée)

### Étape 1 : Transférer les fichiers

**Depuis votre machine locale :**

```bash
# Transférer le projet vers CasaOS
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  /tmp/cc-agent/62728410/project/ \
  votre-user@192.168.1.11:/DATA/AppData/bolt-budget/
```

### Étape 2 : Démarrer l'application

**Sur le serveur CasaOS (via SSH) :**

```bash
# Se connecter
ssh votre-user@192.168.1.11

# Aller dans le dossier
cd /DATA/AppData/bolt-budget

# Démarrer le conteneur
docker compose up -d

# Vérifier les logs (CTRL+C pour quitter)
docker compose logs -f
```

### Étape 3 : Accéder à l'application

Ouvrez votre navigateur : **http://192.168.1.11:5173**

---

## 🖥️ Méthode 2 : Installation via l'interface CasaOS

### Étape 1 : Transférer les fichiers

Utilisez **WinSCP** (Windows) ou **FileZilla** (tous OS) pour copier le dossier du projet vers :
```
/DATA/AppData/bolt-budget/
```

### Étape 2 : Créer l'application dans CasaOS

1. Ouvrez CasaOS dans votre navigateur
2. Cliquez sur **"+"** (Ajouter une application)
3. Sélectionnez **"Install a customized app"** ou **"Docker Compose"**
4. Collez ce contenu :

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

5. Cliquez sur **"Install"**
6. Attendez 2-3 minutes (première installation)

### Étape 3 : Vérifier

- L'application devrait apparaître dans votre tableau de bord CasaOS
- Cliquez dessus ou allez sur : **http://192.168.1.11:5173**

---

## ✅ Vérification du fonctionnement

### 1. Vérifier les logs

```bash
docker compose logs -f bolt-budget-dashboard
```

Vous devriez voir :
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
➜ Network: http://192.168.1.11:5173/
```

### 2. Vérifier la connexion NocoDB

Ouvrez la console du navigateur (F12) et cherchez :
```
Fetching data from NocoDB...
XX transactions loaded from NocoDB
```

---

## 🔧 Résolution des problèmes courants

### ❌ Erreur 404 / Proxy Error

**Cause :** Le conteneur ne peut pas accéder à NocoDB

**Solution :**
```bash
# Vérifier que NocoDB est accessible
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1

# Redémarrer l'application
docker compose restart
```

### ❌ Port 5173 déjà utilisé

**Solution :** Modifier `docker-compose.yaml` (mode bridge au lieu de host) :

```yaml
services:
  bolt-budget:
    ports:
      - "8080:5173"  # Utilisez 8080 ou un autre port libre
    # Retirez la ligne : network_mode: host
```

Puis accédez via : `http://192.168.1.11:8080`

### ❌ Aucune transaction n'apparaît

**Vérifications :**

1. **Vérifier les credentials NocoDB dans `src/services/api.ts` :**
   ```typescript
   const NOCODB_API_URL = 'http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records';
   const NOCODB_TOKEN = 'c22e92a6-2a3d-4edf-a98e-4044834daea6';
   ```

2. **Vérifier les noms de colonnes dans NocoDB :**
   - `Id` (nombre)
   - `Produit` (texte)
   - `Prix` ou `Prix_U` (nombre)
   - `Date` (date)
   - `Categorie` (texte)
   - `Tags` (texte)

3. **Tester l'API directement :**
   ```bash
   curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
     "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5&viewId=vwxltw3juurlv7mx"
   ```

---

## 🔄 Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Redémarrer l'application
docker compose restart

# Arrêter l'application
docker compose down

# Mettre à jour après modifications de code
docker compose restart

# Supprimer complètement et recréer
docker compose down
docker compose up -d --build

# Voir l'état du conteneur
docker ps | grep bolt-budget
```

---

## 🔒 Configuration NocoDB

### Structure de table attendue

| Colonne     | Type   | Obligatoire | Description                    |
|-------------|--------|-------------|--------------------------------|
| Id          | Number | Oui         | Identifiant unique             |
| Produit     | Text   | Oui         | Nom du produit/transaction     |
| Prix        | Number | Oui*        | Montant (négatif = dépense)    |
| Date        | Date   | Oui         | Date de la transaction         |
| Categorie   | Text   | Non         | Catégorie (défaut: "Non classé") |
| Tags        | Text   | Non         | Tags séparés par des virgules  |

*Si `Prix` est vide, le système cherchera `Prix_U` ou `prix`

### Exemple de données

```
Id: 1
Produit: "Courses Carrefour"
Prix: 45.50
Date: "2026-01-24"
Categorie: "Alimentation"
Tags: "courses,supermarché"
```

---

## 🎯 Prochaines étapes

Une fois l'installation fonctionnelle :

1. **Tester** : Ajouter une transaction dans NocoDB et cliquer sur "Sync" dans le dashboard
2. **Personnaliser** : Modifier les catégories et tags selon vos besoins
3. **Sauvegarder** : Faire des backups réguliers de `/DATA/AppData/bolt-budget`

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `docker compose logs -f`
2. Testez l'API NocoDB directement avec curl
3. Vérifiez que le port 5173 est bien ouvert
4. Consultez la console du navigateur (F12)

**L'application devrait maintenant fonctionner correctement !** 🎉
