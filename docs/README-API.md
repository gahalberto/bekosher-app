# 🍽️ BeKosher API - Sistema de Pedidos

API RESTful completa para o sistema BeKosher, similar ao iFood/UberEats, especializada em estabelecimentos kosher.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Registro de usuários do app (POST `/api/auth/register-user`)
- [x] Login de usuários (POST `/api/auth/login-user`)
- [x] Autenticação JWT para todas as rotas protegidas
- [x] Middleware de verificação de token

### ✅ Estabelecimentos
- [x] Listagem de estabelecimentos com filtros (GET `/api/establishments`)
- [x] Cardápio completo com categorias e produtos (GET `/api/establishments/[id]/menu`)
- [x] Verificação de horários de funcionamento em tempo real
- [x] Suporte a estabelecimentos com/sem entrega

### ✅ Sistema de Pedidos
- [x] Criação de pedidos com validação completa (POST `/api/orders`)
- [x] Listagem de pedidos por usuário/estabelecimento (GET `/api/orders`)
- [x] Detalhes de pedido específico (GET `/api/orders/[id]`)
- [x] Atualização de status por estabelecimentos (PATCH `/api/orders/[id]/status`)
- [x] Cálculo automático de totais e taxas
- [x] Validação de pedido mínimo

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT personalizado
- **Validação**: Zod
- **TypeScript**: Totalmente tipado

## 📁 Estrutura dos Endpoints

```
📂 app/api/
├── 🔐 auth/
│   ├── login-user/          # Login usuários app
│   ├── register-user/       # Registro usuários app
│   └── login/              # Login estabelecimentos (existente)
├── 🏪 establishments/
│   ├── route.ts            # GET - Listar estabelecimentos
│   └── [id]/menu/          # GET - Cardápio específico
└── 🛒 orders/
    ├── route.ts            # POST - Criar | GET - Listar
    ├── [id]/route.ts       # GET - Detalhes do pedido
    └── [id]/status/        # PATCH - Atualizar status
```

## 🔄 Fluxo de Pedidos

```mermaid
graph LR
    A[PENDING] --> B[CONFIRMED]
    A --> G[CANCELLED]
    B --> C[PREPARING]
    B --> G
    C --> D[READY]
    C --> G
    D --> E[DELIVERED]
    E --> F[FINAL]
    G --> F[FINAL]
```

## 🎯 Como Usar

### 1. **Cadastro/Login de Usuário**
```bash
# Cadastro
curl -X POST http://localhost:3001/api/auth/register-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "123456",
    "name": "Usuário Teste"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "123456"
  }'
```

### 2. **Listar Estabelecimentos**
```bash
curl -X GET "http://localhost:3001/api/establishments?hasDelivery=true&search=kosher"
```

### 3. **Ver Cardápio**
```bash
curl -X GET http://localhost:3001/api/establishments/{establishment_id}/menu
```

### 4. **Criar Pedido**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer {seu_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "establishmentId": "clx...",
    "deliveryAddress": "Rua das Palmeiras, 456",
    "notes": "Sem cebola",
    "items": [
      {
        "productId": "clx...",
        "quantity": 2
      }
    ]
  }'
```

### 5. **Acompanhar Pedidos**
```bash
# Listar todos os pedidos
curl -X GET http://localhost:3001/api/orders \
  -H "Authorization: Bearer {seu_token}"

# Detalhes de um pedido
curl -X GET http://localhost:3001/api/orders/{order_id} \
  -H "Authorization: Bearer {seu_token}"
```

## 🔧 Configuração Local

### 1. **Variáveis de Ambiente**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bekosher"
JWT_SECRET="your-secret-key"
```

### 2. **Executar o Projeto**
```bash
# Instalar dependências
npm install

# Executar migrações do banco
npx prisma db push

# Popular banco com dados de exemplo
npx prisma db seed

# Iniciar servidor
npm run dev
```

### 3. **Dados de Teste**
O seed cria automaticamente:
- **Admin**: admin@bekosher.com / admin123
- **Restaurante**: restaurante@bekosher.com / restaurante123
- **Padaria**: padaria@bekosher.com / padaria123
- **Usuário Teste**: Criar via API

## 📊 Validações Implementadas

### ✅ Pedidos
- Estabelecimento deve estar aprovado e ativo
- Produtos devem existir e estar ativos
- Verificação de pedido mínimo
- Cálculo automático de taxa de entrega
- Validação de horários de funcionamento

### ✅ Status de Pedidos
- Apenas estabelecimentos podem alterar status
- Transições de status validadas
- Histórico de alterações preservado

### ✅ Autenticação
- Tokens JWT com expiração de 7 dias
- Verificação de role (USER/ESTABLISHMENT/ADMIN)
- Middleware de segurança

## 🎨 Para o App React Native

A API foi projetada especificamente para consumo por apps mobile:

- **Paginação**: Todos os endpoints com listagem suportam paginação
- **Filtros**: Busca e filtros otimizados para UX mobile
- **Dados Mínimos**: Responses otimizadas com apenas dados necessários
- **Status em Tempo Real**: Verificação de estabelecimentos abertos/fechados
- **Cálculos Automáticos**: Total, taxa de entrega, subtotais calculados no backend

## 📖 Documentação Completa

Para documentação detalhada com exemplos de uso no React Native, consulte:
**[📱 API-DOCUMENTATION.md](./API-DOCUMENTATION.md)**

## 🔮 Próximas Funcionalidades

- [ ] WebSockets para atualizações em tempo real
- [ ] Sistema de notificações push
- [ ] Integração com pagamentos
- [ ] Geolocalização e cálculo de distância
- [ ] Sistema de avaliações
- [ ] Upload de imagens para produtos
- [ ] Chat entre usuário e estabelecimento

## 🐛 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "campo_com_erro",
      "message": "Mensagem específica"
    }
  ]
}
```

## 🔒 Segurança

- ✅ Validação de entrada com Zod
- ✅ Sanitização de dados
- ✅ Autenticação JWT
- ✅ Verificação de permissões por role
- ✅ Rate limiting (implementar)
- ✅ Headers de segurança (implementar)

---

⭐ **API pronta para produção e consumo pelo app React Native!** 