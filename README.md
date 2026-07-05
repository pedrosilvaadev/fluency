# Fluenty

Aplicação web para aprender vocabulário em inglês com feed interativo, revisão espaçada, progresso persistente e gamificação.

## Funcionalidades

- Cadastro e login com Supabase Auth por e-mail/senha e Google.
- Confirmação de e-mail e recuperação de senha.
- Feed com 54 palavras iniciais, pronúncia via Web Speech API e avaliações rápidas.
- Biblioteca de favoritos com filtros por categoria, nível e status.
- Revisão espaçada em 10 minutos, 1 dia, 3 dias ou 7 dias.
- Histórico idempotente de tentativas e sessões transacionais.
- XP, níveis, streak por timezone, missões diárias e conquistas.
- Dashboard de progresso e perfil responsivo.

## Stack

- Next.js 16 App Router e React 19
- TypeScript e Tailwind CSS 4
- PostgreSQL no Supabase
- Prisma 7 com `@prisma/adapter-pg`
- `@supabase/ssr` e `@supabase/supabase-js`
- Zod, Vitest e Playwright

## Requisitos

- Node.js 20+
- pnpm 8+
- Projeto Supabase

## Configuração

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@TRANSACTION_POOLER_HOST:6543/postgres"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@SESSION_POOLER_HOST:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
APP_URL="http://localhost:3000"
```

`DATABASE_URL` é usada pelo runtime. `DIRECT_URL` é usada por migrations, seed e verificações administrativas. Nunca exponha a chave service role em componentes client-side.

Para Google OAuth, habilite o provedor no Supabase e cadastre as URLs de callback do ambiente, incluindo:

```text
http://localhost:3000/auth/callback
```

## Instalação e banco

```bash
pnpm install
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
```

O seed é idempotente. Para conferir as contagens e chaves únicas:

```bash
pnpm exec tsx prisma/check-seed.ts
```

Para validar CRUD com rollback:

```bash
pnpm exec tsx prisma/smoke-db.ts
pnpm exec tsx prisma/smoke-db.ts --pooled
```

## Desenvolvimento

```bash
pnpm dev
```

Acesse `http://localhost:3000`.

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Arquitetura

```text
src/
├── app/                    # rotas, layouts, loading e error boundaries
├── actions/                # Server Actions de autenticação
├── components/             # componentes visuais reutilizáveis
├── features/
│   ├── vocabulary/         # feed, biblioteca e áudio
│   ├── review/             # política, serviços, ações e UI de revisão
│   └── progress/           # streak, missões, conquistas e dashboard
├── lib/
│   ├── dal/                # acesso autorizado aos dados
│   ├── supabase/           # clientes browser, server e request
│   └── prisma.ts           # client Prisma do runtime
└── proxy.ts                # refresh de sessão e gates otimistas
```

As verificações de autorização ficam próximas aos dados e são repetidas em cada Server Action. O proxy serve apenas para refresh de sessão e redirecionamentos otimistas.

## Planejamento

O andamento detalhado e os critérios de validação estão em [`doc/development-plan.md`](doc/development-plan.md).
