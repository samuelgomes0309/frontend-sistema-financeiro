# 💰 Sistema Financeiro - Frontend

<div align="center">
  
  ![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Interface moderna e intuitiva para gerenciamento completo de finanças pessoais.

[Funcionalidades](#-funcionalidades) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

Sistema web completo para controle e gerenciamento de finanças pessoais, desenvolvido com as melhores práticas e tecnologias modernas do mercado. Permite que usuários acompanhem suas receitas, despesas e visualizem o saldo em tempo real através de uma interface responsiva e intuitiva.

### 🎯 Objetivo

Fornecer uma ferramenta simples e eficiente para controle financeiro pessoal, permitindo que usuários:

- Registrem todas suas transações financeiras
- Visualizem o saldo e resumo financeiro
- Filtrem transações por período
- Acompanhem receitas e despesas separadamente

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

- ✅ Cadastro de novos usuários
- ✅ Login com email e senha
- ✅ Autenticação via JWT
- ✅ Validação automática de sessão
- ✅ Logout seguro
- ✅ Rotas protegidas

### 📊 Dashboard Interativo

- ✅ Visão geral do saldo total
- ✅ Cards de receitas e despesas do dia
- ✅ Lista de transações recentes
- ✅ Filtro por data personalizado
- ✅ Atualização em tempo real
- ✅ Design responsivo

### 💸 Gestão de Transações

- ✅ Criar novas transações (receitas/despesas)
- ✅ Visualizar histórico completo
- ✅ Deletar transações com confirmação
- ✅ Filtrar por período específico
- ✅ Descrição detalhada de cada transação
- ✅ Valores formatados em BRL

### 👤 Perfil do Usuário

- ✅ Visualização de dados pessoais
- ✅ Exibição de nome e email
- ✅ Informações da conta

---

## 🚀 Tecnologias

### Core & Build

- **[React 19.1.1](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vite 7.1.7](https://vitejs.dev/)** - Build tool extremamente rápida e moderna

### Estilização

- **[Tailwind CSS 4.1.16](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React 0.552.0](https://lucide.dev/)** - Biblioteca de ícones moderna e leve

### Formulários & Validação

- **[React Hook Form 7.66.0](https://react-hook-form.com/)** - Gerenciamento performático de formulários
- **[Zod 4.1.12](https://zod.dev/)** - Validação de esquemas TypeScript-first
- **[@hookform/resolvers 5.2.2](https://www.npmjs.com/package/@hookform/resolvers)** - Integração entre React Hook Form e Zod

### Roteamento & Estado

- **[React Router DOM 7.9.5](https://reactrouter.com/)** - Roteamento declarativo para React
- **React Context API** - Gerenciamento de estado global

### Comunicação & Utils

- **[Axios 1.13.1](https://axios-http.com/)** - Cliente HTTP para requisições à API
- **[Day.js 1.11.19](https://day.js.org/)** - Biblioteca leve para manipulação de datas
- **[React Hot Toast 2.6.0](https://react-hot-toast.com/)** - Notificações elegantes e customizáveis
- **[React Calendar 6.0.0](https://www.npmjs.com/package/react-calendar)** - Componente de calendário interativo

### Qualidade de Código

- **[ESLint 9.39.0](https://eslint.org/)** - Linter para identificar problemas no código
- **[Prettier 3.6.2](https://prettier.io/)** - Formatador de código opinativo
- **TypeScript ESLint** - Regras específicas para TypeScript

---

## 📁 Estrutura do Projeto

```
frontend-sistema-financeiro/
│
├── public/                          # Arquivos estáticos
│
├── src/
│   ├── api/                         # Configuração de API
│   │   └── api.ts                   # Instância do Axios com baseURL
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── errorMsg/                # Mensagem de erro
│   │   ├── header/                  # Cabeçalho da aplicação
│   │   ├── sidebar/                 # Menu lateral navegável
│   │   │   └── components/          # Sub-componentes do sidebar
│   │   │       └── itemLink.tsx     # Link individual do menu
│   │   └── submitBtn/               # Botão de submit estilizado
│   │
│   ├── contexts/                    # Contextos React
│   │   └── authContext.tsx          # Gerenciamento de autenticação
│   │
│   ├── pages/                       # Páginas da aplicação
│   │   ├── dashboard/               # Página principal
│   │   │   ├── index.tsx
│   │   │   └── components/          # Componentes específicos
│   │   │       ├── cardBalance.tsx  # Card de resumo financeiro
│   │   │       ├── cardItem.tsx     # Item de transação
│   │   │       └── filterModal.tsx  # Modal de filtro por data
│   │   │
│   │   ├── login/                   # Sistema de autenticação
│   │   │   ├── index.tsx
│   │   │   ├── schema.ts            # Schemas de validação Zod
│   │   │   ├── signin/              # Página de login
│   │   │   ├── signup/              # Página de cadastro
│   │   │   └── components/          # Componentes compartilhados
│   │   │
│   │   ├── profile/                 # Perfil do usuário
│   │   │   └── index.tsx
│   │   │
│   │   └── register/                # Registro de transações
│   │       ├── index.tsx
│   │       ├── schema.ts            # Validação de transações
│   │       └── components/          # Componentes do formulário
│   │           ├── cardTypeReg.tsx  # Seletor de tipo (receita/despesa)
│   │           ├── inputReg.tsx     # Input customizado
│   │           └── labelReg.tsx     # Label estilizada
│   │
│   ├── routes/                      # Configuração de rotas
│   │   ├── PrivateRoute.tsx         # HOC para rotas protegidas
│   │   ├── PublicRoute.tsx          # HOC para rotas públicas
│   │   └── components/
│   │       └── routerLoader.tsx     # Indicador de carregamento
│   │
│   ├── App.tsx                      # Componente raiz
│   ├── App.css                      # Estilos globais
│   └── main.tsx                     # Ponto de entrada da aplicação
│
├── .env                             # Variáveis de ambiente (não versionado)
├── .env.example                     # Exemplo de variáveis de ambiente
├── .gitignore                       # Arquivos ignorados pelo Git
├── .prettierrc                      # Configuração do Prettier
├── .prettierignore                  # Arquivos ignorados pelo Prettier
├── eslint.config.js                 # Configuração do ESLint
├── index.html                       # HTML base
├── package.json                     # Dependências e scripts
├── tsconfig.json                    # Configuração do TypeScript
├── tsconfig.app.json                # Config TS específica da aplicação
├── tsconfig.node.json               # Config TS para scripts Node
├── vite.config.ts                   # Configuração do Vite
├── README.md                        # Este arquivo
├── CONTEXTO.md                      # Documentação dos contextos React
└── ENDPOINTS.md                     # Documentação dos endpoints da API
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[Yarn](https://yarnpkg.com/)** ou **[npm](https://www.npmjs.com/)**
- **[Git](https://git-scm.com/)**

Você também precisa ter o **backend da aplicação** rodando. Certifique-se de que a API está disponível na URL configurada.

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/frontend-sistema-financeiro.git
cd frontend-sistema-financeiro
```

### 2. Instale as dependências

```bash
# Com Yarn (recomendado)
yarn install

# Ou com npm
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

Arquivo `.env`:

```env
# URL da API Backend
VITE_API_URL=http://localhost:3333
```

> **⚠️ Importante:** Certifique-se de que a URL da API está correta e que o backend está rodando.

### 4. Inicie o servidor de desenvolvimento

```bash
# Com Yarn
yarn dev

# Ou com npm
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev             # Inicia servidor de desenvolvimento

# Build
yarn build           # Cria build de produção otimizada

# Testes e Qualidade
yarn lint            # Executa o linter (ESLint)

# Preview
yarn preview         # Visualiza a build de produção localmente
```

---

## 🏗️ Arquitetura

### Padrões e Práticas

#### 🎨 Component-Based Architecture

- Componentes reutilizáveis e modulares
- Separação clara entre componentes de UI e lógica de negócio
- Uso de TypeScript para tipagem forte

#### 🔄 State Management

- **Context API** para estado global (autenticação)
- **useState** para estados locais
- Props drilling minimizado

#### 🛣️ Roteamento

- **React Router DOM** para navegação
- Rotas protegidas com HOC (Higher-Order Component)
- Redirecionamento baseado em autenticação

#### 📝 Formulários

- **React Hook Form** para gerenciamento performático
- **Zod** para validação de esquemas
- Validação em tempo real com feedback visual

#### 🎯 API Communication

- Instância centralizada do Axios
- Interceptors para tratamento de erros
- Token JWT em headers automáticos

---

## 📚 Documentação

Este projeto possui documentação detalhada em arquivos separados:

### 📖 [CONTEXTO.md](./CONTEXTO.md)

Documentação completa sobre os contextos React utilizados no projeto:

- **AuthContext**: Gerenciamento de autenticação
- Interfaces e tipos
- Métodos disponíveis
- Exemplos de uso
- Fluxos de autenticação

### 🔌 [ENDPOINTS.md](./ENDPOINTS.md)

Documentação completa de todos os endpoints da API:

- Endpoints de autenticação (signup, signin)
- Endpoints de usuário (profile, balance)
- Endpoints de transações (create, list, delete)
- Exemplos de requisições e respostas
- Tratamento de erros

---

## 🔐 Autenticação e Segurança

### JWT Token

- Armazenado em `localStorage` com chave `@financeT`
- Enviado em todas as requisições protegidas via header `Authorization`
- Validado automaticamente ao carregar a aplicação

### Rotas Protegidas

```typescript
// Exemplo de rota protegida
<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

### Fluxo de Autenticação

```
1. Usuário acessa a aplicação
2. AuthContext verifica token no localStorage
3. Se válido → valida com a API → acessa dashboard
4. Se inválido → redireciona para login
```

---

## 🎨 Temas e Estilização

### Tailwind CSS

O projeto utiliza Tailwind CSS com configuração customizada:

- Design system consistente
- Cores e espaçamentos padronizados
- Classes utilitárias para desenvolvimento rápido
- Design totalmente responsivo

### Responsividade

- **Mobile-first approach**
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Adaptável para todos os tamanhos de tela

---

## 🐛 Tratamento de Erros

### Toast Notifications

Utiliza **React Hot Toast** para feedback visual:

- ✅ Sucesso: Operações completadas
- ❌ Erro: Falhas e validações
- ℹ️ Informação: Avisos ao usuário

### Validação de Formulários

- Validação em tempo real
- Mensagens de erro específicas
- Feedback visual nos campos

---

## 🚀 Deploy

### Build de Produção

```bash
# Criar build otimizada
yarn build

# A pasta dist/ conterá os arquivos estáticos
```

### Opções de Deploy

- **[Vercel](https://vercel.com/)** - Recomendado para projetos Vite
- **[Netlify](https://www.netlify.com/)**
- **[GitHub Pages](https://pages.github.com/)**
- Qualquer servidor de arquivos estáticos

### Configurações de Deploy

Para Vercel, adicione `vercel.json`:

```json
{
	"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos abaixo:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. **Commit suas mudanças**
   ```bash
   git commit -m 'feat: Adiciona nova funcionalidade'
   ```
4. **Push para a branch**
   ```bash
   git push origin feature/MinhaFeature
   ```
5. **Abra um Pull Request**

### Convenções de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Apenas documentação
- `style:` Formatação, sem mudança de código
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Manutenção geral

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- Time React pela biblioteca incrível
- Comunidade TypeScript
- Contribuidores do Tailwind CSS
- Todos que contribuíram com feedback

---
