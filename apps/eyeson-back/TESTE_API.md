# Como Testar a API

## 1. Iniciar o servidor

```bash
uvicorn app.main:app --reload
```

A API estará disponível em: `http://localhost:8000`

## 2. Documentação Interativa (Swagger)

Acesse no navegador:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 3. Comandos cURL

### Health Check

```bash
curl http://localhost:8000/health
```

### Root

```bash
curl http://localhost:8000/
```

---

## OWNERS

### Criar Owner

```bash
curl -X POST http://localhost:8000/integrations/owner/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "74981242242"
  }'
```

### Listar Owners

```bash
curl http://localhost:8000/integrations/owner/
```

### Buscar Owner por ID

```bash
curl http://localhost:8000/integrations/owner/{owner_id}
```

### Atualizar Owner

```bash
curl -X PUT http://localhost:8000/integrations/owner/{owner_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com",
    "phone": "74981242242"
  }'
```

### Deletar Owner

```bash
curl -X DELETE http://localhost:8000/integrations/owner/{owner_id}
```

**Nota:** Ao deletar um Owner, todos os seus Assets são deletados automaticamente (cascade delete).

---

## ASSETS

### Criar Asset

```bash
curl -X POST http://localhost:8000/integrations/asset/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "category": "Eletrônicos",
    "owner_id": "{owner_id}"
  }'
```

### Listar Assets

```bash
curl http://localhost:8000/integrations/asset/
```

### Buscar Asset por ID

```bash
curl http://localhost:8000/integrations/asset/{asset_id}
```

### Buscar Assets por Owner

```bash
curl http://localhost:8000/integrations/asset/owner/{owner_id}
```

### Atualizar Asset

```bash
curl -X PUT http://localhost:8000/integrations/asset/{asset_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell Atualizado",
    "category": "Informática"
  }'
```

### Deletar Asset

```bash
curl -X DELETE http://localhost:8000/integrations/asset/{asset_id}
```

---

## Exemplo Completo de Teste

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Criar owner
OWNER_ID=$(curl -s -X POST http://localhost:8000/integrations/owner/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "phone": "74981242242"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")

echo "Owner ID: $OWNER_ID"

# 3. Listar owners
curl http://localhost:8000/integrations/owner/

# 4. Criar asset
curl -X POST http://localhost:8000/integrations/asset/ \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Notebook Dell\",
    \"category\": \"Eletrônicos\",
    \"owner_id\": \"$OWNER_ID\"
  }"

# 5. Listar assets
curl http://localhost:8000/integrations/asset/

# 6. Buscar assets do owner
curl http://localhost:8000/integrations/asset/owner/$OWNER_ID
```
