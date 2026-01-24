# 📚 Index de la documentation - Budget Dashboard CasaOS

## 🎯 Vous voulez faire quoi ?

### ⚡ J'ai 5 minutes → Installer rapidement
👉 **Lisez :** [`DEMARRAGE_RAPIDE.md`](DEMARRAGE_RAPIDE.md)

Installation en 3 commandes, sans détails.

---

### 📖 J'ai 15 minutes → Installation guidée complète
👉 **Lisez :** [`GUIDE_INSTALLATION_CASAOS.md`](GUIDE_INSTALLATION_CASAOS.md)

Guide pas-à-pas avec 2 méthodes (SSH + Interface CasaOS), vérifications et résolution de problèmes.

---

### 🔧 Ça ne fonctionne pas → Débugger un problème
👉 **Exécutez :** `./test-nocodb-connection.sh` (diagnostic automatique)
👉 **Consultez :** [`MODIFICATIONS_RESEAU.md`](MODIFICATIONS_RESEAU.md) > Section "Dépannage"

Tests automatiques + solutions pour tous les problèmes courants.

---

### 🧠 Je veux comprendre → Détails techniques
👉 **Lisez dans l'ordre :**
1. [`RESUME_MODIFICATIONS.md`](RESUME_MODIFICATIONS.md) (vue d'ensemble)
2. [`MODIFICATIONS_RESEAU.md`](MODIFICATIONS_RESEAU.md) (détails techniques)

Explication complète des modifications et de l'architecture réseau.

---

### 📦 Qu'est-ce qui a été livré ? → Liste des fichiers
👉 **Lisez :** [`LIVRABLES.md`](LIVRABLES.md)

Liste complète des fichiers modifiés et créés avec descriptions.

---

## 📄 Table des matières détaillée

### 1. Guides d'installation

| Fichier | Durée | Niveau | Description |
|---------|-------|--------|-------------|
| [`DEMARRAGE_RAPIDE.md`](DEMARRAGE_RAPIDE.md) | 5 min | ⭐ Débutant | Installation express, commandes essentielles |
| [`GUIDE_INSTALLATION_CASAOS.md`](GUIDE_INSTALLATION_CASAOS.md) | 15 min | ⭐⭐ Intermédiaire | Guide complet avec 2 méthodes d'installation |

### 2. Documentation technique

| Fichier | Durée | Niveau | Description |
|---------|-------|--------|-------------|
| [`RESUME_MODIFICATIONS.md`](RESUME_MODIFICATIONS.md) | 10 min | ⭐⭐ Intermédiaire | Vue d'ensemble des changements |
| [`MODIFICATIONS_RESEAU.md`](MODIFICATIONS_RESEAU.md) | 20 min | ⭐⭐⭐ Avancé | Détails techniques, architecture, debugging |

### 3. Référence

| Fichier | Durée | Niveau | Description |
|---------|-------|--------|-------------|
| [`LIVRABLES.md`](LIVRABLES.md) | 5 min | ⭐ Débutant | Liste des fichiers et leur utilisation |
| [`INDEX_DOCUMENTATION.md`](INDEX_DOCUMENTATION.md) | 2 min | ⭐ Débutant | Ce fichier - Navigation rapide |

### 4. Scripts

| Fichier | Usage | Description |
|---------|-------|-------------|
| [`deploy-casaos.sh`](deploy-casaos.sh) | `./deploy-casaos.sh admin@192.168.1.11` | Déploiement automatique complet |
| [`test-nocodb-connection.sh`](test-nocodb-connection.sh) | `./test-nocodb-connection.sh` | Test de connexion NocoDB (3 tests) |

---

## 🗺️ Chemins d'apprentissage

### Débutant : Installation simple

```
1. DEMARRAGE_RAPIDE.md (5 min)
   ↓
2. ./deploy-casaos.sh (2 min)
   ↓
3. Ouvrir http://192.168.1.11:5173
   ↓
4. Si problème → GUIDE_INSTALLATION_CASAOS.md
```

**Temps total :** 7-20 minutes

---

### Intermédiaire : Installation guidée

```
1. GUIDE_INSTALLATION_CASAOS.md (15 min)
   ↓
2. Choisir méthode (SSH ou Interface)
   ↓
3. Suivre les étapes
   ↓
4. Vérifications
   ↓
5. Si problème → Section "Résolution des problèmes"
```

**Temps total :** 15-30 minutes

---

### Avancé : Compréhension technique

```
1. RESUME_MODIFICATIONS.md (10 min)
   ↓
2. MODIFICATIONS_RESEAU.md (20 min)
   ↓
3. Examiner les fichiers modifiés :
   - docker-compose.yaml
   - src/services/api.ts
   ↓
4. Tests et validation
   - ./test-nocodb-connection.sh
   - Commandes de diagnostic
```

**Temps total :** 30-45 minutes

---

## 🔍 Trouver rapidement une information

### Configuration

**Credentials NocoDB :**
- 📄 Tous les fichiers mentionnent la config
- 🔧 Fichier principal : `src/services/api.ts`

**Docker Compose :**
- 📄 `RESUME_MODIFICATIONS.md` > Section "Docker/CasaOS"
- 🔧 Fichier : `docker-compose.yaml`

### Commandes

**Installation :**
- 📄 `DEMARRAGE_RAPIDE.md` > "Installation en 3 commandes"
- 📄 `GUIDE_INSTALLATION_CASAOS.md` > "Méthode 1" ou "Méthode 2"

**Vérification :**
- 📄 `DEMARRAGE_RAPIDE.md` > "Vérification rapide"
- 📄 `GUIDE_INSTALLATION_CASAOS.md` > "Vérification du fonctionnement"

**Dépannage :**
- 📄 `DEMARRAGE_RAPIDE.md` > "Problèmes courants"
- 📄 `MODIFICATIONS_RESEAU.md` > "Dépannage"
- 🔧 Script : `./test-nocodb-connection.sh`

### Concepts techniques

**Architecture réseau :**
- 📄 `MODIFICATIONS_RESEAU.md` > "Architecture réseau"

**Mapping des données :**
- 📄 `RESUME_MODIFICATIONS.md` > "Mapping des données"
- 🔧 Code : `src/services/api.ts:60-82`

**RLS et sécurité :**
- Non applicable (NocoDB direct, pas Supabase)

---

## 📋 Checklist par objectif

### Installation initiale

```
□ Lire DEMARRAGE_RAPIDE.md OU GUIDE_INSTALLATION_CASAOS.md
□ Transférer les fichiers vers CasaOS
□ Exécuter deploy-casaos.sh OU commandes manuelles
□ Vérifier : docker ps | grep bolt-budget
□ Vérifier : http://192.168.1.11:5173
□ Vérifier : Console navigateur (F12)
□ Tester : Bouton "Sync" dans l'app
```

### Dépannage

```
□ Exécuter test-nocodb-connection.sh
□ Collecter les logs : docker compose logs
□ Vérifier docker-compose.yaml : network_mode: host
□ Tester l'API : curl avec token
□ Consulter MODIFICATIONS_RESEAU.md > Dépannage
□ Vérifier les colonnes NocoDB
□ Redémarrer : docker compose restart
```

### Audit technique

```
□ Lire RESUME_MODIFICATIONS.md
□ Lire MODIFICATIONS_RESEAU.md
□ Examiner docker-compose.yaml (diff)
□ Examiner src/services/api.ts (diff)
□ Comprendre le problème réseau bridge vs host
□ Tester les commandes de diagnostic
□ Valider la configuration NocoDB
```

---

## 🎓 Glossaire

**CasaOS** : Système d'exploitation pour serveur personnel basé sur Docker

**NocoDB** : Base de données no-code (interface type Airtable)

**Mode host (réseau)** : Le conteneur utilise directement le réseau de l'hôte

**Mode bridge (réseau)** : Le conteneur est isolé dans son propre réseau

**rsync** : Outil de synchronisation de fichiers via SSH

**Token API** : Clé d'authentification pour accéder à l'API NocoDB

**Mapping** : Transformation des données d'un format à un autre

---

## 🆘 J'ai un problème spécifique

### Erreur : "Connection refused"
📄 `MODIFICATIONS_RESEAU.md` > "Dépannage" > "Connection refused"

### Erreur : "404 Not Found"
📄 `MODIFICATIONS_RESEAU.md` > "Dépannage" > "Connection refused"
🔧 Vérifier `network_mode: host` dans docker-compose.yaml

### Erreur : "401 Unauthorized"
📄 `MODIFICATIONS_RESEAU.md` > "Dépannage" > "401 Unauthorized"
🔧 Vérifier le token dans `src/services/api.ts`

### Aucune transaction ne s'affiche
📄 `GUIDE_INSTALLATION_CASAOS.md` > "Aucune transaction n'apparaît"
🔧 Vérifier les noms de colonnes NocoDB

### Port 5173 déjà utilisé
📄 `DEMARRAGE_RAPIDE.md` > "Port 5173 déjà utilisé"
📄 `MODIFICATIONS_RESEAU.md` > "Problème 4"

### Le conteneur ne démarre pas
📄 `DEMARRAGE_RAPIDE.md` > "Le conteneur ne démarre pas"
🔧 `docker compose logs` pour voir l'erreur

---

## 🔗 Liens rapides vers les sections importantes

### Installation
- [Installation en 3 commandes](DEMARRAGE_RAPIDE.md#-installation-en-3-commandes)
- [Installation via SSH](GUIDE_INSTALLATION_CASAOS.md#méthode-1--installation-via-ssh-recommandée)
- [Installation via Interface CasaOS](GUIDE_INSTALLATION_CASAOS.md#méthode-2--installation-via-linterface-casaos)

### Configuration
- [Configuration NocoDB](RESUME_MODIFICATIONS.md#-configuration-nocodb)
- [Docker Compose](RESUME_MODIFICATIONS.md#1-docker-composeyaml-)
- [Mapping des données](RESUME_MODIFICATIONS.md#mapping-des-données)

### Dépannage
- [Problèmes courants (rapide)](DEMARRAGE_RAPIDE.md#-problèmes-courants)
- [Dépannage complet](MODIFICATIONS_RESEAU.md#-dépannage)
- [Tests de diagnostic](MODIFICATIONS_RESEAU.md#vérification-du-fonctionnement)

### Scripts
- [Script de déploiement](deploy-casaos.sh)
- [Script de test](test-nocodb-connection.sh)

---

## 📞 Support

Si vous ne trouvez pas ce que vous cherchez :

1. **Utilisez la recherche** (Ctrl+F) dans les fichiers markdown
2. **Exécutez les scripts de diagnostic** (`test-nocodb-connection.sh`)
3. **Collectez les logs** avec les commandes fournies dans `MODIFICATIONS_RESEAU.md`

---

**Dernière mise à jour :** 2026-01-24
**Documentation maintenue par :** Claude Agent SDK
**Version :** 1.0
