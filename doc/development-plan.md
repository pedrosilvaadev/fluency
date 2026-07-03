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

### ⛔ Step 2 — Supabase e Prisma

- [ ] **Etapa bloqueada** — aguardando projeto e credenciais do Supabase.

- [ ] ⛔ Criar/configurar projeto Supabase — aguardando projeto e credenciais.
- [ ] ⛔ Configurar PostgreSQL pooled e conexão direta — contratos preparados em `.env.example`; faltam URLs reais.
- [x] Criar schema Prisma com os modelos obrigatórios.
- [x] Adicionar `ReviewAttempt` para histórico e idempotência.
- [x] Criar índices, enums e constraints.
- [ ] ⛔ Executar migration inicial — SQL criado e validado estaticamente; falta conexão Supabase.
- [ ] ⛔ Validar leitura e escrita no banco — depende da migration aplicada.

### Step 3 — Seed

- [ ] **Etapa pendente**

- [ ] Criar seed idempotente.
- [ ] Adicionar pelo menos 50 palavras completas.
- [ ] Cobrir categorias e níveis definidos.
- [ ] Semear conquistas e missões.
- [ ] Confirmar que reexecutar o seed não duplica dados.

### Step 4 — Autenticação

- [ ] **Etapa pendente**

- [ ] Implementar cadastro por e-mail e senha.
- [ ] Implementar login com Google.
- [ ] Implementar confirmação e recuperação de e-mail.
- [ ] Criar callback OAuth.
- [ ] Criar `src/proxy.ts`.
- [ ] Sincronizar Supabase Auth com o perfil Prisma.
- [ ] Proteger DAL, Server Actions e rotas.
- [ ] Testar isolamento entre usuários.

### Step 5 — Domínio e acesso a dados

- [ ] **Etapa pendente**

- [ ] Criar clientes Supabase browser/server.
- [ ] Criar autenticação server-only.
- [ ] Implementar DAL, serviços e Server Actions.
- [ ] Criar DTOs serializáveis.
- [ ] Validar entradas com Zod.
- [ ] Padronizar retornos e erros.
- [ ] Configurar Zustand somente para estado efêmero.

### Step 6 — Feed e biblioteca mínima

- [ ] **Etapa pendente**

- [ ] Listar vocabulário do PostgreSQL.
- [ ] Implementar paginação e filtros.
- [ ] Persistir “Não sei”, “Quase” e “Já sei”.
- [ ] Salvar e remover favoritos.
- [ ] Criar biblioteca de palavras salvas.
- [ ] Implementar Web Speech API.
- [ ] Validar persistência após recarregar.

### Step 7 — Revisão e gamificação

- [ ] **Etapa pendente**

- [ ] Implementar intervalos de 10 minutos, 1, 3 e 7 dias.
- [ ] Atualizar mastery, status e contadores.
- [ ] Registrar sessões e tentativas.
- [ ] Garantir idempotência com `clientRequestId`.
- [ ] Atualizar XP e nível.
- [ ] Atualizar streak por timezone.
- [ ] Processar missões e conquistas.
- [ ] Executar tudo em transação.

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

- [ ] Criar shell autenticado.
- [ ] Criar header com XP e streak.
- [ ] Criar navegação inferior.
- [ ] Finalizar feed vertical.
- [ ] Finalizar experiência de revisão.
- [ ] Criar dashboard.
- [ ] Criar biblioteca.
- [ ] Criar perfil e conquistas.
- [ ] Validar mobile, tablet e desktop.

### Step 10 — Animações e acessibilidade

- [ ] **Etapa pendente**

- [ ] Animar cards e transições.
- [ ] Adicionar feedback de XP e progresso.
- [ ] Adicionar level-up e confete.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Validar teclado, foco e leitor de tela.
- [ ] Verificar contraste e áreas de toque.

### Step 11 — Testes e entrega

- [ ] **Etapa pendente**

- [ ] Testar repetição, XP, nível e streak.
- [ ] Testar transações e idempotência.
- [ ] Criar testes E2E do fluxo principal.
- [ ] Testar sessão expirada e falhas de rede.
- [ ] Executar ESLint.
- [ ] Executar TypeScript.
- [ ] Executar testes.
- [ ] Executar build de produção.
- [ ] Revisar erros do console.
- [ ] Atualizar README.

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
