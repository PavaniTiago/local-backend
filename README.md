# Desafio Local Server - Backend API

Backend API para gerenciamento de locais (pontos de interesse) construído com **NestJS**, **Drizzle ORM**, **PostgreSQL** seguindo princípios de **Domain-Driven Design (DDD)** e **Clean Code**.

## 🏗️ Arquitetura

Este projeto implementa uma arquitetura DDD em camadas:

- **Domain Layer**: Entidades e regras de negócio puras (sem dependências externas)
- **Application Layer**: Casos de uso e DTOs
- **Infrastructure Layer**: Implementações técnicas (database, HTTP, etc.)
- **Shared Layer**: Utilitários e constantes compartilhadas

### Estrutura de Pastas

```
src/
├── domain/              # Lógica de negócio pura
│   ├── entities/        # Entidades do domínio
│   └── repositories/    # Interfaces dos repositórios
├── application/         # Casos de uso
│   ├── use-cases/       # Implementação dos casos de uso
│   └── dto/             # Data Transfer Objects
├── infrastructure/      # Camada técnica
│   ├── database/        # Configuração do banco e repositórios
│   │   ├── drizzle/     # Schema e migrations do Drizzle
│   │   ├── mappers/     # Conversão domain ↔ database
│   │   └── repositories/ # Implementações dos repositórios
│   └── http/            # Controllers e módulos HTTP
└── shared/              # Código compartilhado
    ├── constants/       # Tokens de injeção de dependência
    └── exceptions/      # Exceções customizadas
```

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem com tipagem estática
- **Drizzle ORM** - ORM type-safe e performático
- **PostgreSQL** - Banco de dados relacional
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)
- PostgreSQL 14+ (local ou Render.com)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/desafio_locais

# CORS - Frontend URLs
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://seu-app.vercel.app
```

### 3. Criar banco de dados PostgreSQL

#### Opção A: PostgreSQL Local

```bash
# Criar banco de dados
createdb desafio_locais
```

#### Opção B: PostgreSQL no Render.com (Grátis)

1. Acesse [render.com](https://render.com)
2. Crie um novo PostgreSQL database (free tier)
3. Copie a **Internal Database URL**
4. Cole no `.env` como `DATABASE_URL`

### 4. Executar migrations

```bash
# Gerar migration a partir do schema
pnpm db:generate

# Aplicar migrations no banco
pnpm db:migrate

# OU push direto (somente desenvolvimento)
pnpm db:push
```

## 🏃 Executando a aplicação

### Desenvolvimento (com hot-reload)

```bash
pnpm run start:dev
```

A API estará disponível em `http://localhost:3000`

### Produção

```bash
# Build
pnpm run build

# Executar
pnpm run start:prod
```

## 📚 API Endpoints

### Locais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/locais` | Criar novo local |
| GET | `/locais` | Listar todos os locais |
| GET | `/locais/:id` | Buscar local por ID |
| PATCH | `/locais/:id` | Atualizar local |
| DELETE | `/locais/:id` | Deletar local |

### Exemplo de Request Body (POST/PATCH)

```json
{
  "nome": "Cristo Redentor",
  "descricao": "Monumento icônico do Rio de Janeiro",
  "latitude": -22.951916,
  "longitude": -43.210487,
  "imagem": "https://example.com/cristo.jpg"
}
```

### Exemplo de Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Cristo Redentor",
  "descricao": "Monumento icônico do Rio de Janeiro",
  "latitude": -22.951916,
  "longitude": -43.210487,
  "imagem": "https://example.com/cristo.jpg"
}
```

## 🗃️ Database

### Comandos Drizzle

```bash
# Gerar migration a partir de mudanças no schema
pnpm db:generate

# Aplicar migrations pendentes
pnpm db:migrate

# Push schema direto (dev only - sem criar migrations)
pnpm db:push

# Abrir Drizzle Studio (GUI para visualizar dados)
pnpm db:studio
```

### Schema da tabela `locais`

| Campo | Tipo | Restrições |
|-------|------|------------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() |
| nome | text | NOT NULL |
| descricao | text | NOT NULL |
| latitude | double precision | NOT NULL |
| longitude | double precision | NOT NULL |
| imagem | text | NOT NULL |

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes em watch mode
pnpm run test:watch

# Testes e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## 🎨 Code Quality

```bash
# Lint com auto-fix
pnpm run lint

# Format com Prettier
pnpm run format
```

## 🚢 Deploy no Render.com

### Opção 1: Deploy Manual (Recomendado para iniciantes)

#### Passo 1: Criar PostgreSQL Database

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `desafio-locais-db`
   - **Database**: `desafio_locais`
   - **Region**: Ohio (US East) - mais rápida para o Brasil
   - **Instance Type**: **Free**
4. Clique em **"Create Database"**
5. **IMPORTANTE**: Copie a **Internal Database URL** (formato: `postgresql://user:pass@dpg-xxx/dbname`)

#### Passo 2: Criar Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte ao seu repositório GitHub/GitLab
3. Selecione o repositório `desafio-local-server`
4. Configure:
   - **Name**: `desafio-locais-api`
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm run build:prod`
   - **Start Command**: `pnpm run start:prod`
   - **Instance Type**: Free

#### Passo 3: Configurar Variáveis de Ambiente

No painel do Web Service, vá em **"Environment"** e adicione:

```env
NODE_ENV=production
PORT=3333
DATABASE_URL=<cole aqui a Internal Database URL copiada do PostgreSQL>
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://seu-frontend.vercel.app
```

#### Passo 4: Deploy

1. Clique em **"Create Web Service"**
2. Render irá:
   - Instalar as dependências
   - Executar as migrations automaticamente (via `build:prod`)
   - Compilar o TypeScript
   - Iniciar o servidor

#### Passo 5: Testar

Após o deploy, acesse:
```
https://desafio-locais-api.onrender.com/locais
```

### Opção 2: Deploy com render.yaml (Blueprint)

1. Commit o arquivo `render.yaml` no seu repositório
2. No Render, clique em **"New +"** → **"Blueprint"**
3. Conecte ao repositório
4. O Render criará automaticamente:
   - PostgreSQL Database
   - Web Service
   - Todas as configurações necessárias

### Troubleshooting no Render

#### Erro de conexão com o banco:
- Verifique se a `DATABASE_URL` está usando a **Internal Database URL**, não a External
- Aguarde alguns minutos após criar o database antes de fazer deploy

#### Migrations não rodaram:
- Verifique os logs do build
- Execute manualmente: `pnpm db:migrate` localmente apontando para o banco do Render

#### Servidor não inicia:
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs em "Logs" no dashboard do Render

## 🏛️ Princípios Arquiteturais

### Domain-Driven Design (DDD)

- **Entities**: Objetos com identidade única (`Local`)
- **Repositories**: Interfaces para persistência (padrão Repository)
- **Use Cases**: Um caso de uso por operação de negócio
- **Dependency Inversion**: Domain não depende de Infrastructure

### Clean Code

- **Single Responsibility**: Cada classe/função tem uma responsabilidade
- **Dependency Injection**: Todas as dependências injetadas via construtor
- **Type Safety**: TypeScript usado ao máximo para segurança de tipos
- **Separation of Concerns**: Camadas bem definidas e desacopladas
- **SOLID Principles**: Aplicados em toda a arquitetura

### Padrões Utilizados

- **Repository Pattern**: Abstração da camada de dados
- **Mapper Pattern**: Conversão entre domain entities e database models
- **DTO Pattern**: Validação e transformação de dados de entrada/saída
- **Dependency Injection**: Inversão de controle com NestJS DI container

## 📖 Documentação Adicional

- [CLAUDE.md](./CLAUDE.md) - Guia completo da arquitetura para Claude Code
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

## 📝 Notas de Desenvolvimento

### Validações

- **DTOs**: Validação de formato e tipos com `class-validator`
- **Domain Entities**: Validação de regras de negócio
  - Latitude: -90 a 90
  - Longitude: -180 a 180
  - URL válida para imagem
  - Nome obrigatório

### CORS

Configurado para aceitar requisições de:
- `http://localhost:3000` (desenvolvimento)
- URL configurada em `FRONTEND_URL_PRODUCTION`

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Veja o arquivo de requisitos para detalhes sobre funcionalidades implementadas.

## 📄 Licença

UNLICENSED - Projeto de desafio técnico
