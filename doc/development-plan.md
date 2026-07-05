# Plano de desenvolvimento — Fluenty

## Controle do plano

Este documento é a fonte de continuidade do desenvolvimento.

Convenções:

- `[ ]` pendente
- `[x]` concluído
- `🚧` etapa atual
- `⛔` bloqueado, acompanhado do motivo
- Atualizar o documento após cada etapa validada.
- Não marcar uma etapa como concluída sem executar seus critérios de validação.
- Registrar decisões ou desvios na seção “Diário de progresso”.

## Checklist de desenvolvimento

### Step 1 — Fundação técnica

- [x] **Etapa concluída**

- [x] Corrigir `turbopack.root` no Next.js.
- [x] Migrar `app/` para `src/app/`.
- [x] Criar a arquitetura de pastas.
- [x] Instalar Prisma, Supabase, Zod, Zustand, shadcn/ui e Motion.
- [x] Configurar variáveis de ambiente.
- [x] Adicionar scripts de typecheck, testes, migrations e seed.
- [x] Validar lint, typecheck e build.

### Step 2 — Supabase e Prisma

- [x] **Etapa concluída**

- [x] Criar/configurar projeto Supabase.
- [x] Configurar PostgreSQL pooled e conexão direta.
- [x] Criar schema Prisma com os modelos obrigatórios.
- [x] Adicionar `ReviewAttempt` para histórico e idempotência.
- [x] Criar índices, enums e constraints.
- [x] Executar migration inicial.
- [x] Validar leitura e escrita no banco pelas conexões direta e pooled.

### Step 3 — Seed

- [x] **Etapa concluída**

- [x] Criar seed idempotente com `upsert`.
- [x] Adicionar pelo menos 50 palavras completas — 54 adicionadas.
- [x] Cobrir categorias e níveis definidos — 9 categorias e 18 palavras por nível.
- [x] Semear conquistas e missões — 10 conquistas e 8 missões.
- [x] Confirmar no PostgreSQL que reexecutar o seed não duplica dados.

### 🚧 Step 4 — Autenticação

- [ ] **Etapa em andamento** — implementação concluída; falta smoke real dos provedores e isolamento.

- [x] Implementar cadastro por e-mail e senha.
- [x] Implementar login com Google.
- [x] Implementar confirmação e recuperação de e-mail.
- [x] Criar callback OAuth.
- [x] Criar `src/proxy.ts`.
- [x] Sincronizar Supabase Auth com o perfil Prisma.
- [x] Proteger DAL, Server Actions e rotas.
- [ ] Testar isolamento entre usuários.

### Step 5 — Domínio e acesso a dados

- [x] **Etapa concluída**

- [x] Criar clientes Supabase browser/server.
- [x] Criar autenticação server-only.
- [x] Implementar DAL, serviços e Server Actions.
- [x] Criar DTOs serializáveis.
- [x] Validar entradas com Zod.
- [x] Padronizar retornos e erros.
- [x] Manter estado efêmero local; Zustand não foi necessário nesta fatia.

### 🚧 Step 6 — Feed e biblioteca mínima

- [ ] **Etapa em andamento** — implementação conectada ao PostgreSQL; falta smoke autenticado no navegador.

- [x] Listar vocabulário do PostgreSQL.
- [x] Implementar paginação e filtros.
- [x] Persistir “Não sei”, “Quase” e “Já sei”.
- [x] Salvar e remover favoritos.
- [x] Criar biblioteca de palavras salvas.
- [x] Implementar Web Speech API.
- [ ] Validar persistência após recarregar.

### 🚧 Step 7 — Revisão e gamificação

- [ ] **Etapa em andamento** — domínio e transação implementados; falta smoke autenticado e concorrência real.

- [x] Implementar intervalos de 10 minutos, 1, 3 e 7 dias.
- [x] Atualizar mastery, status e contadores.
- [x] Registrar sessões e tentativas.
- [x] Garantir idempotência com `clientRequestId` no serviço e constraint.
- [x] Atualizar XP e nível.
- [x] Atualizar streak por timezone.
- [x] Processar missões e conquistas.
- [x] Executar tudo em transação serializável.

Progresso offline:

- [x] Política pura dos quatro intervalos implementada e testada.
- [x] Cálculo puro de mastery, status, contadores, XP e nível implementado e testado.
- [x] Cálculo puro de streak por data civil e timezone implementado e testado.
- [x] Integrar a política ao repositório Prisma e à transação real.

### Step 8 — Gate funcional

- [ ] **Etapa pendente**

- [ ] Cadastro/login funcionando.
- [ ] Feed vindo do banco.
- [ ] Avaliações persistindo.
- [ ] Favoritos persistindo.
- [ ] Fila exibindo palavras vencidas.
- [ ] Revisão atualizando progresso.
- [ ] Dashboard refletindo dados reais.
- [ ] Isolamento entre usuários validado.
- [ ] Estados de erro, vazio e loading validados.

> A UI final não começa antes da conclusão deste gate.

### Step 9 — Interface final

- [ ] **Etapa pendente**

- [x] Criar shell autenticado.
- [x] Criar header com XP e streak.
- [x] Criar navegação inferior.
- [x] Finalizar feed vertical.
- [x] Finalizar experiência de revisão.
- [x] Criar dashboard.
- [x] Criar biblioteca.
- [x] Criar perfil e conquistas.
- [ ] Validar mobile, tablet e desktop.

### 🚧 Step 10 — Animações e acessibilidade

- [ ] **Etapa pendente**

- [x] Animar cards e transições.
- [x] Adicionar feedback de XP e progresso.
- [x] Adicionar level-up e confete.
- [x] Respeitar `prefers-reduced-motion`.
- [ ] Validar teclado, foco e leitor de tela.
- [ ] Verificar contraste e áreas de toque.

### Step 11 — Testes e entrega

- [ ] **Etapa pendente**

- [x] Testar repetição, XP, nível e streak.
- [ ] Testar transações e idempotência.
- [ ] Criar testes E2E do fluxo principal.
- [ ] Testar sessão expirada e falhas de rede.
- [x] Executar ESLint.
- [x] Executar TypeScript.
- [x] Executar testes — 30 testes aprovados em 5 arquivos.
- [x] Executar build de produção.
- [ ] Revisar erros do console.
- [x] Atualizar README.

## Regras fechadas

- Nome: Fluenty.
- Auth: e-mail/senha e Google.
- Fonte de verdade: Supabase PostgreSQL.
- Estado local: apenas estado efêmero da interface.
- Avaliar no feed adiciona à fila; favoritar não adiciona.
- Nível: `floor(totalXP / 500) + 1`.
- Timezone padrão: `America/Sao_Paulo`.
- Pronúncia: Web Speech API.
- Next.js 16: APIs assíncronas e `proxy.ts`.
- Deploy recomendado: Vercel.

## Diário de progresso

### 2026-07-03 — Step 1

Status: concluído

- Alterações realizadas: plano persistido; `turbopack.root` corrigido; aplicação migrada para `src/app`; aliases e arquitetura configurados; dependências de runtime e teste instaladas; shadcn inicializado com o componente Button; ambiente de exemplo, validação Zod, scripts, Vitest e Playwright adicionados.
- Validações executadas: `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` concluídos com sucesso.
- Pendências: nenhuma no Step 1.
- Decisões tomadas: `doc/development-plan.md` é a fonte de continuidade; Prisma 7.8 e client/adapter permanecem fixados na mesma versão; fonte do sistema será usada na fundação para manter builds offline e determinísticos.
- Próximo passo: modelar Supabase/PostgreSQL no Prisma e preparar a migration inicial.

### 2026-07-03 — Step 2

Status: bloqueado

- Alterações realizadas: Prisma 7 configurado; schema completo criado com nove modelos, enums, índices e relações; `ReviewAttempt` e ownership composto adicionados; migration SQL inicial gerada com checks de domínio, RLS e vínculo ao Supabase Auth; client e singleton `adapter-pg` preparados.
- Validações executadas: `prisma format`, `prisma validate`, `prisma generate`, geração offline da migration, lint, TypeScript, testes e build concluídos com sucesso.
- Pendências: fornecer projeto Supabase, preencher `.env.local`, aplicar a migration e executar um teste CRUD real.
- Decisões tomadas: `User.id` reutiliza e referencia o UUID do Supabase Auth; `DIRECT_URL` é exclusiva da CLI/migrations; `DATABASE_URL` pooled é exclusiva do runtime; pool inicial limitado a três conexões por instância; tabelas públicas começam com RLS sem policies e acesso somente pelo backend.
- Próximo passo: configurar as credenciais Supabase, executar `pnpm db:migrate:deploy` e validar leitura/escrita antes do Step 3.

### 2026-07-04 — Steps 3 e 7 (trabalho offline)

Status: em andamento

- Alterações realizadas: seed idempotente criado com 54 palavras completas, 10 conquistas e 8 missões; política pura de revisão criada para `AGAIN`, `HARD`, `EASY` e `MASTERED`, incluindo intervalos, mastery, contadores, XP e nível; streak diário isolado por data civil e timezone.
- Validações executadas: cobertura e unicidade do catálogo, cobertura dos enums, repetição lógica do seed em repositório em memória, intervalos de revisão, limites de mastery, regra `floor(totalXP / 500) + 1` e viradas de dia em diferentes fusos validados em 22 testes; lint, TypeScript e build de produção concluídos com sucesso.
- Pendências: aplicar a migration, executar o seed duas vezes no PostgreSQL e confirmar contagens; integrar a política de revisão à transação Prisma e validar idempotência concorrente.
- Decisões tomadas: `DIRECT_URL` permanece exclusiva para CLI, migration e seed; `DATABASE_URL` permanece exclusiva para runtime; deltas iniciais de mastery/XP ficam centralizados em `REVIEW_POLICY` para revisão de produto sem espalhar regras; `MASTERED` define mastery em 100.
- Próximo passo: implementar contratos de missões/conquistas e a orquestração por repositório injetável; quando houver credenciais, retomar a validação real dos Steps 2 e 3.

### 2026-07-04 — Steps 2 e 3

Status: concluído

- Alterações realizadas: credenciais PostgreSQL corrigidas; migration inicial aplicada; scripts reutilizáveis de smoke CRUD e verificação do seed adicionados.
- Validações executadas: CRUD com rollback aprovado nas conexões direta e pooled; seed executado duas vezes; contagens finais confirmadas em 54 palavras, 10 conquistas e 8 missões, sem chaves duplicadas.
- Pendências: nenhuma nos Steps 2 e 3.
- Decisões tomadas: migrations, seed e verificações administrativas usam `DIRECT_URL`; runtime usa `DATABASE_URL` pooled.
- Próximo passo: integrar autenticação, DAL e fluxo persistente de aprendizagem.

### 2026-07-04 — Checkpoint antes da próxima sessão

Status: em andamento

- Alterações realizadas: autenticação Supabase SSR completa com e-mail/senha, Google, confirmação, recovery, callback, proxy e sincronização Prisma; DAL, DTOs, Zod e Server Actions protegidas; feed, favoritos, biblioteca, Web Speech, fila de revisão, sessões/tentativas, idempotência, XP, nível, streak, missões e conquistas; shell mobile-first e páginas de feed, revisão, progresso, biblioteca e perfil conectadas a DTOs reais.
- Validações executadas: migration e CRUD direto/pooled aprovados; seed executado duas vezes e verificado sem duplicatas; ESLint aprovado antes da integração final; TypeScript aprovado após a integração das rotas.
- Pendências: executar Prettier/lint/build finais; smoke de cadastro/login/Google/recovery; validar persistência após reload e isolamento com dois usuários; smoke completo do feed/revisão/gamificação; revisar checks dos Steps 4–10 somente após esses critérios; atualizar README e testes finais.
- Decisões tomadas: autorização real fica no DAL/Actions, nunca apenas no proxy; `userId` é obtido exclusivamente no servidor; `requireAuth` não muta durante render; feed registra uma sessão unitária e adiciona a palavra à fila; transações de revisão usam isolamento serializável e retry de conflitos.
- Próximo passo: iniciar com `pnpm prettier`, `pnpm lint`, `pnpm typecheck` e `pnpm build`; corrigir integração; subir o app e executar smoke autenticado; então concluir os checks restantes em ordem.

### 2026-07-04 — Hardening e integração final local

Status: em andamento

- Alterações realizadas: feed ganhou paginação real; filtros inválidos passaram a usar fallback seguro; callbacks de autenticação foram protegidos contra open redirect e passaram a preservar `next`; mensagens Prisma deixaram de ser expostas; autenticação não é capturada dentro de `try/catch`; sessões ganharam fonte, itens explícitos, consumo atômico e uniques; elegibilidade de feed/revisão passou a ser revalidada dentro da transação; feedback de XP, celebração, loading por rota, erro global, 404, skip link e melhorias de acessibilidade foram adicionados; README foi substituído pela documentação real do projeto.
- Validações executadas: migration `20260704120000_review_session_integrity` aplicada no Supabase; rota raiz e `/feed` redirecionam convidados corretamente por HTTP; 30 testes unitários aprovados; ESLint, TypeScript e build Next.js 16 aprovados.
- Pendências: repetir `pnpm exec tsx prisma/smoke-flow.ts` após o último ajuste de `createMany`; a tentativa anterior encontrou o nested create incompatível e motivou a correção, mas a repetição foi bloqueada pelo limite de aprovação externa; validar UI no navegador, mobile/tablet/desktop, console, Google/recovery, persistência após reload e isolamento visual entre duas contas; criar E2E autenticado e cenários de sessão expirada/falha de rede.
- Decisões tomadas: feed só aceita a primeira avaliação; revisão só aceita palavras vencidas; cada sessão contém itens explícitos e cada item só pode gerar uma tentativa; retries reutilizam `clientRequestId`; callbacks aceitam apenas destinos internos allowlisted; erros desconhecidos são registrados apenas no servidor.
- Próximo passo: assim que a execução externa estiver disponível, rodar `pnpm exec tsx prisma/smoke-flow.ts`; depois executar smoke visual autenticado e fechar Steps 4, 6, 7, 8, 9 e 10 conforme evidência.

## Modelo para novas atualizações

```md
### AAAA-MM-DD — Step N

Status: concluído | em andamento | bloqueado

- Alterações realizadas:
- Validações executadas:
- Pendências:
- Decisões tomadas:
- Próximo passo:
```
