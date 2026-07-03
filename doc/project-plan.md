Você é um time de desenvolvimento com múltiplos subagentes especializados. Sua missão é criar uma aplicação web moderna para estudo de inglês com foco em vocabulário, revisão espaçada estilo Anki e experiência gamificada.

Nome provisório do projeto: **VocabQuest**

Objetivo:
Criar uma plataforma onde o usuário aprende palavras novas em inglês por meio de um feed interativo estilo TikTok/Instagram, revisa vocabulário com sistema de repetição espaçada e acompanha sua evolução com gamificação.

Stack recomendada:

- Next.js com App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion para animações
- Zustand para estado global
- React Hook Form + Zod para formulários
- LocalStorage ou IndexedDB para persistência inicial
- Dados mockados no início
- Arquitetura preparada para futura integração com backend e IA

Use subagentes durante o desenvolvimento:

1. **Product Designer Agent**
   - Definir UX, fluxos principais, navegação e hierarquia visual.
   - Garantir design moderno, gamificado e intuitivo.

2. **Frontend Architect Agent**
   - Criar estrutura de pastas escalável.
   - Definir componentes reutilizáveis.
   - Garantir código limpo, tipado e organizado.

3. **UI Animation Agent**
   - Criar animações com Framer Motion.
   - Implementar transições suaves entre cards.
   - Adicionar microinterações em botões, XP, streak e progresso.

4. **Learning Algorithm Agent**
   - Criar lógica de repetição espaçada inspirada no Anki.
   - Calcular próxima revisão com base nas respostas do usuário.

5. **Mock Data Agent**
   - Criar palavras, exemplos, categorias, níveis e estatísticas mockadas.
   - Gerar conteúdo realista para demonstração.

6. **QA Agent**
   - Revisar bugs, responsividade, acessibilidade e experiência mobile.

Requisitos de design:

- Visual moderno, premium e gamificado.
- Interface com sensação de app mobile-first.
- Usar cards grandes, rounded corners, sombras suaves, gradientes e badges.
- Inspirar-se em Duolingo, TikTok, Anki e apps fitness/games.
- Criar sensação de progresso constante.
- Usar animações para:
  - swipe de cards
  - ganho de XP
  - streak diário
  - nível subindo
  - conclusão de revisão
  - cards entrando e saindo da tela

Tema visual:

- Dark mode como padrão.
- Cores vibrantes para elementos de progresso.
- Cards com destaque visual.
- Ícones claros e interface simples.

Estrutura principal da aplicação:

## Step 1 — Setup inicial

Criar o projeto com:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Framer Motion
- Zustand

Criar estrutura de pastas:

src/

- app/
- components/
- features/
- lib/
- data/
- hooks/
- store/
- types/

## Step 2 — Layout base

Criar layout principal mobile-first com:

- Header com nome do app, streak e XP.
- Bottom navigation com:
  - Feed
  - Review
  - Progress
  - Library
  - Profile

## Step 3 — Feed de vocabulário

Criar tela principal estilo Instagram/TikTok.

Cada card deve exibir:

- Palavra em inglês
- Pronúncia
- Tradução
- Frase de exemplo em inglês
- Tradução da frase
- Categoria
- Nível: beginner, intermediate ou advanced
- Botão de áudio fake
- Botões:
  - Já sei
  - Quase
  - Não sei
  - Salvar

O usuário deve conseguir navegar verticalmente entre os cards.

## Step 4 — Sistema de revisão estilo Anki

Criar uma tela de revisão com cards rápidos.

Fluxo:

- Mostrar a palavra primeiro.
- Ao tocar, revelar tradução, exemplo e explicação.
- Usuário responde:
  - Não lembrei
  - Difícil
  - Fácil
  - Dominei

Cada resposta deve atualizar:

- nível de domínio
- quantidade de acertos
- quantidade de erros
- próxima data de revisão
- XP recebido

Lógica sugerida:

- Não lembrei: revisar em 10 minutos
- Difícil: revisar em 1 dia
- Fácil: revisar em 3 dias
- Dominei: revisar em 7 dias

## Step 5 — Gamificação

Criar sistema com:

- XP total
- Streak diário
- Level
- Barra de progresso
- Badges/conquistas
- Missões diárias

Exemplos de missões:

- Revisar 10 palavras hoje
- Aprender 5 palavras novas
- Manter streak por 3 dias
- Dominar 20 palavras

## Step 6 — Dashboard de progresso

Criar tela com:

- Total de palavras aprendidas
- Palavras para revisar hoje
- Palavras dominadas
- Taxa de acerto
- XP semanal
- Streak atual
- Gráfico simples de evolução
- Categorias mais estudadas

## Step 7 — Biblioteca de palavras

Criar tela com lista de vocabulários salvos.

Filtros:

- Todas
- Para revisar
- Dominadas
- Difíceis
- Por categoria
- Por nível

Cada item deve mostrar:

- palavra
- tradução
- domínio
- próxima revisão
- categoria

## Step 8 — Perfil do usuário

Criar tela de perfil com:

- nome fictício
- nível atual
- XP total
- streak
- conquistas desbloqueadas
- estatísticas gerais

## Step 9 — Dados mockados

Criar dados mockados realistas com pelo menos 40 palavras.

Cada palavra deve ter:

{
id: string;
word: string;
pronunciation: string;
translation: string;
example: string;
exampleTranslation: string;
category: string;
level: "beginner" | "intermediate" | "advanced";
mastery: number;
nextReview: string;
correctCount: number;
wrongCount: number;
isSaved: boolean;
}

Categorias sugeridas:

- Daily Life
- Business
- Travel
- Technology
- Emotions
- Phrasal Verbs
- Interviews
- Movies

## Step 10 — Animações e microinterações

Adicionar:

- animação ao trocar cards
- efeito de confete ao completar revisão
- feedback visual ao ganhar XP
- animação de progresso da barra
- cards com hover/tap animation
- transição suave entre páginas

## Step 11 — Responsividade

A aplicação deve funcionar muito bem em:

- mobile
- tablet
- desktop

No desktop, manter visual centralizado simulando app mobile premium.

## Step 12 — Qualidade final

Antes de finalizar:

- Revisar TypeScript
- Remover código morto
- Garantir responsividade
- Garantir que não existam erros no console
- Garantir boa organização dos componentes
- Criar README explicando:
  - objetivo do projeto
  - stack usada
  - features
  - como rodar
  - próximos passos

Não implemente backend agora.
Não use autenticação real agora.
Não use banco de dados real agora.
Use apenas dados mockados e persistência local.

Resultado esperado:
Uma aplicação web funcional, bonita, moderna, gamificada e impressionante para demonstrar como IA pode ajudar no estudo de inglês.

Prioridade:

1. Experiência visual forte
2. Feed de palavras
3. Revisão estilo Anki
4. Gamificação
5. Dashboard
6. Código limpo e escalável

Comece criando a estrutura do projeto, depois implemente feature por feature seguindo os steps acima. A cada etapa, valide se o código está funcionando antes de avançar.
Atualização técnica do projeto:

O projeto deve usar backend real com banco de dados desde o início.

Stack obrigatória:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Prisma ORM
- PostgreSQL
- Supabase
- Supabase Auth
- Zustand ou TanStack Query para estado/cache no frontend
- Zod para validação
- Server Actions ou Route Handlers do Next.js para operações no backend

Requisitos de banco de dados:
Criar schema Prisma para:

1. User

- id
- name
- email
- avatarUrl
- xp
- level
- streak
- createdAt
- updatedAt

2. Vocabulary

- id
- word
- pronunciation
- translation
- example
- exampleTranslation
- category
- level
- createdAt
- updatedAt

3. UserVocabulary
   Tabela intermediária entre usuário e palavra.

Campos:

- id
- userId
- vocabularyId
- mastery
- correctCount
- wrongCount
- isSaved
- status
- nextReviewAt
- lastReviewedAt
- createdAt
- updatedAt

Status possíveis:

- new
- learning
- reviewing
- mastered

4. ReviewSession

- id
- userId
- totalCards
- correctAnswers
- wrongAnswers
- xpEarned
- createdAt

5. Achievement

- id
- title
- description
- icon
- requiredValue
- type
- createdAt

6. UserAchievement

- id
- userId
- achievementId
- unlockedAt

7. DailyMission

- id
- title
- description
- xpReward
- targetValue
- type
- createdAt

8. UserDailyMission

- id
- userId
- missionId
- currentValue
- completed
- completedAt
- date

Funcionalidades obrigatórias com banco:

- Cadastro e login com Supabase Auth.
- Cada usuário deve ter seu próprio progresso.
- Salvar palavras no perfil do usuário.
- Revisar palavras com algoritmo estilo Anki.
- Atualizar domínio da palavra após cada resposta.
- Calcular próxima data de revisão.
- Registrar sessões de revisão.
- Atualizar XP, level e streak.
- Desbloquear conquistas.
- Exibir dashboard real baseado nos dados do usuário.
- Exibir biblioteca de palavras salvas.
- Criar seed inicial com pelo menos 50 palavras em inglês.

Regras técnicas:

- Usar Prisma para modelagem e queries no PostgreSQL.
- Usar Supabase como banco PostgreSQL e autenticação.
- Usar variáveis de ambiente:
  - DATABASE_URL
  - DIRECT_URL
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

Criar arquivos:

- prisma/schema.prisma
- prisma/seed.ts
- src/lib/prisma.ts
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/lib/auth.ts
- src/lib/spaced-repetition.ts
- src/actions/vocabulary.ts
- src/actions/review.ts
- src/actions/progress.ts

O projeto deve ter uma arquitetura limpa, escalável e fácil de evoluir para integração com IA no futuro.

Não use dados mockados como fonte principal.
Os dados podem ser usados apenas no seed inicial.

A aplicação final deve permitir que um usuário real crie conta, aprenda vocabulários, salve palavras, revise com repetição espaçada e acompanhe progresso real no dashboard.
Importante:
Antes de começar a implementar as telas, configure primeiro:

1. Supabase
2. Prisma
3. Schema do banco
4. Autenticação
5. Seed inicial
6. Operações básicas de leitura/escrita

Depois implemente a interface conectada aos dados reais.

Não avance para UI final enquanto o fluxo principal não estiver funcionando:
cadastro/login → listar palavras → salvar palavra → revisar palavra → atualizar progresso → mostrar dashboard.
