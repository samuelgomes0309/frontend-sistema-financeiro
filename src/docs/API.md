# 📡 API Documentation - Sistema Financeiro

## 📌 Informações Gerais

- **Base URL**: `http://localhost:3333`
- **Formato de Resposta**: JSON
- **Autenticação**: JWT (JSON Web Token)
- **Headers Comuns**:
  ```
  Content-Type: application/json
  Authorization: Bearer <token> (para rotas protegidas)
  ```

---

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via **JWT Token**. Após o login, inclua o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👤 Endpoints de Usuários

### 1. Criar Usuário (Sign Up)

Cadastra um novo usuário no sistema.

**Endpoint**: `POST /users/signup`  
**Autenticação**: ❌ Não requerida

#### Request Body:

```json
{
	"name": "João Silva",
	"email": "joao@example.com",
	"password": "senha123",
	"balance": 1000.0
}
```

#### Campos:

| Campo      | Tipo   | Obrigatório | Descrição                  |
| ---------- | ------ | ----------- | -------------------------- |
| `name`     | String | ✅          | Nome completo do usuário   |
| `email`    | String | ✅          | Email único para login     |
| `password` | String | ✅          | Senha (será criptografada) |
| `balance`  | Number | ✅          | Saldo inicial do usuário   |

#### Response (201 Created):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"name": "João Silva",
	"email": "joao@example.com",
	"balance": 1000.0
}
```

#### Erros Possíveis:

- `400 Bad Request`: "Email incorrect" (email não fornecido)
- `400 Bad Request`: "Email already registered" (email já cadastrado)

---

### 2. Login (Autenticar Usuário)

Autentica um usuário e retorna um token JWT.

**Endpoint**: `POST /users/session`  
**Autenticação**: ❌ Não requerida

#### Request Body:

```json
{
	"email": "joao@example.com",
	"password": "senha123"
}
```

#### Campos:

| Campo      | Tipo   | Obrigatório | Descrição        |
| ---------- | ------ | ----------- | ---------------- |
| `email`    | String | ✅          | Email cadastrado |
| `password` | String | ✅          | Senha do usuário |

#### Response (200 OK):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"name": "João Silva",
	"email": "joao@example.com",
	"balance": 1000.0,
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm_Do28gU2lsdmEiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MTY4MjU5MjAwMCwic3ViIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIn0.abc123..."
}
```

#### Token JWT:

- **Validade**: 30 dias
- **Payload**: `name`, `email`
- **Subject**: `user_id`

#### Erros Possíveis:

- `400 Bad Request`: "Email or password incorrect" (credenciais inválidas)

---

### 3. Detalhes do Usuário Autenticado

Retorna informações do usuário autenticado.

**Endpoint**: `GET /users/me`  
**Autenticação**: ✅ Requerida

#### Request Headers:

```
Authorization: Bearer <token>
```

#### Response (200 OK):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"name": "João Silva",
	"email": "joao@example.com",
	"balance": 1500.75
}
```

#### Erros Possíveis:

- `401 Unauthorized`: Token inválido ou não fornecido
- `400 Bad Request`: "Not Authorized" (usuário não encontrado)

---

### 4. Consultar Saldo e Transações

Retorna o saldo atual e todas as transações (receitas e despesas) de um período específico.

**Endpoint**: `GET /users/balance`  
**Autenticação**: ✅ Requerida

#### Request Headers:

```
Authorization: Bearer <token>
```

#### Query Parameters:

| Parâmetro | Tipo   | Obrigatório | Descrição                  | Exemplo   |
| --------- | ------ | ----------- | -------------------------- | --------- |
| `date`    | String | ✅          | Período no formato YYYY-MM | `2026-03` |

#### Exemplo de Request:

```
GET /users/balance?date=2026-03
Authorization: Bearer <token>
```

#### Response (200 OK):

```json
{
	"balance": 1500.75,
	"revenue": {
		"total": 3000.0,
		"items": [
			{
				"id": "trans-001",
				"description": "Salário Março",
				"value": 3000.0,
				"type": "revenue",
				"date": "2026-03",
				"user_id": "550e8400-e29b-41d4-a716-446655440000"
			}
		]
	},
	"expense": {
		"total": 1499.25,
		"items": [
			{
				"id": "trans-002",
				"description": "Aluguel",
				"value": 800.0,
				"type": "expense",
				"date": "2026-03",
				"user_id": "550e8400-e29b-41d4-a716-446655440000"
			},
			{
				"id": "trans-003",
				"description": "Supermercado",
				"value": 699.25,
				"type": "expense",
				"date": "2026-03",
				"user_id": "550e8400-e29b-41d4-a716-446655440000"
			}
		]
	}
}
```

#### Estrutura da Resposta:

- `balance`: Saldo total atual do usuário
- `revenue.total`: Soma de todas as receitas do período
- `revenue.items`: Array com todas as transações de receita
- `expense.total`: Soma de todas as despesas do período
- `expense.items`: Array com todas as transações de despesa

#### Erros Possíveis:

- `401 Unauthorized`: Token inválido ou não fornecido
- `400 Bad Request`: "Not authorized" (user_id não fornecido)
- `400 Bad Request`: "Date Incorrect" (data não fornecida)

---

## 💰 Endpoints de Transações

### 5. Criar Transação

Cria uma nova transação (receita ou despesa) e atualiza o saldo automaticamente.

**Endpoint**: `POST /transaction/create`  
**Autenticação**: ✅ Requerida

#### Request Headers:

```
Authorization: Bearer <token>
```

#### Request Body:

```json
{
	"description": "Freelance - Desenvolvimento Web",
	"value": 1500.0,
	"type": "revenue",
	"date": "2026-03"
}
```

#### Campos:

| Campo         | Tipo   | Obrigatório | Descrição                     | Valores Aceitos      |
| ------------- | ------ | ----------- | ----------------------------- | -------------------- |
| `description` | String | ✅          | Descrição da transação        | Qualquer texto       |
| `value`       | Number | ✅          | Valor da transação (positivo) | > 0                  |
| `type`        | String | ✅          | Tipo da transação             | `revenue`, `expense` |
| `date`        | String | ✅          | Data no formato YYYY-MM       | Ex: `2026-03`        |

#### Tipos de Transação:

- **`revenue`** (Receita): Adiciona valor ao saldo
- **`expense`** (Despesa): Subtrai valor do saldo

#### Response (200 OK):

```json
{
	"id": "trans-004",
	"description": "Freelance - Desenvolvimento Web",
	"value": 1500.0,
	"type": "revenue",
	"date": "2026-03",
	"user_id": "550e8400-e29b-41d4-a716-446655440000",
	"createdAt": "2026-03-10T14:30:00.000Z",
	"updatedAt": "2026-03-10T14:30:00.000Z"
}
```

#### Efeitos Colaterais:

- **Receita**: `novo_saldo = saldo_atual + value`
- **Despesa**: `novo_saldo = saldo_atual - value`

#### Erros Possíveis:

- `401 Unauthorized`: Token inválido ou não fornecido
- `400 Bad Request`: "Not authorized" (user_id não fornecido)
- `400 Bad Request`: "Type or Value Incorrect" (campos obrigatórios não fornecidos)
- `400 Bad Request`: "The value cannot be negative" (valor negativo)
- `400 Bad Request`: "User not found" (usuário não existe)

---

### 6. Listar Transações

Lista todas as transações de um período específico para o usuário autenticado.

**Endpoint**: `GET /transactions`  
**Autenticação**: ✅ Requerida

#### Request Headers:

```
Authorization: Bearer <token>
```

#### Query Parameters:

| Parâmetro | Tipo   | Obrigatório | Descrição                  | Exemplo   |
| --------- | ------ | ----------- | -------------------------- | --------- |
| `date`    | String | ✅          | Período no formato YYYY-MM | `2026-03` |

#### Exemplo de Request:

```
GET /transactions?date=2026-03
Authorization: Bearer <token>
```

#### Response (200 OK):

```json
[
	{
		"id": "trans-004",
		"description": "Freelance - Desenvolvimento Web",
		"value": 1500.0,
		"type": "revenue",
		"date": "2026-03",
		"user_id": "550e8400-e29b-41d4-a716-446655440000"
	},
	{
		"id": "trans-002",
		"description": "Aluguel",
		"value": 800.0,
		"type": "expense",
		"date": "2026-03",
		"user_id": "550e8400-e29b-41d4-a716-446655440000"
	}
]
```

#### Ordenação:

- As transações são retornadas ordenadas por `createdAt DESC` (mais recentes primeiro)

#### Erros Possíveis:

- `401 Unauthorized`: Token inválido ou não fornecido
- `400 Bad Request`: "Not authorized" (user_id não fornecido)
- `400 Bad Request`: "Date Incorrect" (data não fornecida)
- `400 Bad Request`: "User not found" (usuário não existe)

---

### 7. Deletar Transação

Deleta uma transação específica e reverte o valor do saldo automaticamente.

**Endpoint**: `DELETE /transaction/delete`  
**Autenticação**: ✅ Requerida

#### Request Headers:

```
Authorization: Bearer <token>
```

#### Query Parameters:

| Parâmetro | Tipo   | Obrigatório | Descrição                      | Exemplo     |
| --------- | ------ | ----------- | ------------------------------ | ----------- |
| `item_id` | String | ✅          | ID da transação a ser deletada | `trans-004` |

#### Exemplo de Request:

```
DELETE /transaction/delete?item_id=trans-004
Authorization: Bearer <token>
```

#### Response (200 OK):

```json
{
	"message": "Transação deletada com sucesso!",
	"transactionDeleted": {
		"id": "trans-004",
		"description": "Freelance - Desenvolvimento Web",
		"value": 1500.0,
		"type": "revenue",
		"date": "2026-03",
		"user_id": "550e8400-e29b-41d4-a716-446655440000",
		"createdAt": "2026-03-10T14:30:00.000Z",
		"updatedAt": "2026-03-10T14:30:00.000Z"
	}
}
```

#### Efeitos Colaterais:

- **Despesa deletada**: `novo_saldo = saldo_atual + value` (estorna)
- **Receita deletada**: `novo_saldo = saldo_atual - value` (estorna)

#### Validações:

- ✅ Apenas o dono pode deletar a transação
- ✅ Transação deve existir

#### Erros Possíveis:

- `401 Unauthorized`: Token inválido ou não fornecido
- `400 Bad Request`: "Not authorized" (user_id não fornecido)
- `400 Bad Request`: "Item_id not informed" (item_id não fornecido)
- `400 Bad Request`: "User not found" (usuário não existe)
- `400 Bad Request`: "Transaction not found or does not belong to the user!"

---

## 📊 Resumo de Endpoints

| Rota                  | Método | Auth | Descrição                              |
| --------------------- | ------ | ---- | -------------------------------------- |
| `/users/signup`       | POST   | ❌   | Criar novo usuário                     |
| `/users/session`      | POST   | ❌   | Login e obter token JWT                |
| `/users/me`           | GET    | ✅   | Detalhes do usuário autenticado        |
| `/users/balance`      | GET    | ✅   | Saldo e transações agrupadas por tipo  |
| `/transaction/create` | POST   | ✅   | Criar nova transação (receita/despesa) |
| `/transactions`       | GET    | ✅   | Listar transações de um período        |
| `/transaction/delete` | DELETE | ✅   | Deletar transação específica           |

---

## 🧪 Exemplos de Uso (cURL)

### Criar Usuário:

```bash
curl -X POST http://localhost:3333/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "balance": 1000.00
  }'
```

### Login:

```bash
curl -X POST http://localhost:3333/users/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar Transação (Receita):

```bash
curl -X POST http://localhost:3333/transaction/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "description": "Salário",
    "value": 3000.00,
    "type": "revenue",
    "date": "2026-03"
  }'
```

### Listar Transações:

```bash
curl -X GET "http://localhost:3333/transactions?date=2026-03" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Consultar Saldo:

```bash
curl -X GET "http://localhost:3333/users/balance?date=2026-03" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Deletar Transação:

```bash
curl -X DELETE "http://localhost:3333/transaction/delete?item_id=TRANSACTION_ID" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## ⚠️ Códigos de Status HTTP

| Código | Significado           | Quando Ocorre                                 |
| ------ | --------------------- | --------------------------------------------- |
| `200`  | OK                    | Requisição bem-sucedida                       |
| `201`  | Created               | Recurso criado com sucesso                    |
| `400`  | Bad Request           | Dados inválidos ou regra de negócio violada   |
| `401`  | Unauthorized          | Token JWT inválido, expirado ou não fornecido |
| `500`  | Internal Server Error | Erro inesperado no servidor                   |

---

## 🔒 Considerações de Segurança

### Headers de Autenticação:

- Sempre envie o token no formato: `Bearer <token>`
- Tokens expiram após 30 dias
- Após expiração, faça login novamente para obter novo token

### Validações de Propriedade:

- Usuários só podem:
  - Ver suas próprias transações
  - Criar transações em sua própria conta
  - Deletar apenas suas próprias transações

### Dados Sensíveis:

- Senhas nunca são retornadas pela API
- Tokens devem ser armazenados de forma segura no cliente (nunca em localStorage sem criptografia)

---

## 📝 Formato de Data

O sistema usa o formato **YYYY-MM** (ano-mês) para agrupar transações:

- ✅ Correto: `2026-03`, `2025-12`, `2024-01`
- ❌ Incorreto: `03-2026`, `2026/03`, `2026-3`

Isso permite que transações sejam agrupadas e consultadas por mês.

---

## 🐛 Tratamento de Erros

Todas as respostas de erro seguem o padrão:

```json
{
	"error": "Mensagem descritiva do erro"
}
```

### Mensagens de Erro Comuns:

| Mensagem                                               | Causa Provável                                  |
| ------------------------------------------------------ | ----------------------------------------------- |
| "Email or password incorrect"                          | Credenciais de login inválidas                  |
| "Email already registered"                             | Email já existe durante signup                  |
| "Not authorized"                                       | Token inválido ou usuário não encontrado        |
| "Type or Value Incorrect"                              | Campos obrigatórios não fornecidos na transação |
| "The value cannot be negative"                         | Valor da transação é negativo                   |
| "Transaction not found or does not belong to the user" | Tentativa de deletar transação de outro usuário |
| "Date Incorrect"                                       | Data não fornecida ou formato inválido          |

---

**Documentação gerada em:** Março 2026  
**Versão da API:** 1.0.0  
**Contato:** [Adicionar informações de contato do projeto]
