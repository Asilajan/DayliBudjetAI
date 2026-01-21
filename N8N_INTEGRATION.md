# Integration n8n avec NocoDB

## Vue d'ensemble

Votre workflow n8n envoie les transactions extraites de Paperless-NGX vers NocoDB. L'application React affiche ces donnees avec synchronisation automatique.

## Architecture

```
Paperless-NGX -> n8n -> NocoDB -> Application React
```

## Configuration actuelle

L'application est configuree pour lire depuis la table NocoDB "Tiquets" a l'adresse :
```
http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records
```

## Format des donnees attendu

La table NocoDB doit avoir les colonnes suivantes :

| Colonne   | Type   | Description              |
|-----------|--------|--------------------------|
| Id        | Number | ID auto-incremente       |
| Produit   | Text   | Nom du produit/article   |
| Prix      | Number | Prix unitaire            |
| Date      | Date   | Date du ticket           |
| Categorie | Text   | Categorie de la depense  |
| Total     | Number | Montant total            |
| Tags      | Text   | Tags separes par virgule |

## Fonctionnalites de l'application

### Synchronisation automatique
- L'application recupere les donnees toutes les 30 secondes
- Un indicateur "NocoDB" affiche l'etat de connexion

### Synchronisation manuelle
- Cliquez sur le bouton de synchronisation dans le header pour forcer un rechargement

### Affichage
- Les 100 dernieres transactions sont affichees
- Triees par ID decroissant (plus recentes en premier)

## Depannage

### Les transactions n'apparaissent pas

1. Verifiez que NocoDB est accessible depuis l'application
2. Verifiez que le token API est correct dans le fichier .env
3. Ouvrez la console du navigateur pour voir les erreurs

### Erreur CORS

Si vous avez des erreurs CORS, vous devez configurer NocoDB pour autoriser les requetes depuis votre domaine d'application.

### Verifier la connexion

Testez l'API directement :
```bash
curl -X GET "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=5" \
  -H "xc-token: KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm"
```

## Tables disponibles

D'apres votre configuration :

- **Tiquets (Transactions)** : `mdzbaovwu0orw88`
- **Budget** : `mqqdgf38wuqx9wt`
- **Expenses** : `me8gbce531j8y4r`
- **Emails** : `mu6qbduzo796zgh`
