#!/bin/bash

echo "🚀 Installation de Bolt Budget sur CasaOS"
echo "========================================"

# Arrêter et supprimer l'ancien conteneur s'il existe
echo "🧹 Nettoyage des anciens conteneurs..."
docker stop bolt-budget-dashboard 2>/dev/null || true
docker rm bolt-budget-dashboard 2>/dev/null || true

# Créer le répertoire de données s'il n'existe pas
echo "📁 Création du répertoire de données..."
mkdir -p /DATA/AppData/bolt-budget

# Construire l'image Docker
echo "🔨 Construction de l'image Docker..."
docker build -t bolt-budget:latest .

# Lancer le conteneur
echo "🚀 Démarrage du conteneur..."
docker run -d \
  --name bolt-budget-dashboard \
  --network host \
  --restart unless-stopped \
  -v /DATA/AppData/bolt-budget:/app \
  -e NODE_ENV=development \
  bolt-budget:latest

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📊 Accédez à votre application sur :"
echo "   http://$(hostname -I | awk '{print $1}'):5131"
echo ""
echo "📝 Pour voir les logs :"
echo "   docker logs -f bolt-budget-dashboard"
echo ""
