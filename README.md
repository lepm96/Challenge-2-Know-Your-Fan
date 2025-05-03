# FURIA Fan Portal - Documentação

## Visão Geral
O FURIA Fan Portal é uma landing page com interface conversacional (chatbot) para fãs da FURIA Esports. O projeto inclui um frontend em Next.js e um backend em Node.js com MongoDB.

## Estrutura do Projeto

### Frontend (Next.js)
- `src/app/` - Páginas da aplicação
  - `page.tsx` - Página inicial
  - `login/page.tsx` - Página de login
  - `register/page.tsx` - Página de cadastro
  - `profile/page.tsx` - Página de perfil do usuário
  - `chat/page.tsx` - Interface conversacional (chatbot)
  - `globals.css` - Estilos globais
- `public/` - Arquivos estáticos (imagens, etc.)

### Backend (Node.js/Express)
- `src/` - Código-fonte do backend
  - `config/` - Configurações (banco de dados, etc.)
  - `controllers/` - Controladores da API
  - `middleware/` - Middlewares (autenticação, etc.)
  - `models/` - Modelos de dados (MongoDB)
  - `routes/` - Rotas da API
- `server.js` - Ponto de entrada do servidor
- `.env` - Variáveis de ambiente

## Requisitos

### Frontend
- Node.js 14+
- npm ou yarn
- Next.js 15+

### Backend
- Node.js 14+
- npm ou yarn
- MongoDB

## Instalação e Execução

### Frontend
1. Navegue até a pasta `frontend`
2. Instale as dependências:
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```
3. Instale o axios (necessário para requisições HTTP):
   ```
   npm install axios
   ```
4. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```
   ou
   ```
   yarn dev
   ```
5. Acesse `http://localhost:3000` no navegador

### Backend
1. Navegue até a pasta `backend`
2. Instale as dependências:
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```
3. Configure o MongoDB:
   - Instale o MongoDB localmente ou use um serviço de nuvem
   - Atualize o arquivo `.env` com a URL de conexão
4. Execute o servidor:
   ```
   npm run dev
   ```
   ou
   ```
   yarn dev
   ```
5. A API estará disponível em `http://localhost:5000`

## Funcionalidades

### Autenticação
- Registro de usuários
- Login
- Proteção de rotas com JWT

### Perfil de Usuário
- Exibição de dados pessoais
- Análise de interações nas redes sociais
- Estatísticas de engajamento

### Chatbot
- Interface conversacional única
- Respostas personalizadas baseadas no perfil do usuário
- Histórico de conversas persistente
- Informações sobre:
  - Curiosidades e histórias do time
  - Agenda e resultados em tempo real
  - Melhores momentos e clipes
  - Estatísticas dos jogadores
  - Loja oficial e itens exclusivos
  - Quiz e desafios para fãs

## API Endpoints

### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Autenticar usuário
- `GET /api/users/profile` - Obter perfil do usuário (protegido)
- `PUT /api/users/profile` - Atualizar perfil do usuário (protegido)

### Chat
- `GET /api/chat/history` - Obter histórico de mensagens (protegido)
- `POST /api/chat/message` - Enviar mensagem para o chatbot (protegido)
- `DELETE /api/chat/history` - Limpar histórico de chat (protegido)

## Personalização

### Cores e Estilos
- O projeto utiliza uma paleta de cores preto e branco conforme solicitado
- Os estilos podem ser modificados em `src/app/globals.css`

### Conteúdo do Chatbot
- As respostas do chatbot podem ser modificadas em `backend/src/controllers/chatController.js`
- Novas categorias de respostas podem ser adicionadas seguindo o mesmo padrão

### Banco de Dados
- Os modelos de dados podem ser modificados em `backend/src/models/`
- Novos modelos podem ser adicionados conforme necessário

## Implantação

### Frontend
- Para build de produção:
  ```
  npm run build
  ```
  ou
  ```
  yarn build
  ```
- O resultado estará na pasta `.next`

### Backend
- Para implantação em produção, recomenda-se usar PM2 ou similar:
  ```
  npm install -g pm2
  pm2 start server.js
  ```

