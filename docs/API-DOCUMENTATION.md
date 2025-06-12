# 📱 API BeKosher - Documentação para App Mobile

## 🔐 Autenticação

Todas as APIs protegidas requerem o token JWT no header:
```
Authorization: Bearer {seu_token_jwt}
```

---

## 👤 Autenticação de Usuários

### POST /api/auth/register-user
**Descrição**: Cadastrar novo usuário no app

**Body**:
```json
{
  "email": "usuario@email.com",
  "password": "123456",
  "name": "Nome do Usuário",
  "phone": "+5511999999999" // opcional
}
```

**Resposta 201**:
```json
{
  "message": "Usuário cadastrado com sucesso",
  "user": {
    "id": "clx...",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "phone": "+5511999999999",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /api/auth/login-user
**Descrição**: Login de usuário do app

**Body**:
```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Resposta 200**:
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "clx...",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "phone": "+5511999999999",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🏪 Estabelecimentos

### GET /api/establishments
**Descrição**: Listar todos os estabelecimentos disponíveis

**Query Parameters**:
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10)
- `search` (optional): Buscar por nome
- `hasDelivery` (optional): "true" para apenas com entrega

**Exemplo**: `/api/establishments?page=1&limit=5&search=kosher&hasDelivery=true`

**Resposta 200**:
```json
{
  "establishments": [
    {
      "id": "clx...",
      "name": "Restaurante Kosher",
      "description": "Deliciosa comida kosher",
      "address": "Rua das Flores, 123",
      "phone": "+5511888888888",
      "logoUrl": "/images/logo.jpg",
      "hasDelivery": true,
      "deliveryFee": 5.90,
      "minDeliveryOrder": 25.00,
      "deliveryRadius": 10.0,
      "isOpen": true,
      "isDeliveryOpen": true,
      "operatingHours": {
        "openTime": "11:00",
        "closeTime": "22:00"
      },
      "deliveryHours": {
        "openTime": "11:30",
        "closeTime": "21:30"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### GET /api/establishments/[id]/menu
**Descrição**: Buscar cardápio completo de um estabelecimento

**Resposta 200**:
```json
{
  "establishment": {
    "id": "clx...",
    "name": "Restaurante Kosher",
    "description": "Deliciosa comida kosher",
    "address": "Rua das Flores, 123",
    "phone": "+5511888888888",
    "logoUrl": "/images/logo.jpg",
    "hasDelivery": true,
    "deliveryFee": 5.90,
    "minDeliveryOrder": 25.00,
    "deliveryRadius": 10.0,
    "isOpen": true,
    "isDeliveryOpen": true,
    "operatingHours": {
      "openTime": "11:00",
      "closeTime": "22:00"
    },
    "deliveryHours": {
      "openTime": "11:30",
      "closeTime": "21:30"
    }
  },
  "categories": [
    {
      "id": "clx...",
      "name": "Pratos Principais",
      "description": "Nossos melhores pratos",
      "products": [
        {
          "id": "clx...",
          "name": "Falafel Especial",
          "description": "Falafel artesanal com tahine",
          "price": 18.90,
          "imageUrl": "/images/falafel.jpg",
          "isKosher": true
        }
      ]
    }
  ],
  "totalProducts": 15
}
```

---

## 🛒 Pedidos

### POST /api/orders
**Descrição**: Criar novo pedido
**Autenticação**: Obrigatória (USER)

**Body**:
```json
{
  "establishmentId": "clx...",
  "deliveryAddress": "Rua das Palmeiras, 456 - Apt 12",
  "notes": "Sem cebola, por favor",
  "items": [
    {
      "productId": "clx...",
      "quantity": 2
    },
    {
      "productId": "clx...",
      "quantity": 1
    }
  ]
}
```

**Resposta 201**:
```json
{
  "message": "Pedido criado com sucesso",
  "order": {
    "id": "clx...",
    "userId": "clx...",
    "establishmentId": "clx...",
    "establishmentName": "Restaurante Kosher",
    "status": "PENDING",
    "total": 42.70,
    "deliveryAddress": "Rua das Palmeiras, 456 - Apt 12",
    "notes": "Sem cebola, por favor",
    "items": [
      {
        "id": "clx...",
        "productId": "clx...",
        "productName": "Falafel Especial",
        "quantity": 2,
        "price": 18.90,
        "subtotal": 37.80
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Possíveis Erros**:
- **400**: Pedido mínimo não atingido
- **404**: Estabelecimento não encontrado
- **400**: Produto inativo ou inexistente

---

### GET /api/orders
**Descrição**: Listar pedidos do usuário logado
**Autenticação**: Obrigatória (USER ou ESTABLISHMENT)

**Query Parameters**:
- `status` (optional): Filtrar por status
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10)

**Status possíveis**: `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`

**Exemplo**: `/api/orders?status=PENDING&page=1&limit=5`

**Resposta 200**:
```json
{
  "orders": [
    {
      "id": "clx...",
      "userId": "clx...",
      "userName": "João Silva",
      "userPhone": "+5511999999999",
      "establishmentId": "clx...",
      "establishmentName": "Restaurante Kosher",
      "status": "PENDING",
      "total": 42.70,
      "deliveryAddress": "Rua das Palmeiras, 456",
      "notes": "Sem cebola",
      "items": [
        {
          "id": "clx...",
          "productId": "clx...",
          "productName": "Falafel Especial",
          "quantity": 2,
          "price": 18.90,
          "subtotal": 37.80
        }
      ],
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

---

### GET /api/orders/[id]
**Descrição**: Buscar detalhes de um pedido específico
**Autenticação**: Obrigatória (USER ou ESTABLISHMENT)

**Resposta 200**:
```json
{
  "order": {
    "id": "clx...",
    "userId": "clx...",
    "userName": "João Silva",
    "userPhone": "+5511999999999",
    "userEmail": "joao@email.com",
    "establishmentId": "clx...",
    "establishmentName": "Restaurante Kosher",
    "establishmentAddress": "Rua das Flores, 123",
    "establishmentPhone": "+5511888888888",
    "status": "PREPARING",
    "total": 42.70,
    "deliveryAddress": "Rua das Palmeiras, 456",
    "notes": "Sem cebola",
    "hasDelivery": true,
    "deliveryFee": 5.90,
    "items": [
      {
        "id": "clx...",
        "productId": "clx...",
        "productName": "Falafel Especial",
        "productDescription": "Falafel artesanal com tahine",
        "productImage": "/images/falafel.jpg",
        "quantity": 2,
        "price": 18.90,
        "subtotal": 37.80
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  }
}
```

---

### PATCH /api/orders/[id]/status
**Descrição**: Atualizar status do pedido (apenas estabelecimentos)
**Autenticação**: Obrigatória (ESTABLISHMENT)

**Body**:
```json
{
  "status": "CONFIRMED"
}
```

**Fluxo de Status**:
- `PENDING` → `CONFIRMED` ou `CANCELLED`
- `CONFIRMED` → `PREPARING` ou `CANCELLED`
- `PREPARING` → `READY` ou `CANCELLED`
- `READY` → `DELIVERED`
- `DELIVERED` → (final)
- `CANCELLED` → (final)

**Resposta 200**:
```json
{
  "message": "Status do pedido atualizado com sucesso",
  "order": {
    "id": "clx...",
    "status": "CONFIRMED",
    "updatedAt": "2024-01-01T12:05:00.000Z"
    // ... outros campos
  }
}
```

**Possíveis Erros**:
- **400**: Transição de status inválida
- **403**: Apenas estabelecimentos podem alterar
- **404**: Pedido não encontrado

---

## 📱 Como usar no React Native

### 1. Configuração do Cliente HTTP

```typescript
// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sua-api.com/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = await AsyncStorage.getItem('auth_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
  }

  // Métodos de conveniência
  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 2. Serviços da API

```typescript
// services/authService.ts
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const response = await apiClient.post('/auth/register-user', userData);
    await AsyncStorage.setItem('auth_token', response.token);
    return response;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login-user', credentials);
    await AsyncStorage.setItem('auth_token', response.token);
    return response;
  },

  async logout() {
    await AsyncStorage.removeItem('auth_token');
  }
};

// services/establishmentService.ts
export const establishmentService = {
  async getEstablishments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    hasDelivery?: boolean;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([, value]) => value !== undefined)
    ).toString();
    
    return apiClient.get(`/establishments?${queryString}`);
  },

  async getMenu(establishmentId: string) {
    return apiClient.get(`/establishments/${establishmentId}/menu`);
  }
};

// services/orderService.ts
export const orderService = {
  async createOrder(orderData: {
    establishmentId: string;
    deliveryAddress: string;
    notes?: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    return apiClient.post('/orders', orderData);
  },

  async getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([, value]) => value !== undefined)
    ).toString();
    
    return apiClient.get(`/orders?${queryString}`);
  },

  async getOrder(orderId: string) {
    return apiClient.get(`/orders/${orderId}`);
  }
};
```

### 3. Hook de Estado Global (Context)

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        // Validar token com o backend se necessário
        // setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const register = async (userData: { email: string; password: string; name: string; phone?: string }) => {
    const response = await authService.register(userData);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 4. Exemplo de Tela de Pedido

```typescript
// screens/OrderScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { orderService } from '../services/orderService';

export const OrderScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        establishmentId: 'clx...',
        deliveryAddress: 'Meu endereço completo',
        notes: 'Observações especiais',
        items: [
          { productId: 'clx...', quantity: 2 },
          { productId: 'clx...', quantity: 1 }
        ]
      };

      const response = await orderService.createOrder(orderData);
      
      Alert.alert('Sucesso!', 'Pedido criado com sucesso!');
      console.log('Pedido criado:', response.order);
      
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Criar Pedido</Text>
      <Button 
        title={loading ? 'Criando...' : 'Fazer Pedido'} 
        onPress={createOrder}
        disabled={loading}
      />
    </View>
  );
};
```

---

## 🔄 Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

---

## 🚀 Próximos Passos

1. **WebSockets**: Para atualizações em tempo real do status dos pedidos
2. **Push Notifications**: Notificar usuários sobre mudanças de status
3. **Geolocalização**: Calcular distância e tempo de entrega
4. **Pagamentos**: Integração com gateways de pagamento
5. **Avaliações**: Sistema de reviews de estabelecimentos e produtos

---

## 📞 Suporte

Para dúvidas sobre a API, consulte esta documentação ou entre em contato com a equipe de desenvolvimento. 