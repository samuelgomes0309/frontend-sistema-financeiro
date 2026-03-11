# 📚 Contexto do Projeto - Sistema Financeiro Backend

## 📋 Visão Geral

Este é o backend de um **Sistema Financeiro Pessoal** desenvolvido para gerenciar usuários, autenticação, transações financeiras (receitas e despesas) e cálculo de saldo. A aplicação foi construída seguindo os princípios de uma API RESTful, com validações de negócio e segurança através de autenticação JWT.

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma **arquitetura em camadas** (Layered Architecture) com separação clara de responsabilidades:

```
src/
├── server.ts              # Ponto de entrada da aplicação
├── routes.ts              # Definição de todas as rotas da API
├── @types/                # Definições de tipos TypeScript personalizados
│   └── express/
│       └── index.d.ts     # Extensão de tipos do Express (user_id no Request)
├── controllers/           # Camada de controle (recebe requisições HTTP)
│   ├── user/             # Controllers de usuários
│   └── transaction/      # Controllers de transações
├── services/             # Camada de negócio (lógica da aplicação)
│   ├── user/            # Services de usuários
│   └── transaction/     # Services de transações
├── middlewares/         # Middlewares personalizados
│   └── isAuthenticated.ts  # Validação de autenticação JWT
├── prisma/              # Cliente Prisma ORM
│   └── index.ts         # Instância singleton do PrismaClient
└── generated/           # Arquivos gerados pelo Prisma Client
    └── prisma/          # Cliente Prisma customizado
```

---

## 🎯 Fluxo de Requisições

```
Cliente → Rota (routes.ts) → Middleware (opcional) → Controller → Service → Prisma ORM → PostgreSQL
                                                                              ↓
                              ← JSON Response ← Controller ← Service Result ←
```

### Detalhamento do Fluxo:

1. **Cliente** envia uma requisição HTTP (GET, POST, DELETE)
2. **Rota** (`routes.ts`) identifica o endpoint e encaminha para o controller correspondente
3. **Middleware** (`isAuthenticated`) valida o token JWT (se a rota for protegida)
4. **Controller** recebe a requisição, extrai os dados e chama o service
5. **Service** contém a lógica de negócio, validações e interage com o banco via Prisma
6. **Prisma ORM** executa as queries no banco de dados PostgreSQL
7. **Resposta** retorna no sentido inverso até o cliente

---

## 🗄️ Modelo de Dados (Banco de Dados)

### Tabela: `users`

Armazena informações dos usuários do sistema.

| Campo       | Tipo     | Descrição                    | Constraints          |
| ----------- | -------- | ---------------------------- | -------------------- |
| `id`        | String   | Identificador único (UUID)   | Primary Key, Default |
| `name`      | String   | Nome do usuário              | NOT NULL             |
| `email`     | String   | Email para autenticação      | UNIQUE, NOT NULL     |
| `password`  | String   | Senha criptografada (bcrypt) | NOT NULL             |
| `balance`   | Float    | Saldo atual do usuário       | NOT NULL             |
| `createAt`  | DateTime | Data de criação do registro  | Default: now()       |
| `updatedAt` | DateTime | Data de última atualização   | Default: now()       |

### Tabela: `transactions`

Armazena todas as transações financeiras dos usuários.

| Campo         | Tipo     | Descrição                                        | Constraints          |
| ------------- | -------- | ------------------------------------------------ | -------------------- |
| `id`          | String   | Identificador único (UUID)                       | Primary Key, Default |
| `description` | String   | Descrição da transação                           | NOT NULL             |
| `value`       | Float    | Valor da transação                               | NOT NULL             |
| `type`        | String   | Tipo: "revenue" (receita) ou "expense" (despesa) | NOT NULL             |
| `user_id`     | String   | ID do usuário (Foreign Key)                      | NOT NULL             |
| `date`        | String   | Data da transação (formato: YYYY-MM)             | NOT NULL             |
| `createdAt`   | DateTime | Data de criação do registro                      | Default: now()       |
| `updatedAt`   | DateTime | Data de última atualização                       | Default: now()       |

### Relacionamentos:

- **User → Transactions**: Um usuário pode ter várias transações (1:N)
- **Transaction → User**: Uma transação pertence a um único usuário

---

## 🔐 Segurança e Autenticação

### Autenticação JWT (JSON Web Token)

O sistema utiliza **JWT** para autenticação stateless. O fluxo funciona da seguinte forma:

1. **Login** (`/users/session`):
   - Usuário envia email e senha
   - Sistema valida credenciais (comparação bcrypt)
   - Se válido, gera um token JWT assinado com `JWT_SECRET`
   - Token tem validade de **30 dias**
   - Token contém: `name`, `email` (payload) e `user_id` (subject)

2. **Rotas Protegidas**:
   - Cliente deve enviar o token no header: `Authorization: Bearer <token>`
   - Middleware `isAuthenticated` valida o token
   - Se válido, extrai o `user_id` e adiciona ao objeto `req`
   - Controller acessa `req.user_id` para identificar o usuário

### Criptografia de Senhas

- Todas as senhas são criptografadas usando **bcryptjs** com salt rounds = 8
- Senhas nunca são armazenadas em texto plano no banco de dados
- Comparação de senhas é feita de forma segura via `bcrypt.compare()`

---

## 💼 Lógica de Negócio

### Gestão de Saldo (`balance`)

O saldo do usuário é **calculado e atualizado automaticamente** a cada transação:

#### Criação de Transação:

```
Se tipo = "revenue" (receita):
  novo_saldo = saldo_atual + valor

Se tipo = "expense" (despesa):
  novo_saldo = saldo_atual - valor
```

#### Exclusão de Transação:

```
Se tipo = "expense" (despesa deletada):
  novo_saldo = saldo_atual + valor  (estorna a despesa)

Se tipo = "revenue" (receita deletada):
  novo_saldo = saldo_atual - valor  (estorna a receita)
```

**Importante**: As operações de criação/exclusão de transação e atualização de saldo são feitas em uma **transação atômica do Prisma** (`$transaction`), garantindo consistência dos dados.

### Validações Implementadas

#### Usuário:

- ✅ Email obrigatório e único no sistema
- ✅ Senha obrigatória (criptografada antes de salvar)
- ✅ Verificação de existência antes de operações

#### Transação:

- ✅ Usuário autenticado (via JWT)
- ✅ Tipo obrigatório ("revenue" ou "expense")
- ✅ Valor obrigatório e não pode ser negativo
- ✅ Data obrigatória (formato: YYYY-MM)
- ✅ Transação só pode ser deletada pelo próprio usuário que a criou

---

## 🛠️ Tecnologias e Bibliotecas

### Core:

- **Node.js**: Runtime JavaScript
- **TypeScript**: Superset JavaScript com tipagem estática
- **Express**: Framework web minimalista
- **Prisma ORM**: ORM moderno para TypeScript/Node.js

### Segurança:

- **jsonwebtoken**: Geração e validação de tokens JWT
- **bcryptjs**: Hash e validação de senhas
- **cors**: Controle de Cross-Origin Resource Sharing

### Desenvolvimento:

- **ts-node-dev**: Execução de TypeScript com hot-reload
- **express-async-errors**: Tratamento automático de erros assíncronos
- **dotenv**: Gerenciamento de variáveis de ambiente

### Banco de Dados:

- **PostgreSQL**: Banco de dados relacional

---

## 📦 Estrutura de Respostas da API

### Resposta de Sucesso:

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  ...
}
```

### Resposta de Erro:

```json
{
	"error": "Mensagem de erro descritiva"
}
```

**Status HTTP utilizados:**

- `200`: Sucesso (GET, DELETE)
- `400`: Erro de validação ou regra de negócio
- `401`: Não autenticado ou token inválido
- `500`: Erro interno do servidor

---

## 🔄 Transações do Prisma

O projeto utiliza **transações atômicas** do Prisma em operações críticas:

### Exemplo - Criar Transação:

```typescript
const [transaction, updatedUser] = await prismaClient.$transaction([
  prismaClient.transactions.create({ ... }),
  prismaClient.user.update({ ... })
]);
```

Isso garante que **ambas as operações** (criar transação + atualizar saldo) sejam executadas com sucesso ou ambas falhem, mantendo a consistência dos dados.

---

## 📊 Métricas e Consultas Otimizadas

### Consulta de Balanço (`/users/balance`):

Retorna um objeto estruturado com:

- **Saldo total** do usuário
- **Receitas** do período (total + lista de transações)
- **Despesas** do período (total + lista de transações)

Todas as transações são filtradas por:

- `user_id` (usuário autenticado)
- `date` (formato YYYY-MM)
- `type` (revenue/expense)

Ordenação: `createdAt DESC` (mais recentes primeiro)

---

## 🚀 Inicialização da Aplicação

### Servidor (`server.ts`):

1. Configura Express para aceitar JSON
2. Habilita CORS para todos os domínios
3. Registra todas as rotas
4. Adiciona middleware de tratamento de erros global
5. Inicia servidor na porta **3333**

### Prisma Client (`prisma/index.ts`):

- Carrega variáveis de ambiente via `dotenv/config`
- Instancia `PrismaClient` customizado (gerado em `src/generated/prisma`)
- Exporta instância singleton para uso em todos os services

---

## 🎓 Conceitos Aplicados

### Padrões de Projeto:

- **Repository Pattern**: Prisma atua como camada de acesso a dados
- **Service Layer Pattern**: Lógica de negócio isolada em services
- **Controller Pattern**: Controllers atuam apenas como intermediários HTTP
- **Singleton Pattern**: Uma única instância do PrismaClient

### Princípios SOLID:

- **Single Responsibility**: Cada classe/módulo tem uma única responsabilidade
- **Dependency Inversion**: Controllers dependem de abstrações (services)

### Boas Práticas:

- Validações no início dos métodos (fail fast)
- Mensagens de erro descritivas para o cliente
- Operações de banco em transações quando necessário
- Separação de concerns (camadas bem definidas)
- Uso de TypeScript para type safety

---

## 📝 Notas Importantes

### Formato de Data:

- Todas as transações usam o formato **YYYY-MM** (ex: "2026-03")
- Isso permite agrupar transações por mês e ano
- O campo `date` é do tipo `String` no banco

### Relacionamento User-Transaction:

- Ao buscar transações, o Prisma automaticamente valida se `user_id` existe
- Uso de `connect` para criar relacionamentos de forma segura

### Extensão de Tipos:

- Arquivo `@types/express/index.d.ts` estende o tipo `Request` do Express
- Adiciona a propriedade `user_id` para uso após autenticação
- Necessário para TypeScript reconhecer `req.user_id`

---

## 🔮 Possíveis Melhorias Futuras

- [ ] Implementar paginação na listagem de transações
- [ ] Adicionar filtros avançados (por tipo, valor mínimo/máximo)
- [ ] Implementar categorias para transações
- [ ] Criar dashboard com gráficos de receitas/despesas
- [ ] Adicionar testes automatizados (unit e integration tests)
- [ ] Implementar rate limiting para proteção contra ataques
- [ ] Adicionar logs estruturados para monitoramento
- [ ] Migrar para variável de ambiente para a porta do servidor

---

**Documentação gerada em:** {{ date }}  
**Versão:** 1.0.0  
**Autor:** Sistema de Documentação Automática
