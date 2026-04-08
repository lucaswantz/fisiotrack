-- ============================================================
-- Cria um fisioterapeuta no Supabase
-- Substitua o email, senha e nome antes de rodar
-- O trigger on_auth_user_created cria o profile automaticamente
-- ============================================================

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'fisio@exemplo.com',                                        -- ← troque o email
  crypt('senha123', gen_salt('bf')),                          -- ← troque a senha
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "Dr. Nome Sobrenome"}'::jsonb,                   -- ← troque o nome
  now(),
  now(),
  '',
  ''
);
