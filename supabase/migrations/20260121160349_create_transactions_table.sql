/*
  # Création de la table des transactions depuis Paperless-NGX

  1. Nouvelle Table
    - `transactions`
      - `id` (bigint, clé primaire auto-incrémentée)
      - `nature` (text) - Type de document (ACHAT_DETAIL, FACTURE_UNIQUE, etc.)
      - `correspondant` (text) - Nom du magasin ou organisme
      - `date_ticket` (date) - Date du document
      - `produit` (text) - Nom du produit/article
      - `prix_u` (numeric) - Prix unitaire
      - `quantite` (numeric) - Quantité
      - `total` (numeric) - Montant total
      - `tags_str` (text) - Tags séparés par des virgules
      - `source_id` (text) - ID du document source Paperless-NGX
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour

  2. Sécurité
    - Active RLS sur la table `transactions`
    - Ajoute une politique permettant la lecture publique (pour l'affichage)
    - Ajoute une politique permettant l'insertion via API (pour n8n)

  3. Index
    - Index sur `date_ticket` pour les requêtes par date
    - Index sur `correspondant` pour filtrer par magasin
    - Index sur `source_id` pour éviter les doublons
*/

CREATE TABLE IF NOT EXISTS transactions (
  id bigserial PRIMARY KEY,
  nature text,
  correspondant text,
  date_ticket date,
  produit text,
  prix_u numeric(10, 2) DEFAULT 0,
  quantite numeric(10, 2) DEFAULT 1,
  total numeric(10, 2) DEFAULT 0,
  tags_str text,
  source_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date_ticket DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_correspondant ON transactions(correspondant);
CREATE INDEX IF NOT EXISTS idx_transactions_source_id ON transactions(source_id);

-- Active RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politique permettant la lecture publique
CREATE POLICY "Allow public read access"
  ON transactions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique permettant l'insertion via API
CREATE POLICY "Allow insert via API"
  ON transactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique permettant la mise à jour
CREATE POLICY "Allow update via API"
  ON transactions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();