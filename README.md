# 🧩 Sistema de Pagamentos API

API RESTful para sistema de pagamentos com NestJS e MongoDB.

## 🚀 Funcionalidades

- **Clientes**: CRUD completo com validação de email/documento únicos
- **Cobranças**: 3 métodos de pagamento (PIX, Cartão, Boleto) com validações específicas
- **Status**: PENDING → PAID/FAILED/EXPIRED/CANCELLED

## 🛠️ Tecnologias

NestJS, MongoDB, Mongoose, Swagger, TypeScript

## 🔧 Instalação

```bash
npm install
cp env.example .env
# Configure sua DATABASE_URL no .env
npm run start:dev
```

## 📚 Documentação

Swagger disponível em: **http://localhost:3000/api/docs**

## 🧪 Exemplos de Uso

### Criar Cliente
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "document": "12345678901",
    "phone": "11999999999"
  }'
```

### Criar Cobrança PIX
```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "ID_DO_CLIENTE",
    "amount": 100.50,
    "paymentMethod": "PIX",
    "idempotencyKey": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Criar Cobrança Cartão
```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "ID_DO_CLIENTE",
    "amount": 500.00,
    "paymentMethod": "CREDIT_CARD",
    "metadata": { "installments": 3 },
    "idempotencyKey": "123e4567-e89b-12d3-a456-426614174001"
  }'
```

### Criar Cobrança Boleto
```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "ID_DO_CLIENTE",
    "amount": 250.00,
    "paymentMethod": "BANK_SLIP",
    "metadata": { "dueDate": "2024-02-15" },
    "idempotencyKey": "123e4567-e89b-12d3-a456-426614174002"
  }'
```

## 📊 Endpoints

- `GET /customers` - Listar clientes
- `POST /customers` - Criar cliente
- `GET /customers/:id` - Buscar cliente
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Remover cliente

- `GET /charges` - Listar cobranças
- `POST /charges` - Criar cobrança
- `GET /charges/:id` - Buscar cobrança
- `PATCH /charges/:id` - Atualizar cobrança
- `DELETE /charges/:id` - Remover cobrança