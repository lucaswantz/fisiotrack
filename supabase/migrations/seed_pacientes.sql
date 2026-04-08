-- ============================================================
-- Seed: 20 pacientes + tratamentos
-- Requer que exista ao menos um fisioterapeuta cadastrado.
-- ============================================================

DO $$
DECLARE
  physio_id uuid;
  u         uuid;
  p         uuid;
BEGIN
  -- Pega o primeiro fisioterapeuta cadastrado
  SELECT id INTO physio_id FROM public.profiles LIMIT 1;

  IF physio_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum fisioterapeuta encontrado. Cadastre um antes de rodar o seed.';
  END IF;

  -- -------------------------------------------------------
  -- Paciente 1 — Ana Beatriz Souza — Dia 45 (LIG)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'ana.beatriz@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Ana Beatriz Souza"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Ana Beatriz Souza') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 45, ARRAY['LIG']);

  -- -------------------------------------------------------
  -- Paciente 2 — Carlos Eduardo Lima — Dia 30 (MENIS)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'carlos.lima@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Carlos Eduardo Lima"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Carlos Eduardo Lima') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 30, ARRAY['MENIS']);

  -- -------------------------------------------------------
  -- Paciente 3 — Fernanda Oliveira — Dia 12 (SUTURA, JOELHO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'fernanda.oliveira@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Fernanda Oliveira"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Fernanda Oliveira') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 12, ARRAY['SUTURA', 'JOELHO']);

  -- -------------------------------------------------------
  -- Paciente 4 — Ricardo Martins — Dia 78 (OMBRO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'ricardo.martins@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Ricardo Martins"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Ricardo Martins') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 78, ARRAY['OMBRO']);

  -- -------------------------------------------------------
  -- Paciente 5 — Juliana Costa — Dia 5 (LIG, MENIS)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'juliana.costa@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Juliana Costa"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Juliana Costa') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 5, ARRAY['LIG', 'MENIS']);

  -- -------------------------------------------------------
  -- Paciente 6 — Marcos Pereira — Pré-op (COLUNA)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'marcos.pereira@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Marcos Pereira"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Marcos Pereira') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE + 10, ARRAY['COLUNA']);

  -- -------------------------------------------------------
  -- Paciente 7 — Patrícia Alves — Dia 60 (QUADRIL)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'patricia.alves@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Patrícia Alves"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Patrícia Alves') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 60, ARRAY['QUADRIL']);

  -- -------------------------------------------------------
  -- Paciente 8 — Bruno Ferreira — Dia 22 (TORNOZELO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'bruno.ferreira@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Bruno Ferreira"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Bruno Ferreira') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 22, ARRAY['TORNOZELO']);

  -- -------------------------------------------------------
  -- Paciente 9 — Camila Santos — Pré-op (sem data)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'camila.santos@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Camila Santos"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Camila Santos') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, NULL, ARRAY['OMBRO']);

  -- -------------------------------------------------------
  -- Paciente 10 — Diego Rocha — Dia 90 (LIG, SUTURA)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'diego.rocha@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Diego Rocha"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Diego Rocha') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 90, ARRAY['LIG', 'SUTURA']);

  -- -------------------------------------------------------
  -- Paciente 11 — Érica Nascimento — Dia 3 (JOELHO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'erica.nascimento@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Érica Nascimento"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Érica Nascimento') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 3, ARRAY['JOELHO']);

  -- -------------------------------------------------------
  -- Paciente 12 — Felipe Cardoso — Dia 50 (MENIS, JOELHO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'felipe.cardoso@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Felipe Cardoso"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Felipe Cardoso') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 50, ARRAY['MENIS', 'JOELHO']);

  -- -------------------------------------------------------
  -- Paciente 13 — Gabriela Mendes — Pré-op (QUADRIL)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'gabriela.mendes@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Gabriela Mendes"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Gabriela Mendes') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE + 5, ARRAY['QUADRIL']);

  -- -------------------------------------------------------
  -- Paciente 14 — Henrique Barbosa — Dia 18 (OMBRO, SUTURA)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'henrique.barbosa@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Henrique Barbosa"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Henrique Barbosa') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 18, ARRAY['OMBRO', 'SUTURA']);

  -- -------------------------------------------------------
  -- Paciente 15 — Isabela Teixeira — Dia 35 (COLUNA)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'isabela.teixeira@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Isabela Teixeira"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Isabela Teixeira') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 35, ARRAY['COLUNA']);

  -- -------------------------------------------------------
  -- Paciente 16 — João Paulo Gomes — Dia 70 (LIG)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'joao.gomes@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"João Paulo Gomes"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'João Paulo Gomes') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 70, ARRAY['LIG']);

  -- -------------------------------------------------------
  -- Paciente 17 — Larissa Freitas — Dia 8 (TORNOZELO, SUTURA)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'larissa.freitas@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Larissa Freitas"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Larissa Freitas') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 8, ARRAY['TORNOZELO', 'SUTURA']);

  -- -------------------------------------------------------
  -- Paciente 18 — Mateus Ribeiro — Dia 120 (MENIS)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'mateus.ribeiro@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Mateus Ribeiro"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Mateus Ribeiro') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 120, ARRAY['MENIS']);

  -- -------------------------------------------------------
  -- Paciente 19 — Natália Correia — Pré-op (LIG)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'natalia.correia@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Natália Correia"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Natália Correia') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, NULL, ARRAY['LIG']);

  -- -------------------------------------------------------
  -- Paciente 20 — Otávio Carvalho — Dia 42 (COLUNA, OMBRO)
  -- -------------------------------------------------------
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'otavio.carvalho@fisiotrack.dev', crypt('senha123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Otávio Carvalho"}'::jsonb, now(), now(), '', '')
  RETURNING id INTO u;
  INSERT INTO public.patients (physiotherapist_id, auth_user_id, name) VALUES (physio_id, u, 'Otávio Carvalho') RETURNING id INTO p;
  INSERT INTO public.treatments (patient_id, surgery_date, tags) VALUES (p, CURRENT_DATE - 42, ARRAY['COLUNA', 'OMBRO']);

END $$;
