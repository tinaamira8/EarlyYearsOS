-- Column-Level Encryption for PII (Child Data)
-- Requires Supabase Vault (pgsodium extension) to be enabled
-- Run this AFTER schema.sql

-- Enable pgsodium if not already enabled
create extension if not exists pgsodium;

-- Create an encryption key for child PII
select vault.create_secret(
  'eyos_child_pii_key',
  encode(pgsodium.crypto_aead_det_keygen(), 'base64'),
  'Encryption key for child personal data'
);

-- Encrypt sensitive columns in children table using Transparent Column Encryption (TCE)
-- This uses pgsodium's security label approach

-- Children: encrypt name, medical_condition, medication, allergies
security label for pgsodium on column children.name
  is 'ENCRYPT WITH KEY ID (select id from pgsodium.valid_key where name = ''eyos_child_pii_key'') SECURITY INVOKER';

security label for pgsodium on column children.medical_condition
  is 'ENCRYPT WITH KEY ID (select id from pgsodium.valid_key where name = ''eyos_child_pii_key'') SECURITY INVOKER';

security label for pgsodium on column children.medication
  is 'ENCRYPT WITH KEY ID (select 
