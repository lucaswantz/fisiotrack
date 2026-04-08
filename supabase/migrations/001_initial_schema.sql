-- ============================================================
-- FisioTrack — Schema inicial
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- PROFILES — Fisioterapeutas
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  tv_token    uuid not null default gen_random_uuid(),
  created_at  timestamptz not null default now()
);

-- Cria profile automaticamente ao cadastrar um novo usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PATIENTS — Pacientes
-- ============================================================
create table public.patients (
  id                    uuid primary key default gen_random_uuid(),
  physiotherapist_id    uuid not null references public.profiles (id) on delete cascade,
  auth_user_id          uuid references auth.users (id) on delete set null,
  name                  text not null,
  created_at            timestamptz not null default now()
);

-- ============================================================
-- TREATMENTS — Tratamentos (um por cirurgia)
-- ============================================================
create table public.treatments (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references public.patients (id) on delete cascade,
  surgery_date    date,
  discharge_date  date,
  tags            text[] not null default '{}',
  notes           text,
  created_at      timestamptz not null default now(),

  -- Garante no banco que não há dois tratamentos ativos para o mesmo paciente
  -- (discharge_date null = ativo)
  constraint one_active_treatment unique nulls not distinct (patient_id, discharge_date)
    -- Apenas um registro com discharge_date = null por patient_id
    -- Solução alternativa abaixo via índice parcial (mais compatível):
    -- ver índice abaixo
);

-- Remove a constraint acima (não funciona como esperado para "unique null")
-- e usa índice parcial no lugar:
alter table public.treatments drop constraint one_active_treatment;

create unique index one_active_per_patient
  on public.treatments (patient_id)
  where discharge_date is null;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles   enable row level security;
alter table public.patients   enable row level security;
alter table public.treatments enable row level security;

-- profiles: fisioterapeuta acessa apenas o próprio perfil
create policy "Fisioterapeuta acessa próprio perfil"
  on public.profiles
  for all
  using (id = auth.uid());

-- patients: fisioterapeuta acessa apenas seus pacientes
create policy "Fisioterapeuta acessa próprios pacientes"
  on public.patients
  for all
  using (physiotherapist_id = auth.uid());

-- patients: paciente acessa apenas seus próprios dados
create policy "Paciente acessa próprios dados"
  on public.patients
  for select
  using (auth_user_id = auth.uid());

-- treatments: fisioterapeuta acessa tratamentos dos seus pacientes
create policy "Fisioterapeuta acessa tratamentos dos seus pacientes"
  on public.treatments
  for all
  using (
    patient_id in (
      select id from public.patients where physiotherapist_id = auth.uid()
    )
  );

-- treatments: paciente acessa apenas seus próprios tratamentos
create policy "Paciente acessa próprios tratamentos"
  on public.treatments
  for select
  using (
    patient_id in (
      select id from public.patients where auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- TV TOKEN — acesso público via token (sem RLS, validado na API)
-- ============================================================
-- A rota /tv valida o token via API Route com service_role,
-- sem expor dados diretamente pelo cliente anon.
