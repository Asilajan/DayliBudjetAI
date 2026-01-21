# Intégration n8n avec Supabase

## Vue d'ensemble

Votre workflow n8n est maintenant configuré pour envoyer les transactions extraites de Paperless-NGX directement vers Supabase. L'application React affiche ces données en temps réel.

## Architecture

```
Paperless-NGX → n8n → Supabase Edge Function → Supabase Database → Application React
```

## Configuration n8n

### Étape 1 : Remplacer le nœud NocoDB

Dans votre workflow n8n, remplacez le dernier nœud **"Create a row"** (NocoDB) par un nœud **"HTTP Request"** avec les paramètres suivants :

### Paramètres du nœud HTTP Request

**Nom du nœud :** `Send to Supabase`

**Méthode :** `POST`

**URL :**
```
https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/ingest-transactions
```

**Authentication :** `Header Auth`
- **Name:** `Authorization`
- **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw`

**Headers :**
- **Name:** `Content-Type`, **Value:** `application/json`

**Body Content Type :** `JSON`

**Body (JSON) :**
```json
{
  "nature": "={{ $json.nature }}",
  "correspondant": "={{ $json.correspondant }}",
  "date_ticket": "={{ $json.date_ticket }}",
  "produit": "={{ $json.produit }}",
  "prix_u": "={{ $json.prix_u }}",
  "quantite": "={{ $json.quantite }}",
  "total": "={{ $json.total }}",
  "tags_str": "={{ $json.tags_str }}",
  "source_id": "={{ $json.source_id }}"
}
```

### Étape 2 : Schéma du workflow mis à jour

```
Schedule Trigger → Get documents → Remove Duplicates → Message a model → Code in JavaScript → Send to Supabase
```

## Format des données

L'Edge Function Supabase accepte les formats suivants :

### Transaction unique
```json
{
  "nature": "ACHAT_DETAIL",
  "correspondant": "Carrefour",
  "date_ticket": "2026-01-21",
  "produit": "Pain",
  "prix_u": 1.50,
  "quantite": 2,
  "total": 3.00,
  "tags_str": "Alimentation, Courses",
  "source_id": "doc_12345"
}
```

### Transactions multiples (tableau)
```json
[
  {
    "nature": "ACHAT_DETAIL",
    "correspondant": "Carrefour",
    ...
  },
  {
    "nature": "ACHAT_DETAIL",
    "correspondant": "Carrefour",
    ...
  }
]
```

## Test de l'intégration

### 1. Test manuel de l'Edge Function

Vous pouvez tester directement l'Edge Function avec curl :

```bash
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/ingest-transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw" \
  -H "Content-Type: application/json" \
  -d '{
    "nature": "ACHAT_DETAIL",
    "correspondant": "Test Store",
    "date_ticket": "2026-01-21",
    "produit": "Produit Test",
    "prix_u": 10.50,
    "quantite": 1,
    "total": 10.50,
    "tags_str": "Test",
    "source_id": "test_001"
  }'
```

### 2. Vérification dans l'application

Après l'envoi d'une transaction :
1. L'indicateur de synchronisation dans le header devrait afficher "Synchronisé"
2. Les nouvelles transactions apparaissent automatiquement
3. Le compteur "nouvelles transactions" s'affiche brièvement

## Fonctionnalités

### Synchronisation en temps réel
- L'application écoute les changements dans la base de données Supabase
- Les nouvelles transactions apparaissent instantanément sans rafraîchir la page
- Un indicateur visuel montre l'état de synchronisation

### Synchronisation manuelle
- Cliquez sur le bouton de synchronisation dans le header pour forcer un rechargement
- Utile en cas de problème de connexion

### Historique
- Toutes les transactions sont conservées dans Supabase
- Limite actuelle : 100 transactions les plus récentes affichées

## Dépannage

### Les transactions n'apparaissent pas

1. Vérifiez que le workflow n8n s'exécute correctement
2. Consultez les logs de l'Edge Function dans le dashboard Supabase
3. Vérifiez que les données sont bien insérées dans la table `transactions`

### Erreurs d'authentification

Assurez-vous que le token Bearer est correct dans la configuration n8n.

### Format de données incorrect

L'Edge Function accepte uniquement les champs suivants :
- nature, correspondant, date_ticket, produit, prix_u, quantite, total, tags_str, source_id

## Avantages de cette architecture

✅ **Temps réel** : Les transactions apparaissent instantanément
✅ **Scalabilité** : Supabase gère automatiquement la charge
✅ **Sécurité** : RLS (Row Level Security) activé
✅ **Historique** : Toutes les données sont conservées
✅ **Performance** : Indexation automatique pour les requêtes rapides
