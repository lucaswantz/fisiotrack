# FisioTrack — Definição do Projeto

## Visão Geral

Aplicação web responsiva para acompanhamento de pacientes em tratamento fisioterapêutico pós-cirúrgico. O sistema calcula automaticamente os dias corridos desde a cirurgia e exibe um dashboard visual otimizado tanto para TV quanto para dispositivos móveis.

---

## Problema que resolve

Fisioterapeutas precisam acompanhar em que fase de recuperação cada paciente está, especialmente em pós-operatórios onde a progressão do tratamento é guiada pelos dias desde a cirurgia. Hoje esse controle é manual (planilhas, anotações), o que dificulta a visão rápida do status geral da carteira de pacientes.

---

## Usuários

| Perfil | Acesso | Responsabilidades |
|---|---|---|
| **Fisioterapeuta** | Total | Cadastra pacientes, define datas de cirurgia, gerencia tags de procedimento, dá alta |
| **Paciente** | Leitura (próprios dados) | Visualiza seu acompanhamento, sem interações |

- Produto multi-tenant: cada fisioterapeuta tem sua própria conta e carteira de pacientes isolada
- Sem papel de recepcionista ou administrador de clínica por enquanto
- A TV exibe o dashboard em modo somente leitura (sem login interativo na TV)

---

## Funcionalidades Core

### 1. Dashboard de pacientes ativos

- Lista todos os pacientes em tratamento ativo
- Cada card exibe:
  - Nome do paciente
  - Dias corridos de pós-operatório (calculado automaticamente)
  - Tags de tipo de cirurgia (ex: `LIG` · `MENIS` · `SUTURA`)
  - Indicador visual de **pré-operatório** (quando aplicável)
- Ordenação padrão: **alfabética** por nome do paciente
- Paginação para listas grandes

### 2. Contagem de dias

- Contagem começa no **dia seguinte à cirurgia** (D+1)
  - Exemplo: cirurgia em 10/04 → dia 10/04 = Dia 0, dia 11/04 = Dia 1
- Calculado automaticamente a partir da data de cirurgia cadastrada
- Não há contagem manual de sessões

### 3. Pré-operatório

- Pacientes que iniciam sessões antes da cirurgia são marcados como **pré-op**
- Esses pacientes aparecem no dashboard com indicador especial
- A contagem de dias não se aplica até que a data de cirurgia seja registrada
- A data de cirurgia pode ser pré-cadastrada (futura) — o status muda para `active` automaticamente quando a data chega
- Não há criação de novo tratamento: o fisioterapeuta edita o tratamento pré-op adicionando a data da cirurgia

### 4. Alta do paciente

- O fisioterapeuta registra a alta com um único botão de confirmação
- Após a alta, o paciente sai da lista ativa
- Dados históricos são preservados (não excluídos)

### 5. Visão do paciente

- Paciente acessa via login próprio (email/senha criados pelo fisioterapeuta)
- Vê apenas seus próprios dados (nome, dias de tratamento, fase)
- Somente leitura — sem interações

---

## Layout do Dashboard (TV 42" Full HD — 1920×1080)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Paciente │ Paciente │ Paciente │ Paciente │ Paciente │
│  Dia 45  │  Dia 38  │  Dia 31  │  Dia 22  │  Dia 18  │
│ LIG·MENIS│  SUTURA  │   LIG    │  MENIS   │  [PRÉ-OP]│
├──────────┼──────────┼──────────┼──────────┼──────────┤
│          │          │          │          │          │
│  ...     │  ...     │  ...     │  ...     │  ...     │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

- **Grade: 5 colunas × 6 linhas = 30 cards por página**
- Paginação automática se houver mais de 30 pacientes ativos
- Cards compactos com hierarquia visual clara: nome > dias > tags
- A TV acessa a URL do dashboard — sem necessidade de login interativo na TV

---

## Responsividade

| Dispositivo | Comportamento |
|---|---|
| TV 42" (1920×1080) | Grade 5×6, cards compactos, visualização em loop/paginada |
| Desktop / laptop | Grade adaptada, acesso completo às funções de gestão |
| Tablet | Grade 2-3 colunas |
| Celular | Lista vertical, 1 card por linha |

---

## Arquitetura e Infraestrutura

- **Plataforma:** Aplicação web em nuvem (SaaS)
- **Acesso:** Via navegador, sem instalação — funciona em TV, celular, tablet e desktop
- **Multi-tenant:** Dados isolados por fisioterapeuta via Row Level Security (RLS)
- **Autenticação:** Login por fisioterapeuta; acesso do paciente via credencial separada

### Stack Técnica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | Next.js (React) | Usuário conhece React; SSR + API routes em um repositório só |
| **Backend** | Next.js API Routes | Elimina servidor separado; roda na Vercel gratuitamente |
| **Banco de dados** | Supabase (PostgreSQL) | Auth pronto, RLS nativo para multi-tenancy, free tier generoso |
| **Autenticação** | Supabase Auth | Email/senha para fisioterapeuta e paciente, sem implementação manual |
| **Hospedagem** | Vercel | Deploy automático, free tier, integração nativa com Next.js |
| **Mobile** | PWA (via Next.js) | Sem app nativo — navegador cobre todos os dispositivos |

**Custo inicial: R$ 0** — Vercel free + Supabase free tier (500MB, suficiente para anos de uso).

---

## Modelagem do Banco de Dados

### Tabelas

#### `profiles` — Fisioterapeutas
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | Referencia `auth.users` do Supabase |
| `name` | text | Nome do fisioterapeuta |
| `tv_token` | uuid | Token secreto para acesso à rota `/tv` sem login |
| `created_at` | timestamptz | Data de cadastro |


#### `patients` — Pacientes
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | |
| `physiotherapist_id` | uuid (FK → profiles) | Fisioterapeuta responsável |
| `auth_user_id` | uuid (FK → auth.users) | Credencial de acesso do paciente |
| `name` | text | Nome completo |
| `created_at` | timestamptz | |

> O paciente é cadastrado uma única vez. Cada cirurgia gera um tratamento separado.

#### `treatments` — Tratamentos (um por cirurgia)
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | |
| `patient_id` | uuid (FK → patients) | |
| `surgery_date` | date (nullable) | `null` ou data futura = pré-op; data passada = ativo |
| `discharge_date` | date (nullable) | Preenchido = alta; `null` = em tratamento |
| `tags` | text[] | Ex: `["LIG", "MENIS"]` — campo livre, sem tabela auxiliar |
| `notes` | text (nullable) | Observações livres do fisioterapeuta |
| `created_at` | timestamptz | |

> Tags são texto livre por tratamento — sem tabela auxiliar.

### Relacionamentos

```
profiles (fisioterapeuta)
  └── patients (paciente)
        └── treatments (tratamento / cirurgia)
              └── tags: text[] (campo livre)
```

Um paciente pode ter múltiplos tratamentos ao longo do tempo, mas **apenas um tratamento ativo por vez**. O dashboard exibe apenas o tratamento com `status = active` ou `pre_op`. Histórico completo fica acessível por paciente.

### Cálculo de status e dias (lógica de aplicação)

Status derivado em tempo real — sem coluna `status` no banco:

```
discharge_date IS NOT NULL                          → discharged
surgery_date IS NULL OR surgery_date > hoje         → pre_op
surgery_date <= hoje AND discharge_date IS NULL     → active
```

Dias de pós-op:
```
dias_pos_op = hoje - surgery_date
```

Calculado em tempo real — não armazenado.

### Isolamento multi-tenant (RLS)

Todas as tabelas têm política RLS garantindo que o fisioterapeuta acessa **somente seus próprios registros**. O paciente acessa somente os tratamentos vinculados ao seu `auth_user_id`.

---

## Rotas e Telas

### Área do fisioterapeuta

| Rota | Tela |
|---|---|
| `/login` | Login (compartilhado — redireciona conforme perfil) |
| `/dashboard` | Dashboard principal: pacientes com tratamento ativo ou pré-op |
| `/patients` | Lista completa de pacientes (ativos + com alta) |
| `/patients/new` | Cadastrar novo paciente |
| `/patients/[id]` | Perfil do paciente: dados editáveis + histórico de tratamentos |
| `/patients/[id]/treatments/new` | Iniciar novo tratamento (nova cirurgia) |
| `/patients/[id]/treatments/[tid]` | Detalhes de um tratamento: editar, dar alta |

### Área do paciente

| Rota | Tela |
|---|---|
| `/login` | Mesmo login, redireciona para `/me` |
| `/me` | Tratamento atual: dias de pós-op, tags, status — somente leitura |

### TV (sem login)

| Rota | Tela |
|---|---|
| `/tv?token=[token_secreto]` | Dashboard fullscreen sem navegação, atualização automática |

> A URL da TV contém um token secreto gerado por fisioterapeuta. Sem token válido, a rota retorna 403. Não exige login — ideal para deixar aberto em uma TV sem interação. Dados recarregados automaticamente a cada **5 minutos**.

---

## Fora do Escopo (por ora)

- Integração com planos de saúde ou convênios
- Contagem de sessões individuais
- Notificações ou alertas
- Prontuário eletrônico completo
- Agendamento de consultas
- Financeiro / faturamento
- App nativo (iOS / Android) — PWA cobre o caso mobile

---

## Glossário

| Termo | Significado |
|---|---|
| Pós-op | Pós-operatório: período após a cirurgia |
| Pré-op | Pré-operatório: período de sessões antes da cirurgia |
| Dia de tratamento | Dias corridos desde a cirurgia (D+1) |
| Alta | Encerramento formal do tratamento pelo fisioterapeuta |
| Tag de cirurgia | Indicador abreviado do tipo de procedimento cirúrgico |

---

## Exemplos de Tags de Cirurgia

- `LIG` — Ligamento (ex: LCA, LCL)
- `MENIS` — Menisco
- `SUTURA` — Sutura de tecidos moles
- `OMBRO` — Cirurgia de ombro
- `COLUNA` — Coluna vertebral
- *(lista extensível pelo fisioterapeuta)*

---

*Documento gerado em 07/04/2026 — atualizado em 07/04/2026 com stack técnica e modelagem de dados.*
