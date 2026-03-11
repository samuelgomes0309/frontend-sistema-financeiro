# 📚 Documentação de Contextos - Sistema Financeiro

Esta documentação descreve os contextos React utilizados no projeto para gerenciamento de estado global.

---

## 📑 Índice

- [AuthContext](#authcontext)
  - [Interfaces e Tipos](#interfaces-e-tipos)
  - [Propriedades do Contexto](#propriedades-do-contexto)
  - [Métodos Disponíveis](#métodos-disponíveis)
  - [Como Utilizar](#como-utilizar)
  - [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Boas Práticas](#boas-práticas)

---

## 🔐 AuthContext

O **AuthContext** é responsável por gerenciar toda a lógica de autenticação da aplicação, incluindo login, registro, logout e validação do usuário.

**Localização:** `src/contexts/authContext.tsx`

### Interfaces e Tipos

#### UserPropsRequest

Interface para os dados retornados pela API ao fazer login ou buscar dados do usuário.

```typescript
interface UserPropsRequest {
	id: string;
	name: string;
	email: string;
	balance: number;
	token: string;
}
```

#### UserProps

Interface para os dados do usuário armazenados no estado da aplicação.

```typescript
interface UserProps {
	user_id: string;
	name: string;
	email: string;
	balance: number;
}
```

#### ContextProps

Interface que define todas as propriedades e métodos disponibilizados pelo contexto.

```typescript
interface ContextProps {
	user: UserProps | null;
	handleSignUp: (data: SignUpData) => Promise<boolean>;
	handleLogin: (data: SignInData) => Promise<boolean>;
	signed: boolean;
	logOut: () => Promise<void>;
	loadingAuth: boolean;
}
```

---

### Propriedades do Contexto

| Propriedade    | Tipo                | Descrição                                                    |
| -------------- | ------------------- | ------------------------------------------------------------ |
| `user`         | `UserProps \| null` | Dados do usuário autenticado ou `null` se não estiver logado |
| `signed`       | `boolean`           | Indica se há um usuário autenticado (`!!user`)               |
| `loadingAuth`  | `boolean`           | Indica se o contexto está carregando/validando autenticação  |
| `handleSignUp` | `Function`          | Função assíncrona para criar uma nova conta                  |
| `handleLogin`  | `Function`          | Função assíncrona para fazer login                           |
| `logOut`       | `Function`          | Função assíncrona para fazer logout                          |

---

### Métodos Disponíveis

#### 1. validateUser()

**Descrição:** Valida automaticamente o usuário ao carregar a aplicação verificando o token no localStorage.

**Executado:** Automaticamente no `useEffect` quando o componente monta.

**Fluxo:**

```
1. Busca o token no localStorage (@financeT)
2. Se não houver token → define user como null
3. Se houver token → faz requisição GET /users/me
4. Se válido → atualiza estado do usuário
5. Se inválido → mantém user como null
6. Define loadingAuth como false
```

**Código:**

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
		setUser({ balance, email, name, user_id: id });
	} catch (error) {
		console.log(error);
	} finally {
		setLoadingAuth(false);
	}
}
```

---

#### 2. handleSignUp(data)

**Descrição:** Cria uma nova conta de usuário e faz login automaticamente após o cadastro.

**Parâmetros:**

- `data: SignUpData` - Dados do formulário de cadastro (name, email, password)

**Retorno:** `Promise<boolean>`

- `true` - Cadastro e login bem-sucedidos
- `false` - Erro no cadastro ou login

**Fluxo:**

```
1. Envia POST /users/signup com os dados do usuário
2. Exibe toast de sucesso
3. Chama handleLogin() automaticamente com email e senha
4. Retorna o resultado do login
```

**Exemplo de Uso:**

```typescript
const { handleSignUp } = useContext(AuthContext)!;

async function onSubmit(formData: SignUpData) {
	const success = await handleSignUp(formData);
	if (success) {
		navigate("/dashboard");
	}
}
```

---

#### 3. handleLogin(data)

**Descrição:** Autentica o usuário com email e senha.

**Parâmetros:**

- `data: SignInData` - Credenciais do usuário (email, password)

**Retorno:** `Promise<boolean>`

- `true` - Login bem-sucedido
- `false` - Erro no login

**Fluxo:**

```
1. Envia POST /users/session com email e senha
2. Recebe dados do usuário e token
3. Atualiza o estado global com os dados do usuário
4. Configura o header Authorization do axios
5. Salva o token no localStorage
6. Retorna true
```

**Código:**

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

**Exemplo de Uso:**

```typescript
const { handleLogin } = useContext(AuthContext)!;

async function onSubmit(formData: SignInData) {
	const success = await handleLogin(formData);
	if (success) {
		navigate("/dashboard");
	}
}
```

---

#### 4. logOut()

**Descrição:** Faz logout do usuário, removendo seus dados e token.

**Parâmetros:** Nenhum

**Retorno:** `Promise<void>`

**Fluxo:**

```
1. Verifica se há um usuário logado
2. Remove o token do localStorage
3. Define user como null
4. Remove o header Authorization (implicitamente)
```

**Código:**

```typescript
async function logOut() {
	if (!user) {
		return;
	}
	localStorage.removeItem("@financeT");
	setUser(null);
}
```

**Exemplo de Uso:**

```typescript
const { logOut } = useContext(AuthContext)!;

async function handleLogout() {
	await logOut();
	navigate("/login");
}
```

---

#### 5. handleUserLocalStorage(token)

**Descrição:** Função auxiliar privada que salva o token no localStorage.

**Parâmetros:**

- `token: string` - Token JWT a ser armazenado

**Retorno:** `void`

**Código:**

```typescript
function handleUserLocalStorage(token: string) {
	if (!token) {
		return;
	}
	localStorage.setItem("@financeT", token);
}
```

---

### Como Utilizar

#### 1. Configurar o Provider

Envolva sua aplicação com o `AuthContextProvider` no arquivo principal:

```typescript
// src/main.tsx
import { AuthContextProvider } from './contexts/authContext';

const router = createBrowserRouter([/* suas rotas */]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
```

#### 2. Consumir o Contexto

Use `useContext` em qualquer componente filho para acessar as propriedades:

```typescript
import { useContext } from 'react';
import { AuthContext } from './contexts/authContext';

function MyComponent() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext deve ser usado dentro do AuthContextProvider');
  }

  const { user, signed, loadingAuth, handleLogin, logOut } = context;

  return (
    <div>
      {loadingAuth ? (
        <p>Carregando...</p>
      ) : signed ? (
        <>
          <h1>Olá, {user?.name}!</h1>
          <button onClick={logOut}>Sair</button>
        </>
      ) : (
        <p>Faça login para continuar</p>
      )}
    </div>
  );
}
```

#### 3. Proteger Rotas

Use a propriedade `signed` para criar rotas protegidas:

```typescript
// src/routes/PrivateRoute.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { signed, loadingAuth } = useContext(AuthContext)!;

  if (loadingAuth) {
    return <RouterLoader />;
  }

  return signed ? children : <Navigate to="/login" />;
}
```

---

### Fluxo de Autenticação

#### Fluxo de Login Completo

```
┌─────────────────────────────────────────────┐
│  Usuário acessa a aplicação                 │
└───────────────┬─────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Token existe? │
        └───┬───────┬───┘
            │       │
         Sim│       │Não
            │       │
            ▼       ▼
    ┌──────────┐  ┌──────────────────┐
    │validateU.│  │Redireciona Login │
    └────┬─────┘  └──────────────────┘
         │                  │
         ▼                  │
    ┌──────────┐            │
    │Token     │            │
    │válido?   │            │
    └──┬───┬───┘            │
       │   │                │
    Sim│   │Não             │
       │   └────────────────┘
       ▼                    │
┌──────────────┐            │
│Carrega dados │            │
│do usuário    │            │
└──────┬───────┘            │
       │                    │
       ▼                    ▼
┌──────────────┐  ┌──────────────────┐
│Acessa        │  │Usuário preenche  │
│Dashboard     │  │formulário        │
└──────────────┘  └────────┬─────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │handleLogin() │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │Credenciais   │
                   │válidas?      │
                   └──┬───────┬───┘
                      │       │
                   Sim│       │Não
                      │       │
                      ▼       ▼
              ┌──────────┐  ┌────────┐
              │Salva     │  │Exibe   │
              │token     │  │erro    │
              └────┬─────┘  └────────┘
                   │
                   ▼
              ┌──────────────┐
              │Configura     │
              │Authorization │
              └──────┬───────┘
                     │
                     ▼
              ┌─────────────┐
              │Carrega dados│
              └─────────────┘
```

#### Fluxo de Cadastro

```
┌──────────────────────────────────┐
│Usuário preenche formulário       │
│de cadastro                        │
└─────────────┬────────────────────┘
              │
              ▼
      ┌──────────────┐
      │handleSignUp()│
      └──────┬───────┘
             │
             ▼
    ┌────────────────┐
    │POST            │
    │/users/signup   │
    └────┬───────────┘
         │
         ▼
    ┌─────────┐
    │Sucesso? │
    └──┬───┬──┘
       │   │
    Sim│   │Não
       │   │
       ▼   ▼
  ┌────────┐  ┌─────────┐
  │Toast   │  │Toast de │
  │sucesso │  │erro     │
  └───┬────┘  └────┬────┘
      │            │
      ▼            │
  ┌────────────┐   │
  │handleLogin │   │
  │automático  │   │
  └─────┬──────┘   │
        │          │
        ▼          │
  ┌──────────┐     │
  │Usuário   │     │
  │autenticad│     │
  └──────────┘     │
                   │
                   ▼
              ┌─────────┐
              │Volta ao │
              │formulário│
              └─────────┘
```

#### Fluxo de Logout

```
┌────────────────────┐
│Usuário clica       │
│em Sair             │
└─────────┬──────────┘
          │
          ▼
    ┌──────────┐
    │logOut()  │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│Remove token do  │
│localStorage     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Limpa estado do  │
│usuário (null)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Redireciona para │
│Login            │
└─────────────────┘
```

---

## ✅ Boas Práticas

### Recomendações

1. **Sempre valide o contexto:**

   ```typescript
   const context = useContext(AuthContext);
   if (!context) {
   	throw new Error("Contexto não encontrado");
   }
   ```

2. **Use loadingAuth para feedback visual:**

   ```typescript
   if (loadingAuth) {
     return <LoadingSpinner />;
   }
   ```

3. **Verifique signed antes de acessar user:**

   ```typescript
   if (signed && user) {
   	console.log(user.name);
   }
   ```

4. **Trate erros ao fazer login/signup:**

   ```typescript
   const success = await handleLogin(data);
   if (!success) {
   	// Mostre mensagem de erro adicional se necessário
   }
   ```

5. **Limpe o estado ao deslogar:**
   ```typescript
   await logOut();
   // Limpe outros estados locais se necessário
   ```

### O que NÃO fazer

❌ Não modifique o estado do usuário diretamente  
❌ Não armazene dados sensíveis além do token  
❌ Não use o contexto fora do Provider  
❌ Não faça múltiplas chamadas de login simultâneas  
❌ Não ignore o loadingAuth ao renderizar componentes protegidos

---

## 🔒 Segurança

### Token JWT

O token é armazenado no **localStorage** com a chave `@financeT`.

**Considerações:**

- ✅ Token é enviado no header Authorization de todas as requisições após login
- ✅ Token é validado automaticamente ao carregar a aplicação
- ⚠️ localStorage é vulnerável a XSS - certifique-se de sanitizar inputs
- ⚠️ Considere usar httpOnly cookies para maior segurança em produção

### Headers de Autorização

```typescript
// Configurado automaticamente após login
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

---

## 📊 Estrutura de Dados

### Dados Armazenados no Estado

```typescript
{
  user: {
    user_id: "uuid-do-usuario",
    name: "João Silva",
    email: "joao@exemplo.com",
    balance: 5000.00
  },
  signed: true,
  loadingAuth: false
}
```

### Dados no localStorage

```typescript
localStorage.setItem("@financeT", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
```

---

## 🧪 Exemplo Completo

```typescript
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import type { SignInData } from '../pages/login/schema';

function LoginPage() {
  const { handleLogin, loadingAuth, signed } = useContext(AuthContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data: SignInData = { email, password };
    const success = await handleLogin(data);

    if (success) {
      navigate('/dashboard');
    }
  }

  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  if (signed) {
    navigate('/dashboard');
    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

---
