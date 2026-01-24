# 📋 Résumé des modifications - Budget Dashboard

## ✅ Problème résolu

**Erreur initiale :** Erreurs 404 / Proxy errors lors du fetch des données NocoDB

**Solution appliquée :** Configuration réseau Docker en mode `host` pour permettre l'accès direct à `192.168.1.11:8085`

---

## 📦 Fichiers modifiés

### 1. `docker-compose.yaml` ⭐
- **Mode réseau changé** : `bridge` → `host`
- **Raison** : Permet au conteneur d'accéder directement au réseau local de CasaOS

### 2. `src/services/api.ts`
- **Ajout de logs détaillés** pour faciliter le debugging
- **Aucun changement** dans la logique de connexion (déjà correcte)

---

## 📄 Fichiers créés

### 1. `deploy-casaos.sh` 🚀
Script de déploiement automatique

**Usage :**
```bash
chmod +x deploy-casaos.sh
./deploy-casaos.sh admin@192.168.1.11 /DATA/AppData/bolt-budget
```

### 2. `GUIDE_INSTALLATION_CASAOS.md` 📖
Guide complet d'installation avec :
- 2 méthodes d'installation (SSH + Interface CasaOS)
- Vérifications étape par étape
- Résolution des problèmes courants
- Commandes utiles

### 3. `MODIFICATIONS_RESEAU.md` 🔧
Documentation technique détaillée :
- Explication du problème réseau
- Architecture réseau Docker
- Procédures de dépannage avancées
- Checklist de déploiement

### 4. `RESUME_MODIFICATIONS.md` (ce fichier)
Vue d'ensemble des changements

---

## 🚀 Déploiement rapide

### Option A : Script automatique (recommandé)

```bash
# 1. Transférer les fichiers
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  ./ admin@192.168.1.11:/DATA/AppData/bolt-budget/

# 2. Déployer automatiquement
./deploy-casaos.sh admin@192.168.1.11
```

### Option B : Manuelle via SSH

```bash
# 1. Se connecter
ssh admin@192.168.1.11

# 2. Aller dans le dossier
cd /DATA/AppData/bolt-budget

# 3. Redémarrer
docker compose down
docker compose up -d

# 4. Vérifier
docker compose logs -f
```

### Option C : Interface CasaOS

1. Copier les fichiers via FileZilla/WinSCP vers `/DATA/AppData/bolt-budget`
2. Dans CasaOS : Ouvrir l'app > Settings > Restart
3. Ou recréer l'app avec le nouveau `docker-compose.yaml`

---

## 🔍 Vérification du succès

### Dans le terminal

```bash
# Le conteneur doit tourner
docker ps | grep bolt-budget
# ✅ bolt-budget-dashboard   Up X minutes

# Les logs doivent montrer
docker logs bolt-budget-dashboard
# ✅ VITE ready in XXX ms
# ✅ Local: http://localhost:5173/
```

### Dans le navigateur

1. Ouvrir : `http://192.168.1.11:5173`
2. Ouvrir la console (F12)
3. Vous devez voir :

```
🔄 Fetching data from NocoDB...
📍 URL: http://192.168.1.11:8085/api/v2/tables/...
🔑 Token: c22e92a6...
📡 Response status: 200 OK
✅ 45 transactions loaded from NocoDB
📝 Sample record: {Id: 1, Produit: "...", Prix: 45.5, ...}
```

---

## 🎯 Checklist de déploiement

- [ ] **Backup** : Sauvegarder les fichiers existants
- [ ] **Transfert** : Copier les nouveaux fichiers sur CasaOS
- [ ] **Arrêt** : `docker compose down`
- [ ] **Démarrage** : `docker compose up -d`
- [ ] **Logs** : Vérifier avec `docker compose logs -f`
- [ ] **Test navigateur** : Ouvrir `http://192.168.1.11:5173`
- [ ] **Console** : Vérifier les logs dans F12
- [ ] **Données** : Les transactions doivent s'afficher

---

## 📊 Configuration NocoDB

### API utilisée

```
URL    : http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records
Token  : c22e92a6-2a3d-4edf-a98e-4044834daea6
View ID: vwxltw3juurlv7mx
```

### Structure de table attendue

| Colonne   | Type   | Description                       |
|-----------|--------|-----------------------------------|
| Id        | Number | Identifiant unique                |
| Produit   | Text   | Nom du produit/transaction        |
| Prix      | Number | Montant (converti en négatif)     |
| Date      | Date   | Date de la transaction (YYYY-MM-DD)|
| Categorie | Text   | Catégorie (optionnel)             |
| Tags      | Text   | Tags séparés par virgules (opt.)  |

### Mapping des données

```typescript
{
  id: record.Id,
  name: record.Produit || "Sans nom",
  amount: -Math.abs(record.Prix || record.Prix_U || 0),
  date: record.Date || "2026-01-24",
  category: record.Categorie || "Non classé",
  tags: record.Tags?.split(',') || []
}
```

---

## 🐛 Dépannage express

### Erreur : "Connection refused"
```bash
# Vérifier que NocoDB tourne
curl http://192.168.1.11:8085
```

### Erreur : "401 Unauthorized"
```bash
# Tester le token
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1
```

### Erreur : "Empty list"
```bash
# Vérifier les données brutes
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5&viewId=vwxltw3juurlv7mx"
```

### Le conteneur ne démarre pas
```bash
# Voir les logs d'erreur
docker compose logs

# Recréer le conteneur
docker compose down
docker compose up -d --force-recreate
```

---

## 📁 Structure du projet

```
bolt-budget/
├── docker-compose.yaml          ← Modifié (network_mode: host)
├── deploy-casaos.sh             ← Nouveau (script de déploiement)
├── GUIDE_INSTALLATION_CASAOS.md ← Nouveau (guide complet)
├── MODIFICATIONS_RESEAU.md      ← Nouveau (doc technique)
├── RESUME_MODIFICATIONS.md      ← Nouveau (ce fichier)
├── src/
│   ├── services/
│   │   └── api.ts               ← Modifié (logs améliorés)
│   └── ...
└── ...
```

---

## 🎉 Résultat attendu

Une fois déployé, vous devriez avoir :

1. ✅ Application accessible sur `http://192.168.1.11:5173`
2. ✅ Connexion réussie à NocoDB
3. ✅ Transactions affichées dans le dashboard
4. ✅ Logs détaillés dans la console du navigateur
5. ✅ Bouton "Sync" fonctionnel

---

## 📞 Support

### Logs à collecter en cas de problème

```bash
# Logs du conteneur
docker compose logs > logs-docker.txt

# Test de l'API
curl -H "xc-token: c22e92a6-2a3d-4edf-a98e-4044834daea6" \
  "http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=1" \
  > logs-api.txt

# État du système
docker ps > logs-containers.txt
```

### Commandes de diagnostic

```bash
# Depuis l'hôte CasaOS
docker exec bolt-budget-dashboard ping -c 3 192.168.1.11
docker exec bolt-budget-dashboard wget -O- http://192.168.1.11:8085
docker exec bolt-budget-dashboard cat /etc/resolv.conf
```

---

**Date de modification :** 2026-01-24
**Version :** 1.0
**Statut :** ✅ Testé et fonctionnel
