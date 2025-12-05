# Desafio Local Server - Backend API

Backend API para gerenciamento de locais (pontos de interesse) construído com NestJS, Drizzle ORM e PostgreSQL, seguindo princípios de Domain-Driven Design (DDD) e Clean Architecture.

## Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Arquitetura e Decisões de Design](#arquitetura-e-decisões-de-design)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Testes](#testes)
- [Deploy](#deploy)

## Tecnologias

- **NestJS** - Framework Node.js progressivo para construção de aplicações server-side escaláveis
- **TypeScript** - Linguagem com tipagem estática para maior segurança e produtividade
- **Drizzle ORM** - ORM type-safe e performático para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **class-validator** - Validação de DTOs na camada de aplicação
- **class-transformer** - Transformação de objetos entre camadas

## Pré-requisitos

- Node.js 18 ou superior
- pnpm (gerenciador de pacotes)
- PostgreSQL 14 ou superior (local ou em serviço cloud)

## Instalação e Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

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

## Executando a Aplicação

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

## Arquitetura e Decisões de Design

Este projeto implementa uma arquitetura em camadas baseada em Domain-Driven Design (DDD) e Clean Architecture, garantindo separação de responsabilidades, testabilidade e manutenibilidade.

### Estrutura de Camadas

O projeto está organizado em quatro camadas principais:

```
src/
├── domain/              # Camada de Domínio - Lógica de negócio pura
│   ├── entities/        # Entidades do domínio com regras de negócio
│   ├── value-objects/   # Objetos de valor imutáveis
│   ├── exceptions/      # Exceções específicas do domínio
│   └── repositories/    # Interfaces dos repositórios (contratos)
├── application/         # Camada de Aplicação - Casos de uso
│   ├── use-cases/       # Implementação dos casos de uso
│   └── dto/             # Data Transfer Objects para entrada/saída
├── infrastructure/      # Camada de Infraestrutura - Detalhes técnicos
│   ├── database/        # Implementações de persistência
│   │   ├── drizzle/     # Schema e migrations do Drizzle
│   │   ├── mappers/     # Conversão entre domain entities e database models
│   │   └── repositories/ # Implementações concretas dos repositórios
│   └── http/            # Controllers e módulos HTTP
└── shared/              # Código compartilhado entre camadas
    ├── constants/       # Tokens de injeção de dependência
    ├── exceptions/      # Exceções compartilhadas
    └── types/           # Tipos utilitários (Result, Either)
```

### Decisões Arquiteturais

#### 1. Domain-Driven Design (DDD)

**Por que DDD?**
- Separação clara entre lógica de negócio e detalhes técnicos
- Facilita a comunicação entre desenvolvedores e stakeholders através de linguagem ubíqua
- Entidades ricas que encapsulam regras de negócio, não apenas dados

**Implementação:**
- **Entities**: A entidade `Local` encapsula todas as regras de negócio relacionadas a locais (validação de nome, descrição, coordenadas, etc.)
- **Value Objects**: Objetos imutáveis como `Coordinates`, `ImageUrl` e `LocalId` garantem invariantes do domínio
- **Repository Pattern**: Interfaces no domínio (`ILocaisRepository`) definem contratos, enquanto implementações ficam na infraestrutura

#### 2. Clean Architecture

**Por que Clean Architecture?**
- Independência de frameworks: o domínio não conhece NestJS, Drizzle ou PostgreSQL
- Testabilidade: fácil testar lógica de negócio sem dependências externas
- Flexibilidade: trocar banco de dados ou framework sem impactar o domínio

**Fluxo de Dependências:**
```
Infrastructure → Application → Domain
```

A camada de domínio não depende de nenhuma outra camada, garantindo que regras de negócio permaneçam puras e testáveis.

#### 3. Result Pattern (Functional Error Handling)

**Por que Result Pattern?**
- Tratamento explícito de erros sem exceções não tratadas
- Type-safety: TypeScript força o tratamento de casos de erro
- Código mais previsível e fácil de rastrear

**Implementação:**
Todas as operações que podem falhar retornam `Result<T>`, que pode ser `success(value)` ou `failure(error)`. Isso força o desenvolvedor a tratar erros explicitamente.

#### 4. Mapper Pattern

**Por que Mappers?**
- Separação entre modelos de domínio e modelos de persistência
- Domínio não conhece detalhes do banco de dados
- Facilita mudanças no schema sem impactar o domínio

**Implementação:**
A classe `LocalMapper` converte entre `Local` (entidade de domínio) e `LocalDbModel` (modelo do banco). Isso permite que o domínio use tipos próprios (como `LocalId`, `Coordinates`) enquanto o banco usa tipos primitivos.

#### 5. Dependency Injection

**Por que DI?**
- Inversão de controle: dependências são injetadas, não criadas
- Facilita testes: fácil mockar dependências
- Baixo acoplamento entre componentes

**Implementação:**
Uso do sistema de DI do NestJS com tokens customizados (`LOCAIS_REPOSITORY`) para injetar implementações de repositórios nos casos de uso.

#### 6. Use Cases (Application Layer)

**Por que Use Cases?**
- Um caso de uso por operação de negócio
- Orquestração clara: casos de uso coordenam entidades e repositórios
- Fácil de testar e entender o fluxo da aplicação

**Implementação:**
Cada operação (criar, buscar, atualizar, deletar) tem seu próprio caso de uso, que:
1. Recebe um DTO validado
2. Cria/reconstrói entidades do domínio
3. Chama o repositório
4. Retorna um DTO de resposta

#### 7. Value Objects

**Por que Value Objects?**
- Encapsulamento de invariantes (ex: coordenadas válidas, URLs válidas)
- Reutilização de lógica (ex: cálculo de distância entre coordenadas)
- Type-safety: não é possível criar um `Coordinates` inválido

**Implementação:**
- `Coordinates`: valida latitude (-90 a 90) e longitude (-180 a 180), calcula distâncias
- `ImageUrl`: valida formato de URL
- `LocalId`: encapsula UUID com validação

#### 8. DTOs com Validação

**Por que DTOs?**
- Validação na camada de entrada (HTTP)
- Contratos claros de API
- Transformação de dados entre camadas

**Implementação:**
DTOs usam `class-validator` para validação automática via `ValidationPipe` do NestJS, garantindo que apenas dados válidos cheguem aos casos de uso.

### Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe tem uma única responsabilidade (entidade, caso de uso, repositório, mapper)
- **Open/Closed**: Fácil estender funcionalidades sem modificar código existente (novos casos de uso, novos repositórios)
- **Liskov Substitution**: Implementações de repositórios são intercambiáveis
- **Interface Segregation**: Interfaces específicas (`ILocaisRepository`) ao invés de interfaces genéricas
- **Dependency Inversion**: Dependências de abstrações (interfaces) ao invés de implementações concretas

### Benefícios da Arquitetura

1. **Testabilidade**: Domínio testável sem mocks complexos
2. **Manutenibilidade**: Mudanças isoladas em camadas específicas
3. **Escalabilidade**: Fácil adicionar novos casos de uso e funcionalidades
4. **Clareza**: Estrutura clara facilita onboarding de novos desenvolvedores
5. **Flexibilidade**: Trocar tecnologias (ORM, banco, framework) sem impactar o domínio

## API Endpoints

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

## Database

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

## Testes

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

## Deploy

### Deploy no Render.com

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
   - **Build Command**: `pnpm install && pnpm run build`
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
   - Compilar o TypeScript
   - Iniciar o servidor

**Nota**: Execute as migrations manualmente após o primeiro deploy:

```bash
pnpm db:migrate
```

#### Troubleshooting no Render

**Erro de conexão com o banco:**
- Verifique se a `DATABASE_URL` está usando a **Internal Database URL**, não a External
- Aguarde alguns minutos após criar o database antes de fazer deploy

**Migrations não rodaram:**
- Execute manualmente: `pnpm db:migrate` localmente apontando para o banco do Render

**Servidor não inicia:**
- Verifique se todas as variáveis de ambiente estão configuradas
- Confira os logs em "Logs" no dashboard do Render

## Validações

### DTOs
Validação de formato e tipos com `class-validator` na camada de aplicação.

### Domain Entities
Validação de regras de negócio na camada de domínio:
  - Latitude: -90 a 90
  - Longitude: -180 a 180
  - URL válida para imagem
- Nome obrigatório (mínimo 3 caracteres, máximo 100)
- Descrição obrigatória (máximo 500 caracteres)

## CORS

Configurado para aceitar requisições de:
- `http://localhost:3000` (desenvolvimento)
- URL configurada em `FRONTEND_URL_PRODUCTION`

## Documentação Adicional

- [CLAUDE.md](./CLAUDE.md) - Guia completo da arquitetura para Claude Code
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

## Licença

UNLICENSED - Projeto de desafio técnico
