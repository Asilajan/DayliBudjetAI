/*
  # Création des tables pour le budget et les emails

  1. Nouvelles tables
    - `budget_config`
      - `id` (uuid, primary key)
      - `monthly_budget` (numeric) - Budget mensuel configuré
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `amount` (numeric) - Montant de la dépense
      - `category` (text) - 'courses' ou 'factures'
      - `description` (text) - Description de la dépense
      - `date` (date) - Date de la dépense
      - `created_at` (timestamptz)
    
    - `email_accounts`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Adresse email
      - `name` (text) - Nom/Label de l'email
      - `is_active` (boolean) - Si l'email est actif
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies pour permettre l'accès aux utilisateurs authentifiés
*/

-- Table de configuration du budget
CREATE TABLE IF NOT EXISTS budget_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_budget numeric NOT NULL DEFAULT 800,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir le budget"
  ON budget_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Tout le monde peut modifier le budget"
  ON budget_config FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut insérer le budget"
  ON budget_config FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('courses', 'factures')),
  description text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les dépenses"
  ON expenses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Tout le monde peut ajouter des dépenses"
  ON expenses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les dépenses"
  ON expenses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut supprimer les dépenses"
  ON expenses FOR DELETE
  TO anon, authenticated
  USING (true);

-- Table des comptes email
CREATE TABLE IF NOT EXISTS email_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les emails"
  ON email_accounts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Tout le monde peut ajouter des emails"
  ON email_accounts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les emails"
  ON email_accounts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut supprimer les emails"
  ON email_accounts FOR DELETE
  TO anon, authenticated
  USING (true);

-- Insérer une configuration de budget par défaut
INSERT INTO budget_config (monthly_budget)
VALUES (800)
ON CONFLICT DO NOTHING;
