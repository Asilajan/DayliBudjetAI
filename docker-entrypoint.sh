#!/bin/sh
set -e

# Si le dossier est vide ou pas de package.json, cloner le repo
if [ ! -f "package.json" ]; then
  echo "📦 Cloning repository from GitHub..."
  git clone https://github.com/Asilajan/DayliBudjetAI.git /tmp/repo
  mv /tmp/repo/* /tmp/repo/.* /app/ 2>/dev/null || true
  rm -rf /tmp/repo
  echo "✅ Repository cloned successfully"
fi

# Installation des dépendances
echo "📦 Installing dependencies..."
npm install

# Démarrage du serveur
echo "🚀 Starting development server..."
exec npm run dev -- --host 0.0.0.0
