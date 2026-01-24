#!/bin/bash

# 🧪 Script de test de connexion NocoDB
# Ce script teste la connexion à NocoDB depuis différents contextes

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
NOCODB_URL="http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records"
NOCODB_TOKEN="c22e92a6-2a3d-4edf-a98e-4044834daea6"
VIEW_ID="vwxltw3juurlv7mx"
FULL_URL="${NOCODB_URL}?limit=5&viewId=${VIEW_ID}"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Test de connexion NocoDB - Budget Dashboard     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1 : Depuis la machine locale
echo -e "${YELLOW}🧪 Test 1/3 : Connexion depuis la machine locale...${NC}"
if curl -s -H "xc-token: $NOCODB_TOKEN" "$FULL_URL" > /dev/null 2>&1; then
    RESULT=$(curl -s -H "xc-token: $NOCODB_TOKEN" "$FULL_URL")
    COUNT=$(echo "$RESULT" | grep -o '"list":\[' | wc -l)
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Connexion réussie depuis la machine locale${NC}"
        echo "   Réponse reçue et valide"
    else
        echo -e "${RED}❌ Connexion établie mais réponse invalide${NC}"
        echo "   Réponse: $RESULT"
    fi
else
    echo -e "${RED}❌ Échec de connexion depuis la machine locale${NC}"
    echo "   Vérifiez que NocoDB est accessible"
fi
echo ""

# Test 2 : Depuis le serveur CasaOS (si SSH est configuré)
echo -e "${YELLOW}🧪 Test 2/3 : Connexion depuis le serveur CasaOS...${NC}"
read -p "Entrez l'adresse SSH (ex: admin@192.168.1.11) ou appuyez sur Entrée pour sauter : " SSH_TARGET

if [ -n "$SSH_TARGET" ]; then
    if ssh -o ConnectTimeout=5 "$SSH_TARGET" "curl -s -H 'xc-token: $NOCODB_TOKEN' '$FULL_URL'" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Connexion réussie depuis le serveur CasaOS${NC}"
    else
        echo -e "${RED}❌ Échec de connexion depuis le serveur CasaOS${NC}"
        echo "   Vérifiez que NocoDB est accessible depuis le serveur"
    fi
else
    echo -e "${BLUE}⏭️  Test sauté${NC}"
fi
echo ""

# Test 3 : Depuis le conteneur Docker (si en cours d'exécution)
echo -e "${YELLOW}🧪 Test 3/3 : Connexion depuis le conteneur Docker...${NC}"

if [ -n "$SSH_TARGET" ]; then
    CONTAINER_RUNNING=$(ssh "$SSH_TARGET" "docker ps -q -f name=bolt-budget-dashboard" 2>/dev/null || echo "")

    if [ -n "$CONTAINER_RUNNING" ]; then
        echo "   Conteneur détecté, installation de curl..."
        ssh "$SSH_TARGET" "docker exec bolt-budget-dashboard sh -c 'command -v curl >/dev/null 2>&1 || apk add --no-cache curl >/dev/null 2>&1'" 2>/dev/null || true

        if ssh "$SSH_TARGET" "docker exec bolt-budget-dashboard curl -s -H 'xc-token: $NOCODB_TOKEN' '$FULL_URL'" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Connexion réussie depuis le conteneur Docker${NC}"
            RESULT=$(ssh "$SSH_TARGET" "docker exec bolt-budget-dashboard curl -s -H 'xc-token: $NOCODB_TOKEN' '$FULL_URL'")
            RECORDS=$(echo "$RESULT" | grep -o '"Id":[0-9]*' | wc -l)
            echo "   Nombre de transactions récupérées: $RECORDS"
        else
            echo -e "${RED}❌ Échec de connexion depuis le conteneur Docker${NC}"
            echo "   Le conteneur ne peut pas accéder à NocoDB"
            echo ""
            echo -e "${YELLOW}💡 Solutions possibles :${NC}"
            echo "   1. Vérifier que docker-compose.yaml utilise : network_mode: host"
            echo "   2. Redémarrer le conteneur : docker compose restart"
            echo "   3. Vérifier les logs : docker compose logs"
        fi
    else
        echo -e "${BLUE}⏭️  Conteneur non trouvé (n'est peut-être pas encore déployé)${NC}"
    fi
else
    echo -e "${BLUE}⏭️  Test sauté (pas de SSH configuré)${NC}"
fi

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Résumé des tests                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Configuration testée :${NC}"
echo "   URL : $NOCODB_URL"
echo "   Token : ${NOCODB_TOKEN:0:8}..."
echo "   View ID : $VIEW_ID"
echo ""
echo -e "${YELLOW}🔍 Commande de test manuelle :${NC}"
echo "   curl -H \"xc-token: $NOCODB_TOKEN\" \"$FULL_URL\""
echo ""
