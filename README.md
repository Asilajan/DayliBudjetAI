# 💰 Budget Dashboard - DailyBudgetAI

> Application React moderne de suivi budgétaire connectée à NocoDB, optimisée pour CasaOS

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Platform](https://img.shields.io/badge/platform-CasaOS-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## ✨ Fonctionnalités

- 📊 **Dashboard en temps réel** : Visualisation instantanée de vos dépenses
- 💳 **Suivi des transactions** : Toutes vos transactions synchronisées depuis NocoDB
- 📈 **Analyses budgétaires** : Insights et statistiques sur vos dépenses
- 🏷️ **Catégorisation** : Organisation par catégories et tags
- 🔄 **Synchronisation** : Bouton de sync pour rafraîchir les données
- 📱 **Responsive** : Interface adaptée mobile, tablette et desktop

## 🚀 Installation rapide (5 minutes)

```bash
# 1. Cloner ou transférer les fichiers
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ admin@192.168.1.11:/DATA/AppData/bolt-budget/

# 2. Déployer automatiquement
./deploy-casaos.sh admin@192.168.1.11

# 3. Ouvrir dans le navigateur
open http://192.168.1.11:5173
```

**📖 Guide complet :** Voir [`DEMARRAGE_RAPIDE.md`](DEMARRAGE_RAPIDE.md)

## 📚 Documentation

### Guides d'installation

| Guide | Durée | Pour qui ? |
|-------|-------|------------|
| [⚡ Démarrage rapide](DEMARRAGE_RAPIDE.md) | 5 min | Utilisateurs expérimentés |
| [📖 Guide complet CasaOS](GUIDE_INSTALLATION_CASAOS.md) | 15 min | Première installation |
| [🔧 Modifications réseau](MODIFICATIONS_RESEAU.md) | 20 min | Debugging avancé |

### Référence

| Document | Description |
|----------|-------------|
| [📋 Résumé des modifications](RESUME_MODIFICATIONS.md) | Vue d'ensemble des changements |
| [📦 Livrables](LIVRABLES.md) | Liste complète des fichiers |
| [📚 Index](INDEX_DOCUMENTATION.md) | Navigation dans la documentation |

### Scripts

| Script | Usage | Description |
|--------|-------|-------------|
| [`deploy-casaos.sh`](deploy-casaos.sh) | `./deploy-casaos.sh user@ip` | Déploiement automatique |
| [`test-nocodb-connection.sh`](test-nocodb-connection.sh) | `./test-nocodb-connection.sh` | Test de connexion NocoDB |

**🗺️ Navigation complète :** Voir [`INDEX_DOCUMENTATION.md`](INDEX_DOCUMENTATION.md)

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         CasaOS (192.168.1.11)           │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   NocoDB     │◄───┤Budget Dashboard│ │
│  │  Port 8085   │    │   Port 5173   │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
            ▲
            │
      ┌─────┴─────┐
      │ Navigateur │
      └───────────┘
```

### Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + Framer Motion
- **Icons** : Lucide React
- **Base de données** : NocoDB (API REST)
- **Déploiement** : Docker + CasaOS

## ⚙️ Configuration

### Prérequis

- CasaOS installé
- NocoDB accessible sur `http://192.168.1.11:8085`
- Docker et Docker Compose
- Node.js 18+ (pour développement local)

### Variables d'environnement

Configuration hardcodée dans `src/services/api.ts` :

```typescript
const NOCODB_API_URL = 'http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records';
const NOCODB_TOKEN = 'c22e92a6-2a3d-4edf-a98e-4044834daea6';
const VIEW_ID = 'vwxltw3juurlv7mx';
```

### Structure NocoDB requise

| Colonne   | Type   | Requis | Description |
|-----------|--------|--------|-------------|
| Id        | Number | ✅ Oui | Identifiant unique |
| Produit   | Text   | ✅ Oui | Nom de la transaction |
| Prix      | Number | ✅ Oui | Montant |
| Date      | Date   | ✅ Oui | Date (YYYY-MM-DD) |
| Categorie | Text   | ❌ Non | Catégorie |
| Tags      | Text   | ❌ Non | Tags (séparés par virgules) |

## 🔧 Développement local

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## 🐳 Docker

### Configuration

Le fichier `docker-compose.yaml` utilise le **mode réseau host** pour permettre l'accès direct à NocoDB :

```yaml
services:
  bolt-budget:
    image: node:18-alpine
    network_mode: host  # ← CRITIQUE pour accéder à NocoDB
    volumes:
      - /DATA/AppData/bolt-budget:/app
```

### Commandes utiles

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Logs
docker compose logs -f

# Redémarrer
docker compose restart

# Recréer
docker compose up -d --force-recreate
```

## ✅ Vérification

### L'application fonctionne ?

```bash
# 1. Conteneur actif ?
docker ps | grep bolt-budget
# ✅ Doit afficher : bolt-budget-dashboard ... Up X minutes

# 2. Logs OK ?
docker logs bolt-budget-dashboard | grep "VITE ready"
# ✅ Doit afficher : VITE ready in XXX ms

# 3. Application accessible ?
curl http://192.168.1.11:5173
# ✅ Doit retourner du HTML

# 4. API NocoDB accessible ?
./test-nocodb-connection.sh
# ✅ Doit afficher : "✅ Connexion réussie"
```

### Dans le navigateur

1. Ouvrir : `http://192.168.1.11:5173`
2. Ouvrir la console (F12)
3. Vérifier les logs :

```
🔄 Fetching data from NocoDB...
📡 Response status: 200 OK
✅ 45 transactions loaded from NocoDB
```

## 🐛 Dépannage

### Erreur 404 / Connection refused

**Problème :** Le conteneur ne peut pas accéder à NocoDB

**Solution :**
```bash
# Vérifier que docker-compose.yaml contient :
grep "network_mode" docker-compose.yaml
# Doit afficher : network_mode: host

# Sinon, redéployer
docker compose down
docker compose up -d
```

### Aucune transaction

**Solution :**
```bash
# Tester l'API directement
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5"
```

**📖 Dépannage complet :** Voir [`MODIFICATIONS_RESEAU.md`](MODIFICATIONS_RESEAU.md)

## 📊 Structure du projet

```
bolt-budget/
├── src/
│   ├── components/          # Composants React
│   │   ├── AccountBalanceWidget.tsx
│   │   ├── InsightsWidget.tsx
│   │   ├── SpendingWidget.tsx
│   │   ├── TrackerWidget.tsx
│   │   ├── TransactionsWidget.tsx
│   │   ├── InboxWidget.tsx
│   │   └── SyncStatus.tsx
│   ├── services/
│   │   ├── api.ts          # ⭐ Connexion NocoDB
│   │   └── localStorage.ts
│   ├── utils/
│   │   └── budgetAnalyzer.ts
│   ├── App.tsx             # Composant principal
│   └── main.tsx
├── public/                  # Assets statiques
├── docker-compose.yaml      # ⭐ Config Docker (mode host)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── 📚 Documentation/
    ├── INDEX_DOCUMENTATION.md
    ├── DEMARRAGE_RAPIDE.md
    ├── GUIDE_INSTALLATION_CASAOS.md
    ├── MODIFICATIONS_RESEAU.md
    ├── RESUME_MODIFICATIONS.md
    ├── LIVRABLES.md
    ├── deploy-casaos.sh
    └── test-nocodb-connection.sh
```

## 🔐 Sécurité

- ⚠️ Le token NocoDB est en clair dans le code
- 🔒 Pour la production, utiliser des variables d'environnement
- 🔒 Configurer HTTPS avec un reverse proxy (Nginx + Let's Encrypt)
- 🔒 Activer l'authentification sur NocoDB

## 🚀 Production

### Recommandations

1. **Reverse proxy** : Configurer Nginx pour HTTPS
2. **Variables d'environnement** : Externaliser les credentials
3. **Backup** : Sauvegarder `/DATA/AppData/bolt-budget` régulièrement
4. **Monitoring** : Surveiller les logs Docker
5. **Mise à jour** : Redéployer avec `./deploy-casaos.sh`

### Build de production

```bash
# Build optimisé
npm run build

# Les fichiers sont dans dist/
ls -lh dist/
```

## 📝 License

Ce projet est fourni tel quel pour usage personnel.

## 🤝 Contribution

Pour signaler un bug ou proposer une amélioration :

1. Collecter les logs : `docker compose logs > debug.log`
2. Exécuter : `./test-nocodb-connection.sh`
3. Consulter la documentation de dépannage

## 📞 Support

### Première étape : Diagnostic automatique

```bash
# Test complet de connexion
./test-nocodb-connection.sh

# Logs détaillés
docker compose logs > debug.log
```

### Documentation

- **Installation** : [`GUIDE_INSTALLATION_CASAOS.md`](GUIDE_INSTALLATION_CASAOS.md)
- **Dépannage** : [`MODIFICATIONS_RESEAU.md`](MODIFICATIONS_RESEAU.md)
- **Navigation** : [`INDEX_DOCUMENTATION.md`](INDEX_DOCUMENTATION.md)

---

**Développé avec :** React + TypeScript + Vite + Tailwind CSS
**Optimisé pour :** CasaOS + NocoDB
**Version :** 1.0
**Statut :** ✅ Production Ready
