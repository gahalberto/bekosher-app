# BeKosher - Plataforma Kosher 🥘

Uma plataforma digital dedicada exclusivamente à comunidade kosher, conectando estabelecimentos certificados com usuários.

## 🚀 Tecnologias

- **Next.js 14** com App Router
- **Tailwind CSS** para estilização
- **Prisma ORM** com PostgreSQL
- **Autenticação JWT** personalizada
- **ShadCN/ui** para componentes
- **TypeScript** para tipagem
- **Framer Motion** para animações
- **React Hook Form** para formulários
- **Zod** para validação

## 📁 Estrutura do Projeto

```
bekosher/
├── app/
│   ├── admin/           # Painel administrativo
│   ├── establishment/   # Painel dos estabelecimentos  
│   ├── api/            # APIs REST
│   └── globals.css     # Estilos globais
├── components/
│   ├── ui/             # Componentes ShadCN
│   ├── admin/          # Componentes do admin
│   └── establishment/  # Componentes dos estabelecimentos
├── lib/
│   ├── auth.ts         # Funções de autenticação JWT
│   ├── db.ts           # Cliente Prisma
│   └── utils.ts        # Utilitários gerais
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── seed.ts         # Script de seed
└── middleware.ts       # Middleware de autenticação
```

## 🛠️ Instalação

### 1. Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### 2. Clone o repositório

```bash
git clone <url-do-repositorio>
cd bekosher
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://bekosher_user:bekosher_password@localhost:5432/bekosher?schema=public"

# JWT
JWT_SECRET="sua_chave_secreta_muito_segura_aqui_mude_em_producao"

# NextJS
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_nextauth_secreta"
```

### 5. Inicie o banco de dados

```bash
docker-compose up -d
```

### 6. Execute as migrações do Prisma

```bash
npm run db:push
npm run db:generate
```

### 7. Execute o seed para criar o admin

```bash
npm run db:seed
```

### 8. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 👥 Usuários de Teste

### Administrador
- **Email:** admin@bekosher.com
- **Senha:** admin123
- **URL:** http://localhost:3000/admin/login

### Estabelecimento
Cadastre um novo estabelecimento em:
http://localhost:3000/establishment/login

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) com três níveis de acesso:

- **ADMIN**: Acesso completo ao painel administrativo
- **ESTABLISHMENT**: Acesso ao painel do estabelecimento
- **USER**: Acesso ao app mobile (futuro)

## 📱 Funcionalidades

### Painel Administrativo (`/admin`)
- ✅ Login de administrador
- ✅ Visualização de estatísticas
- ✅ Aprovação/rejeição de estabelecimentos
- ✅ Gerenciamento de usuários

### Painel do Estabelecimento (`/establishment`)
- ✅ Cadastro e login de estabelecimentos
- ✅ Edição de perfil completo
- ✅ Visualização de estatísticas
- 🚧 Gestão de cardápio (em desenvolvimento)
- 🚧 Criação de eventos (em desenvolvimento)
- 🚧 Gerenciamento de pedidos (em desenvolvimento)

### App Mobile (Futuro)
- 📱 Login de usuários
- 📱 Busca de estabelecimentos
- 📱 Visualização de cardápios
- 📱 Realização de pedidos
- 📱 Participação em eventos

## 🗄️ Banco de Dados

### Principais Entidades

- **User**: Usuários do sistema (admin, estabelecimento, cliente)
- **Establishment**: Dados dos estabelecimentos kosher
- **Category**: Categorias de produtos
- **Product**: Produtos do cardápio
- **Order**: Pedidos realizados
- **Event**: Eventos especiais

## 🚀 Deploy

### Banco de Dados em Produção

1. Configure o PostgreSQL em produção
2. Altere a `DATABASE_URL` no arquivo `.env`
3. Execute as migrações:

```bash
npm run db:push
npm run db:seed
```

### Deploy da Aplicação

O projeto está configurado para deploy em plataformas como:
- Vercel
- Netlify
- Railway
- Heroku

Certifique-se de configurar as variáveis de ambiente na plataforma escolhida.

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Build de produção
npm run start           # Inicia servidor de produção

# Banco de dados
npm run db:generate     # Gera cliente Prisma
npm run db:push         # Aplica mudanças no schema
npm run db:migrate      # Cria e aplica migrações
npm run db:studio       # Abre Prisma Studio
npm run db:seed         # Executa seed do banco

# Outros
npm run lint            # Executa linter
```

## 🎨 Design System

O projeto utiliza ShadCN/ui com Tailwind CSS:

- **Cores primárias**: Roxo (#7C3AED)
- **Tipografia**: Inter font
- **Componentes**: Cards, Buttons, Inputs, Badges, etc.
- **Responsividade**: Mobile-first design

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Email: suporte@bekosher.com
- GitHub Issues: [Criar issue](link-para-issues)

---

Desenvolvido com ❤️ para a comunidade kosher 