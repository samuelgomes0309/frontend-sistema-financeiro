# 🔌 Documentação de Endpoints - Sistema Financeiro

Esta documentação lista todos os endpoints da API utilizados pelo frontend e como eles são consumidos.

---

## 📑 Índice

- [Configuração da API](#configuração-da-api)
- [Endpoints de Autenticação](#endpoints-de-autenticação)
- [Endpoints de Usuário](#endpoints-de-usuário)
- [Endpoints de Transações](#endpoints-de-transações)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos de Uso](#exemplos-de-uso)

---

## ⚙️ Configuração da API

### Instância do Axios

**Localização:** `src/api/api.ts`

```typescript
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

export { api };
```

### Variáveis de Ambiente

Configure a URL base da API no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3333
```

### Autenticação

Após o login, o token JWT é configurado globalmente:

```typescript
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

Todos os endpoints protegidos recebem automaticamente este header.

---

## 🔐 Endpoints de Autenticação

### 1. Criar Conta (Sign Up)

**Endpoint:** `POST /users/signup`

**Descrição:** Cria uma nova conta de usuário no sistema.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
	"name": "João Silva",
	"email": "joao@exemplo.com",
	"password": "senha123"
}
```

**Resposta de Sucesso (201):**

```json
{
	"message": "Usuário criado com sucesso"
}
```

**Erros Possíveis:**

- `400` - Dados inválidos
- `409` - Email já cadastrado

**Onde é usado:**

- `src/contexts/authContext.tsx` - Função `handleSignUp()`

**Exemplo de código:**

```typescript
async function handleSignUp(data: SignUpData) {
	try {
		await api.post("/users/signup", data);
		toast.success("Conta criada com sucesso!");
		// Login automático após cadastro
		const login = { email: data.email, password: data.password };
		const responseLogin = await handleLogin(login);
		if (!responseLogin) {
			return false;
		}
		return true;
	} catch (error: any) {
		toast.error("Erro ao tentar fazer o cadastro", error?.message);
		return false;
	}
}
```

---

### 2. Fazer Login (Sign In)

**Endpoint:** `POST /users/session`

**Descrição:** Autentica um usuário e retorna um token JWT.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
	"email": "joao@exemplo.com",
	"password": "senha123"
}
```

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-usuario",
	"name": "João Silva",
	"email": "joao@exemplo.com",
	"balance": 5000.0,
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros Possíveis:**

- `400` - Dados inválidos
- `401` - Credenciais incorretas
- `404` - Usuário não encontrado

**Onde é usado:**

- `src/contexts/authContext.tsx` - Função `handleLogin()`

**Exemplo de código:**

```typescript
async function handleLogin(data: SignInData) {
	try {
		const response = await api.post("/users/session", data);
		const { balance, email, id, name, token } =
			response.data as UserPropsRequest;

		setUser({
			balance: balance,
			email: email,
			name: name,
			user_id: id,
		});

		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		handleUserLocalStorage(token);
		return true;
	} catch (error: any) {
		toast.error("Erro ao tentar fazer o login", error?.message);
		return false;
	}
}
```

---

## 👤 Endpoints de Usuário

### 3. Buscar Dados do Usuário

**Endpoint:** `GET /users/me`

**Descrição:** Retorna os dados do usuário autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-usuario",
	"name": "João Silva",
	"email": "joao@exemplo.com",
	"balance": 5000.0
}
```

**Erros Possíveis:**

- `401` - Token inválido ou expirado
- `404` - Usuário não encontrado

**Onde é usado:**

- `src/contexts/authContext.tsx` - Função `validateUser()`

**Exemplo de código:**

```typescript
async function validateUser() {
	const token = localStorage.getItem("@financeT") || null;
	if (!token) {
		setUser(null);
		setLoadingAuth(false);
		return;
	}

	try {
		const response = await api.get<UserPropsRequest>("/users/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { balance, email, name, id } = response.data;
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		setUser({
			balance,
			email,
			name,
			user_id: id,
		});
	} catch (error) {
		console.log(error);
	} finally {
		setLoadingAuth(false);
	}
}
```

---

### 4. Buscar Saldo do Usuário

**Endpoint:** `GET /users/balance`

**Descrição:** Retorna o saldo total, receitas e despesas do usuário para uma data específica.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `date` (opcional) - Data no formato `dd/mm/aaaa`  
  Exemplo: `10/03/2026`

**URL Completa:**

```
GET /users/balance?date=10/03/2026
```

**Resposta de Sucesso (200):**

```json
{
	"balance": 5000.0,
	"revenue": {
		"items": [],
		"total": 8000.0
	},
	"expense": {
		"items": [],
		"total": 3000.0
	}
}
```

**Erros Possíveis:**

- `401` - Token inválido ou expirado
- `400` - Data em formato inválido

**Onde é usado:**

- `src/pages/dashboard/index.tsx` - Função `handleSearchBalance()`

**Exemplo de código:**

```typescript
async function handleSearchBalance(paramDate?: string) {
	try {
		const response = await api.get<BalanceData>("/users/balance", {
			params: {
				date: paramDate || new Date().toLocaleDateString("pt-br"),
			},
		});
		setBalance(response?.data);
	} catch (error: any) {
		console.log(error?.message);
	}
}
```

---

## 💰 Endpoints de Transações

### 5. Listar Transações

**Endpoint:** `GET /transactions`

**Descrição:** Retorna todas as transações do usuário para uma data específica.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `date` (opcional) - Data no formato `dd/mm/aaaa`  
  Exemplo: `10/03/2026`

**URL Completa:**

```
GET /transactions?date=10/03/2026
```

**Resposta de Sucesso (200):**

```json
[
	{
		"id": "uuid-da-transacao",
		"type": "revenue",
		"date": "10/03/2026",
		"description": "Salário",
		"user_id": "uuid-do-usuario",
		"value": 5000.0
	},
	{
		"id": "uuid-da-transacao-2",
		"type": "expense",
		"date": "10/03/2026",
		"description": "Aluguel",
		"user_id": "uuid-do-usuario",
		"value": 1500.0
	}
]
```

**Resposta Vazia:**

```json
[]
```

**Erros Possíveis:**

- `401` - Token inválido ou expirado
- `400` - Data em formato inválido

**Onde é usado:**

- `src/pages/dashboard/index.tsx` - Função `handleSearchTransactions()`

**Exemplo de código:**

```typescript
async function handleSearchTransactions(paramDate?: string) {
	try {
		const response = await api.get<TransactionItemProps[]>("/transactions", {
			params: {
				date: paramDate || date,
			},
		});

		if (response.data.length <= 0) {
			setTransactions([]);
			return;
		}

		setTransactions(response.data);
	} catch (error: any) {
		console.log(error?.message);
	}
}
```

---

### 6. Criar Transação

**Endpoint:** `POST /transaction/create`

**Descrição:** Cria uma nova transação (receita ou despesa).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
	"type": "revenue",
	"description": "Salário",
	"value": 5000.0,
	"date": "10/03/2026"
}
```

**Campos:**

- `type` - Tipo da transação: `"revenue"` (receita) ou `"expense"` (despesa)
- `description` - Descrição da transação (string)
- `value` - Valor da transação (number)
- `date` - Data da transação no formato `dd/mm/aaaa`

**Resposta de Sucesso (201):**

```json
{
	"message": "Transação criada com sucesso",
	"transaction": {
		"id": "uuid-da-transacao",
		"type": "revenue",
		"description": "Salário",
		"value": 5000.0,
		"date": "10/03/2026",
		"user_id": "uuid-do-usuario"
	}
}
```

**Erros Possíveis:**

- `400` - Dados inválidos
- `401` - Token inválido ou expirado

**Onde é usado:**

- `src/pages/register/index.tsx` - Função `submit()`

**Exemplo de código:**

```typescript
async function submit(data: RegisterFormInput) {
	try {
		// Convertendo o input para o output
		const finalData: RegisterFormOutput =
			await formRegisterSchema.parseAsync(data);
		const { description, type, value } = finalData;
		const date = new Date().toLocaleDateString("pt-br");

		await api.post("/transaction/create", {
			date,
			description,
			type,
			value,
		});

		toast.success("Registro criado com sucesso!");
		reset();
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			console.log(error.message);
			return;
		}
	}
}
```

---

### 7. Deletar Transação

**Endpoint:** `DELETE /transaction/delete`

**Descrição:** Deleta uma transação específica do usuário.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `item_id` (obrigatório) - ID da transação a ser deletada

**URL Completa:**

```
DELETE /transaction/delete?item_id=uuid-da-transacao
```

**Resposta de Sucesso (200):**

```json
{
	"message": "Transação deletada com sucesso"
}
```

**Erros Possíveis:**

- `400` - ID não fornecido
- `401` - Token inválido ou expirado
- `404` - Transação não encontrada
- `403` - Usuário não tem permissão para deletar esta transação

**Onde é usado:**

- `src/pages/dashboard/index.tsx` - Função `handleDeleteItem()`

**Exemplo de código:**

```typescript
async function handleDeleteItem(item_id: string) {
	if (!item_id) {
		toast.error("Id da transação não encontrado.");
	}

	try {
		await api.delete("/transaction/delete", {
			params: {
				item_id: item_id,
			},
		});

		// Atualiza os dados após deletar
		await handleSearchTransactions(date);
		await handleSearchBalance(date);
	} catch (error: any) {
		console.log(error?.message);
	}
}
```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erro da API

```json
{
	"error": "Mensagem de erro",
	"statusCode": 400,
	"details": {}
}
```

### Tratamento Recomendado

```typescript
import toast from "react-hot-toast";
import { AxiosError } from "axios";

try {
	const response = await api.get("/endpoint");
	// Sucesso
} catch (error) {
	if (error instanceof AxiosError) {
		// Erro da API
		const status = error.response?.status;
		const message = error.response?.data?.error || "Erro desconhecido";

		switch (status) {
			case 400:
				toast.error("Dados inválidos");
				break;
			case 401:
				toast.error("Sessão expirada. Faça login novamente.");
				// Redirecionar para login
				break;
			case 403:
				toast.error("Você não tem permissão para esta ação");
				break;
			case 404:
				toast.error("Recurso não encontrado");
				break;
			case 500:
				toast.error("Erro no servidor. Tente novamente mais tarde.");
				break;
			default:
				toast.error(message);
		}
	} else {
		// Erro de rede ou outro
		toast.error("Erro de conexão. Verifique sua internet.");
	}
}
```

### Interceptor Global de Erros (Opcional)

```typescript
// src/api/api.ts
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Interceptor para erros
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			toast.error("Sessão expirada. Faça login novamente.");
			localStorage.removeItem("@financeT");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export { api };
```

---

## 📊 Tipos TypeScript

### BalanceData

```typescript
interface BalanceData {
	balance: number;
	revenue: {
		items: [];
		total: number;
	};
	expense: {
		items: [];
		total: number;
	};
}
```

### TransactionItemProps

```typescript
interface TransactionItemProps {
	id: string;
	type: "revenue" | "expense";
	date: string;
	description: string;
	user_id: string;
	value: number;
}
```

### SignUpData

```typescript
interface SignUpData {
	name: string;
	email: string;
	password: string;
}
```

### SignInData

```typescript
interface SignInData {
	email: string;
	password: string;
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Carregar Dashboard Completo

```typescript
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import type { BalanceData, TransactionItemProps } from './index';

function Dashboard() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Buscar dados em paralelo
        const [balanceResponse, transactionsResponse] = await Promise.all([
          api.get<BalanceData>('/users/balance', {
            params: { date: new Date().toLocaleDateString('pt-br') }
          }),
          api.get<TransactionItemProps[]>('/transactions', {
            params: { date: new Date().toLocaleDateString('pt-br') }
          })
        ]);

        setBalance(balanceResponse.data);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div>
      <h1>Saldo: R$ {balance?.balance.toFixed(2)}</h1>
      <p>Receitas: R$ {balance?.revenue.total.toFixed(2)}</p>
      <p>Despesas: R$ {balance?.expense.total.toFixed(2)}</p>

      <h2>Transações</h2>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <span>{transaction.description}</span>
          <span>R$ {transaction.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Filtrar Transações por Data

```typescript
async function handleFilter(selectedDate: Date) {
	try {
		const dateString = selectedDate.toLocaleDateString("pt-br");

		const [balanceResponse, transactionsResponse] = await Promise.all([
			api.get<BalanceData>("/users/balance", {
				params: { date: dateString },
			}),
			api.get<TransactionItemProps[]>("/transactions", {
				params: { date: dateString },
			}),
		]);

		setBalance(balanceResponse.data);
		setTransactions(transactionsResponse.data);
		setCurrentDate(dateString);

		toast.success("Filtro aplicado com sucesso!");
	} catch (error) {
		toast.error("Erro ao filtrar transações");
		console.error(error);
	}
}
```

### Exemplo 3: Criar Transação com Validação

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['revenue', 'expense']),
  description: z.string().min(3, 'Descrição muito curta'),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido'),
});

type FormData = z.infer<typeof schema>;

function CreateTransaction() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await api.post('/transaction/create', {
        type: data.type,
        description: data.description,
        value: parseFloat(data.value),
        date: new Date().toLocaleDateString('pt-br'),
      });

      toast.success('Transação criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar transação');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('type')}>
        <option value="expense">Despesa</option>
        <option value="revenue">Receita</option>
      </select>

      <input {...register('description')} placeholder="Descrição" />
      {errors.description && <span>{errors.description.message}</span>}

      <input {...register('value')} placeholder="Valor" />
      {errors.value && <span>{errors.value.message}</span>}

      <button type="submit">Criar</button>
    </form>
  );
}
```

### Exemplo 4: Deletar com Confirmação

```typescript
async function handleDeleteWithConfirmation(transactionId: string) {
	// Confirmação do usuário
	const confirmed = window.confirm(
		"Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita."
	);

	if (!confirmed) return;

	try {
		await api.delete("/transaction/delete", {
			params: { item_id: transactionId },
		});

		toast.success("Transação deletada com sucesso!");

		// Recarregar dados
		await Promise.all([handleSearchTransactions(), handleSearchBalance()]);
	} catch (error) {
		toast.error("Erro ao deletar transação");
		console.error(error);
	}
}
```

---

## 🔐 Autenticação e Segurança

### Token JWT

- Armazenado em: `localStorage` com a chave `@financeT`
- Formato: `Bearer {token}`
- Enviado em: Header `Authorization` de todas as requisições protegidas

### Fluxo de Token

```typescript
// 1. Após login
const response = await api.post("/users/session", { email, password });
const { token } = response.data;

// 2. Salvar no localStorage
localStorage.setItem("@financeT", token);

// 3. Configurar globalmente
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// 4. Todas as próximas requisições incluem automaticamente o header
```

### Renovação de Token

Atualmente não há renovação automática. Quando o token expira:

1. A API retorna erro `401`
2. O usuário deve fazer login novamente

### Recomendações de Segurança

✅ Use HTTPS em produção  
✅ Implemente refresh token para melhor UX  
✅ Configure CORS adequadamente no backend  
✅ Valide todos os inputs no frontend e backend  
✅ Sanitize dados do usuário para prevenir XSS

---

## 📈 Performance

### Requisições Paralelas

Use `Promise.all()` para requisições independentes:

```typescript
const [balance, transactions] = await Promise.all([
	api.get("/users/balance"),
	api.get("/transactions"),
]);
```

### Debounce em Buscas

```typescript
import { debounce } from "lodash";

const debouncedSearch = debounce(async (query: string) => {
	const response = await api.get("/transactions", {
		params: { search: query },
	});
	setResults(response.data);
}, 500);
```

---

## 📚 Resumo de Endpoints

| Método | Endpoint              | Autenticação | Descrição               |
| ------ | --------------------- | ------------ | ----------------------- |
| POST   | `/users/signup`       | Não          | Criar nova conta        |
| POST   | `/users/session`      | Não          | Fazer login             |
| GET    | `/users/me`           | Sim          | Buscar dados do usuário |
| GET    | `/users/balance`      | Sim          | Buscar saldo e resumo   |
| GET    | `/transactions`       | Sim          | Listar transações       |
| POST   | `/transaction/create` | Sim          | Criar transação         |
| DELETE | `/transaction/delete` | Sim          | Deletar transação       |

---
