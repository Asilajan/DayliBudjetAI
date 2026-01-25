# Configuration NocoDB

## 📋 Obtenir vos identifiants NocoDB

### 1. Obtenir le Token API

1. Ouvrez **NocoDB**
2. Cliquez sur votre profil (en haut à droite)
3. Allez dans **Account Settings**
4. Dans l'onglet **Tokens**, cliquez sur **Create Token**
5. Copiez le token généré

### 2. Obtenir l'URL de la table "Tiquets"

1. Dans NocoDB, ouvrez votre workspace **Getting Started**
2. Ouvrez la table **Tiquets**
3. Cliquez sur les **3 points** (menu) en haut à droite
4. Sélectionnez **API Snippet**
5. Copiez l'URL qui ressemble à :
   ```
   http://votre-ip:8085/api/v2/tables/ID_TABLE/records
   ```

### 3. Configurer le fichier .env

Ouvrez le fichier `.env` à la racine du projet et mettez à jour :

```bash
# URL de votre NocoDB (table Tiquets)
VITE_NOCODB_API_URL=http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records

# Token API NocoDB
VITE_NOCODB_API_TOKEN=VOTRE_TOKEN_ICI

# URLs optionnelles (autres tables)
VITE_NOCODB_BUDGET_URL=http://casaoslenovo.duckdns.org:8085/api/v2/tables/mqqdgf38wuqx9wt/records
VITE_NOCODB_EXPENSES_URL=http://casaoslenovo.duckdns.org:8085/api/v2/tables/me8gbce531j8y4r/records
VITE_NOCODB_EMAILS_URL=http://casaoslenovo.duckdns.org:8085/api/v2/tables/mu6qbduzo796zgh/records
```

### 4. Structure de la table Tiquets

Assurez-vous que votre table contient ces colonnes :

| Colonne    | Type     | Description                |
|------------|----------|----------------------------|
| Id         | Number   | ID unique (auto)           |
| Produit    | Text     | Nom du produit/transaction |
| Prix       | Number   | Montant en euros          |
| Date       | Date     | Date de la transaction     |
| Categorie  | Text     | Catégorie (Alimentation, Boisson, Maison, etc.) |
| Tags       | Text     | Tags séparés par virgules (optionnel) |

## 🚀 Déploiement sur CasaOS avec NocoDB

### Option 1 : Mise à jour rapide

Si le conteneur existe déjà :

```bash
# Arrêter le conteneur
docker stop bolt-budget-dashboard

# Mettre à jour le .env dans le volume
nano /DATA/AppData/bolt-budget/.env

# Redémarrer
docker start bolt-budget-dashboard
```

### Option 2 : Installation complète

```bash
# Cloner le projet
cd /DATA/AppData
git clone https://github.com/Asilajan/DayliBudjetAI.git bolt-budget-source
cd bolt-budget-source

# Configurer le .env
nano .env

# Installer
chmod +x install-casaos.sh
./install-casaos.sh
```

## 🔍 Vérification

### Tester la connexion

```bash
# Voir les logs en temps réel
docker logs -f bolt-budget-dashboard
```

Vous devriez voir :
```
🔄 Fetching data from NocoDB...
📍 URL: http://casaoslenovo.duckdns.org:8085/...
✅ X transactions loaded from NocoDB
```

### Test manuel de l'API

```bash
curl -X GET "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?offset=0&limit=10" \
  -H "Content-Type: application/json" \
  -H "xc-token: VOTRE_TOKEN"
```

## 🐛 Dépannage

### Erreur 401 - Authentication Required

- Vérifiez que le token est correct
- Assurez-vous que le token n'a pas expiré
- Créez un nouveau token si nécessaire

### Erreur 404 - Table Not Found

- Vérifiez l'ID de la table dans l'URL
- Assurez-vous que la table existe dans NocoDB

### Aucune donnée affichée

- Vérifiez que la table contient des données
- Consultez les logs : `docker logs bolt-budget-dashboard`
- Vérifiez les colonnes de la table

### Connexion réseau

Si NocoDB est sur le même serveur :
```bash
# Utiliser l'IP locale au lieu du domaine
VITE_NOCODB_API_URL=http://192.168.1.XX:8085/api/v2/tables/...
```

## 📊 Format des données

L'application attend ce format de NocoDB :

```json
{
  "list": [
    {
      "Id": 1,
      "Produit": "4x75CL VOLVIC VITA",
      "Prix": 1.70,
      "Date": "2024-01-20",
      "Categorie": "Boisson",
      "Tags": "supermarché,eau"
    }
  ],
  "pageInfo": {
    "totalRows": 100
  }
}
```
