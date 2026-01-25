#!/bin/bash

# 🚀 Script de déploiement automatique pour CasaOS
# Usage: ./deploy-casaos.sh [user@ip] [chemin-destination]
# Exemple: ./deploy-casaos.sh admin@192.168.1.11 /DATA/AppData/bolt-budget

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_TARGET="${1:-admin@192.168.1.11}"
REMOTE_PATH="${2:-/DATA/AppData/bolt-budget}"
LOCAL_PATH="$(pwd)"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Déploiement Budget Dashboard sur CasaOS            ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Étape 1 : Vérification
echo -e "${YELLOW}📋 Configuration :${NC}"
echo "  SSH Target: $SSH_TARGET"
echo "  Remote Path: $REMOTE_PATH"
echo "  Local Path: $LOCAL_PATH"
echo ""

read -p "Voulez-vous continuer ? (o/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé${NC}"
    exit 1
fi

# Étape 2 : Transfert des fichiers
echo ""
echo -e "${BLUE}📦 Étape 1/4 : Transfert des fichiers...${NC}"

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude 'deploy-casaos.sh' \
  "$LOCAL_PATH/" \
  "$SSH_TARGET:$REMOTE_PATH/" \
  || { echo -e "${RED}❌ Erreur lors du transfert${NC}"; exit 1; }

echo -e "${GREEN}✅ Fichiers transférés${NC}"

# Étape 3 : Arrêt du conteneur existant
echo ""
echo -e "${BLUE}🛑 Étape 2/4 : Arrêt du conteneur existant...${NC}"

ssh "$SSH_TARGET" "cd $REMOTE_PATH && docker compose down 2>/dev/null || true"
echo -e "${GREEN}✅ Conteneur arrêté${NC}"

# Étape 4 : Démarrage du nouveau conteneur avec icône
echo ""
echo -e "${BLUE}🚀 Étape 3/4 : Démarrage du conteneur...${NC}"

ssh "$SSH_TARGET" "cd $REMOTE_PATH && docker compose up -d"
echo -e "${GREEN}✅ Conteneur démarré${NC}"
echo -e "${GREEN}🎨 Icône configurée pour CasaOS${NC}"

# Étape 5 : Vérification
echo ""
echo -e "${BLUE}🔍 Étape 4/4 : Vérification...${NC}"
echo ""

sleep 3

ssh "$SSH_TARGET" "docker ps | grep bolt-budget" || {
  echo -e "${RED}❌ Le conteneur ne semble pas démarré${NC}"
  echo ""
  echo -e "${YELLOW}📋 Logs du conteneur :${NC}"
  ssh "$SSH_TARGET" "cd $REMOTE_PATH && docker compose logs --tail=50"
  exit 1
}

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ Déploiement réussi !                      ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}🌐 Accédez à votre application :${NC}"
echo "   http://$(echo $SSH_TARGET | cut -d'@' -f2):5173"
echo ""
echo -e "${YELLOW}📋 Commandes utiles :${NC}"
echo "   Voir les logs : ssh $SSH_TARGET 'cd $REMOTE_PATH && docker compose logs -f'"
echo "   Redémarrer    : ssh $SSH_TARGET 'cd $REMOTE_PATH && docker compose restart'"
echo "   Arrêter       : ssh $SSH_TARGET 'cd $REMOTE_PATH && docker compose down'"
echo ""
