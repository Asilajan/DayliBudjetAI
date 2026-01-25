# Installation sur CasaOS

## Méthode 1 : Installation Automatique (Recommandée)

### Étape 1 : Cloner le projet

Connectez-vous en SSH à votre serveur CasaOS et exécutez :

```bash
cd /DATA/AppData
git clone https://github.com/Asilajan/DayliBudjetAI.git bolt-budget-source
cd bolt-budget-source
```

### Étape 2 : Lancer l'installation

```bash
chmod +x install-casaos.sh
./install-casaos.sh
```

### Étape 3 : Vérifier les logs

```bash
docker logs -f bolt-budget-dashboard
```

Attendez de voir le message :
```
🚀 Starting development server...
VITE ready in X ms
Local: http://localhost:5131/
```

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur :
```
http://VOTRE_IP:5131
```

---

## Méthode 2 : Installation Manuelle via CasaOS UI

### Étape 1 : Préparer les fichiers

En SSH, clonez le repo et créez l'image :

```bash
cd /DATA/AppData
git clone https://github.com/Asilajan/DayliBudjetAI.git bolt-budget-source
cd bolt-budget-source
docker build -t bolt-budget:latest .
```

### Étape 2 : Dans CasaOS UI

1. Ouvrez **CasaOS**
2. Allez dans **App Store** → **Importer une application**
3. Utilisez ces paramètres :

**Configuration générale :**
- Image Docker : `bolt-budget:latest`
- Titre : `Bolt Budget`
- Port : `5131`

**Réseau :**
- Mode réseau : `host`

**Volumes :**
- Hôte : `/DATA/AppData/bolt-budget`
- Conteneur : `/app`

**Variables d'environnement :**
- `NODE_ENV` = `development`

**Avancé :**
- Politique de redémarrage : `unless-stopped`
- Limite mémoire : `2048 MB`

4. Cliquez sur **Enregistrer**

---

## Méthode 3 : Docker Compose

```bash
cd /DATA/AppData/bolt-budget-source
docker-compose -f docker-compose-casaos.yaml up -d
```

---

## Vérification

### Vérifier que le conteneur tourne :
```bash
docker ps | grep bolt-budget
```

### Voir les logs en temps réel :
```bash
docker logs -f bolt-budget-dashboard
```

### Tester la connexion :
```bash
curl http://localhost:5131
```

---

## Dépannage

### Le conteneur redémarre en boucle
```bash
docker logs bolt-budget-dashboard
```

### Port déjà utilisé
Vérifiez si un autre service utilise le port 5131 :
```bash
netstat -tulpn | grep 5131
```

### Permissions du volume
```bash
sudo chown -R 1000:1000 /DATA/AppData/bolt-budget
```

### Reconstruire l'image
```bash
docker stop bolt-budget-dashboard
docker rm bolt-budget-dashboard
docker rmi bolt-budget:latest
cd /DATA/AppData/bolt-budget-source
./install-casaos.sh
```
