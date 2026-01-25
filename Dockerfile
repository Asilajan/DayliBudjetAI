FROM node:18-alpine

# Installation de git
RUN apk add --no-cache git

# Création du répertoire de travail
WORKDIR /app

# Copie du script d'entrée
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exposition du port
EXPOSE 5131

# Point d'entrée
ENTRYPOINT ["/docker-entrypoint.sh"]
