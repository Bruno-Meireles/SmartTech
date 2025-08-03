# 🚀 Guia de Deploy - Smart Tech V2

## Opções de Deploy

### 1. Deploy Local (Desenvolvimento)

#### Backend
```bash
cd smart-tech-backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd smart-tech-frontend
pnpm run build
pnpm run preview
```

### 2. Deploy com Docker

#### Dockerfile Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

#### Dockerfile Frontend
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: smarttech
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./smart-tech-backend
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/smarttech
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./smart-tech-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. Deploy na Vercel (Frontend)

#### Configuração
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Variáveis de Ambiente
```
VITE_API_URL=https://sua-api.herokuapp.com/api
```

### 4. Deploy no Heroku (Backend)

#### Procfile
```
web: npm run start:prod
release: npx prisma migrate deploy
```

#### Configuração
```bash
# Instalar Heroku CLI
heroku create smart-tech-api

# Configurar variáveis
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### 5. Deploy no Railway

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Configurações de Produção

### Variáveis de Ambiente - Backend
```env
# Banco de dados
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Aplicação
PORT=3001
NODE_ENV=production

# CORS (opcional)
CORS_ORIGIN=https://seu-frontend.com
```

### Variáveis de Ambiente - Frontend
```env
VITE_API_URL=https://sua-api.com/api
```

## Checklist de Deploy

### Antes do Deploy
- [ ] Testar aplicação localmente
- [ ] Executar testes automatizados
- [ ] Verificar variáveis de ambiente
- [ ] Fazer backup do banco de dados
- [ ] Verificar logs de erro

### Backend
- [ ] Configurar banco de dados de produção
- [ ] Executar migrações do Prisma
- [ ] Importar dados iniciais (seed)
- [ ] Configurar CORS adequadamente
- [ ] Configurar logs de produção
- [ ] Configurar monitoramento

### Frontend
- [ ] Build da aplicação
- [ ] Configurar URL da API
- [ ] Testar em diferentes dispositivos
- [ ] Configurar cache de assets
- [ ] Configurar redirects para SPA

### Pós-Deploy
- [ ] Verificar saúde da aplicação
- [ ] Testar funcionalidades críticas
- [ ] Monitorar logs de erro
- [ ] Configurar alertas
- [ ] Documentar processo de deploy

## Monitoramento

### Logs Importantes
```bash
# Backend
tail -f /var/log/smart-tech-backend.log

# Banco de dados
tail -f /var/log/postgresql/postgresql.log

# Nginx (se aplicável)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Health Checks
```bash
# Backend
curl https://sua-api.com/api/health

# Frontend
curl https://seu-site.com
```

## Backup e Recuperação

### Backup do Banco
```bash
# PostgreSQL
pg_dump -h host -U user -d smarttech > backup.sql

# Restaurar
psql -h host -U user -d smarttech < backup.sql
```

### Backup de Arquivos
```bash
# Compactar projeto
tar -czf smart-tech-backup.tar.gz smart-tech-v2-refactored/

# Descompactar
tar -xzf smart-tech-backup.tar.gz
```

## Troubleshooting

### Problemas Comuns

#### Backend não inicia
1. Verificar variáveis de ambiente
2. Verificar conexão com banco
3. Verificar logs de erro
4. Verificar porta disponível

#### Frontend não carrega
1. Verificar build da aplicação
2. Verificar URL da API
3. Verificar CORS no backend
4. Verificar console do navegador

#### Banco de dados
1. Verificar conexão
2. Executar migrações
3. Verificar permissões
4. Verificar espaço em disco

### Comandos Úteis
```bash
# Verificar status dos serviços
systemctl status smart-tech-backend
systemctl status postgresql
systemctl status nginx

# Reiniciar serviços
systemctl restart smart-tech-backend
systemctl restart postgresql
systemctl restart nginx

# Verificar logs
journalctl -u smart-tech-backend -f
journalctl -u postgresql -f
```

## Segurança

### Configurações Recomendadas
- [ ] HTTPS obrigatório
- [ ] Headers de segurança configurados
- [ ] Rate limiting implementado
- [ ] Validação de entrada rigorosa
- [ ] Logs de auditoria
- [ ] Backup automático
- [ ] Monitoramento de segurança

### Headers de Segurança
```javascript
// Helmet.js para Express/NestJS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

---

**Boa sorte com o deploy! 🚀**

