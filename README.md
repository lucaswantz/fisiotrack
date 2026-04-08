# 🦴 FisioTrack

> _"Dia 1 de pós-op. Paciente animado. Fisioterapeuta já sabe o que vem aí."_

**FisioTrack** é um app web SaaS para fisioterapeutas acompanharem o progresso de recuperação pós-cirúrgica dos pacientes — sem planilha, sem post-it, sem aquela sensação de que você esqueceu alguém.

---

## O problema que resolve

Seu paciente fez uma cirurgia no joelho há 47 dias. Você tem mais 19 pacientes. Todos em fases diferentes. Tudo na sua cabeça (ou numa planilha do Google que ninguém mais consegue abrir).

O FisioTrack coloca todos os pacientes num dashboard visual, com os dias corridos de pós-op calculados automaticamente. Você abre, você vê, você trata.

---

## Funcionalidades

- **Dashboard** com cards de todos os pacientes ativos, ordenável por nome ou dias de pós-op
- **Contagem automática** de dias desde a cirurgia (começa no D+1, como deve ser)
- **Pré-operatório** — paciente aparece no dashboard antes mesmo da cirurgia, com indicador visual
- **Tags de cirurgia** livres por tratamento (LIG, MENIS, OMBRO, COLUNA, o que você quiser)
- **Histórico** — pacientes podem ter múltiplos tratamentos ao longo do tempo sem perder o passado
- **Alta** — um botão, paciente sai da lista, dados preservados
- **Rota /tv** — dashboard fullscreen para TV 42", sem login, atualização automática a cada 5 minutos
- **Área do paciente** — login próprio para ver os próprios dias de evolução
- **Dark mode** — porque clínica com luz apagada é ambiente de trabalho, não descaso
- **Responsivo** — funciona em TV, desktop, tablet e celular

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Estilização | Tailwind CSS v4 |
| Hospedagem | Vercel |

**Custo de infraestrutura:** R$ 0,00 no free tier. Sério.

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### 1. Clone o repositório

```bash
git clone https://github.com/lucaswantz/fisiotrack.git
cd fisiotrack
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 3. Configure o banco de dados

No **SQL Editor** do Supabase, rode em ordem:

```
supabase/migrations/001_initial_schema.sql
```

Opcionalmente, para dados de teste:

```
supabase/migrations/seed_fisioterapeuta.sql  ← edite o email/senha antes
supabase/migrations/seed_pacientes.sql
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura do projeto

```
src/
  app/
    dashboard/          → Lista de pacientes ativos
    patients/           → CRUD de pacientes e tratamentos
    me/                 → Área do paciente (somente leitura)
    tv/                 → Dashboard para TV (acesso por token)
    api/
      patients/         → Criação de pacientes + usuários
      tv/               → Dados da TV validados por token
  components/
    PatientCard         → Card reutilizado no dashboard e na TV
    DashboardGrid       → Grid com ordenação client-side
    Navbar / PatientNavbar / AppLogo
    ThemeProvider / ThemeToggle
  lib/
    supabase/           → Clientes server e client
    types.ts            → Tipos + lógica de status/dias
  proxy.ts              → Proteção de rotas (ex-middleware)

supabase/
  migrations/           → Schema SQL e seeds
```

---

## Como a TV funciona

A rota `/tv?token=SEU_TOKEN` exibe o dashboard em fullscreen sem nenhum login. O token é gerado automaticamente por fisioterapeuta e fica salvo na tabela `profiles`.

Para pegar o seu token: **Supabase → Table Editor → profiles → coluna `tv_token`**.

Cole na URL e deixe a TV ligada. O dashboard atualiza sozinho a cada 5 minutos.

---

## Modelo de dados

```
profiles (fisioterapeuta)
  └── patients (paciente)
        └── treatments (cirurgia)
              └── tags: text[]  ← campo livre, sem tabela auxiliar
```

O **status** do tratamento é calculado em tempo real:

```
discharge_date IS NOT NULL                       → Alta
surgery_date IS NULL OR surgery_date > hoje      → Pré-op
surgery_date <= hoje AND discharge_date IS NULL  → Ativo
```

Isolamento multi-tenant via **Row Level Security** do PostgreSQL — cada fisioterapeuta só acessa seus próprios dados.

---

## Licença

MIT — faz o que quiser, só não culpa a gente se o paciente não seguir o protocolo.
