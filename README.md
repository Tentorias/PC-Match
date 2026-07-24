# PC-Analyzer (PC Nexus) 💻✨

O match perfeito entre o jogo que você quer e o PC gamer que você precisa. 
O **PC-Analyzer** é uma plataforma inteligente desenvolvida para lojas de informática, focada em otimizar e automatizar a montagem de computadores sob medida para clientes através de Inteligência Artificial.

## 🚀 Principais Funcionalidades

### 🛒 Kiosk de IA (Atendimento Automático)
- **Chat Conversacional:** Atendimento ao cliente totalmente mediado por IA (Gemini 1.5 Flash).
- **Extração de NLP:** O sistema entende linguagem natural e extrai orçamento máximo, foco (CPU, GPU ou Balanceado) e os jogos desejados.
- **Otimizador Algorítmico (Knapsack):** Um motor de otimização próprio que vasculha o estoque em tempo real e monta as **8 peças fundamentais** do computador de forma matematicamente precisa, entregando o maior desempenho (FPS) sem estourar o orçamento.
- **Segurança de Hardware Rígida:** A máquina otimizada nunca recomendará uma configuração com risco de superaquecimento (Validação TDP CPU vs Cooler) ou falta de energia (Validação Consumo Total vs PSU).

### 🛠️ Painel Admin Inteligente
- **Dashboard Estatístico:** Relatórios de termos mais buscados (Jogos em Alta), Ticket Médio desejado pelos clientes e conversões.
- **Gestão de Estoque Turbinada:**
  - Cadastro em 1 clique utilizando IA (você digita "Ryzen 5 5600", e a IA preenche socket, tdp, clock, etc.).
  - Edição, exclusão e visualização rápida do inventário.

## ⚙️ Stack de Tecnologia
- **Framework:** Next.js 14 (App Router)
- **Banco de Dados:** PostgreSQL hospedado na Neon.tech
- **ORM:** Prisma
- **IA:** Google Generative AI (@google/generative-ai) com modelo `gemini-1.5-flash`
- **Estilização:** TailwindCSS (Design Frutiger Aero Dark / Neon)

## 🔧 Como rodar localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as suas chaves:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/pc_analyzer?schema=public"
   GEMINI_API_KEY="sua_chave_do_google_ai_studio"
   ```
4. Atualize o banco de dados via Prisma:
   ```bash
   npx prisma db push
   ```
5. **(Opcional) Popule o banco com peças de teste:**
   Rode os nossos scripts de seed para gerar centenas de gabinetes, fontes, coolers, placas e processadores (desde os High-End até peças "sucatas" baratas para testes de stress de orçamento):
   ```bash
   npx tsx seed_test.ts
   npx tsx seed_coolers_psu.ts
   ```
6. Inicie o servidor local:
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o projeto rodando.
