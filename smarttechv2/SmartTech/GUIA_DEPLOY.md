# Guia de Deploy - SmartTech

## Preparação para Produção

### 1. Configurações de Ambiente

#### 1.1 Variáveis de Ambiente

Crie um arquivo `.env.production` no frontend com:

```env
VITE_API_URL=https://api.smarttech.com.br
VITE_SITE_URL=https://smarttech.com.br
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
```

#### 1.2 Configurações do Backend

No backend, configure o arquivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smarttech"
JWT_SECRET="seu-jwt-secret-super-seguro"
STRIPE_SECRET_KEY="sk_live_..."
CORS_ORIGIN="https://smarttech.com.br"
```

### 2. Build do Frontend

#### 2.1 Otimizações de Build

```bash
cd smart-tech-frontend

# Instalar dependências
npm install --legacy-peer-deps

# Build para produção
npm run build

# Verificar build
npm run preview
```

#### 2.2 Otimizações Adicionais

Adicione ao `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 3. Deploy do Frontend

#### 3.1 Opção 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configurações no `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### 3.2 Opção 2: Netlify

```bash
# Build
npm run build

# Deploy manual ou conectar repositório Git
```

Configurações no `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

#### 3.3 Opção 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload para S3
aws s3 sync dist/ s3://smarttech-frontend --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id XXXXXXXXXX --paths "/*"
```

### 4. Deploy do Backend

#### 4.1 Preparação do Banco de Dados

```bash
# Migrar banco de dados
npx prisma migrate deploy

# Seed inicial (se necessário)
npm run seed
```

#### 4.2 Opção 1: Railway

```bash
# Conectar repositório e configurar variáveis de ambiente
# Deploy automático via Git
```

#### 4.3 Opção 2: Heroku

```bash
# Login no Heroku
heroku login

# Criar app
heroku create smarttech-api

# Configurar variáveis
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="..."

# Deploy
git push heroku main
```

#### 4.4 Opção 3: DigitalOcean App Platform

```yaml
# .do/app.yaml
name: smarttech-backend
services:
- name: api
  source_dir: /
  github:
    repo: seu-usuario/smarttech
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
databases:
- name: db
  engine: PG
  version: "13"
```

### 5. Configurações de DNS

#### 5.1 Configuração de Domínio

```
# Registros DNS necessários
A     @           IP_DO_SERVIDOR
CNAME www         smarttech.com.br
CNAME api         api-server.herokuapp.com
```

#### 5.2 SSL/TLS

- Configure certificado SSL (Let's Encrypt recomendado)
- Force HTTPS redirect
- Configure HSTS headers

### 6. Configurações de SEO em Produção

#### 6.1 Google Search Console

1. Adicionar propriedade no Search Console
2. Verificar propriedade via DNS ou arquivo HTML
3. Submeter sitemap: `https://smarttech.com.br/sitemap.xml`

#### 6.2 Google Analytics

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 6.3 Sitemap Dinâmico

Implemente endpoint para sitemap dinâmico:

```typescript
// backend/src/sitemap/sitemap.controller.ts
@Get('sitemap.xml')
async getSitemap(@Res() res: Response) {
  const products = await this.productService.findAll();
  const categories = await this.categoryService.findAll();
  
  const sitemap = await generateSitemap(products, categories);
  
  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
}
```

### 7. Monitoramento e Analytics

#### 7.1 Ferramentas de Monitoramento

- **Uptime Robot**: Monitoramento de disponibilidade
- **Google PageSpeed Insights**: Performance
- **GTmetrix**: Análise de velocidade
- **Hotjar**: Heatmaps e gravações de sessão

#### 7.2 Métricas Importantes

- Core Web Vitals (LCP, FID, CLS)
- Taxa de conversão
- Taxa de abandono de carrinho
- Tempo de carregamento
- Taxa de rejeição

### 8. Segurança

#### 8.1 Headers de Segurança

```typescript
// Adicionar ao backend
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "www.googletagmanager.com"]
    }
  }
}));
```

#### 8.2 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

### 9. Backup e Recuperação

#### 9.1 Backup do Banco de Dados

```bash
# Backup automático diário
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restauração
psql $DATABASE_URL < backup_20240802.sql
```

#### 9.2 Backup de Assets

- Configure backup automático de imagens
- Use CDN para assets estáticos
- Implemente versionamento de assets

### 10. Checklist de Deploy

#### 10.1 Pré-Deploy

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] SSL configurado
- [ ] DNS configurado
- [ ] Backup do banco atual

#### 10.2 Pós-Deploy

- [ ] Verificar funcionamento do site
- [ ] Testar formulários
- [ ] Verificar integração de pagamento
- [ ] Submeter sitemap ao Google
- [ ] Configurar monitoramento
- [ ] Testar performance
- [ ] Verificar structured data

### 11. Manutenção Contínua

#### 11.1 Atualizações

- Atualizações de segurança mensais
- Backup antes de atualizações
- Testes em ambiente de staging

#### 11.2 Otimizações

- Monitorar Core Web Vitals
- Otimizar imagens regularmente
- Revisar e atualizar conteúdo SEO
- Analisar e otimizar conversões

## Suporte e Troubleshooting

### Problemas Comuns

1. **Build falha**: Verificar dependências e versões do Node.js
2. **CORS errors**: Configurar origins no backend
3. **404 em rotas**: Configurar redirects para SPA
4. **Performance lenta**: Otimizar bundle size e imagens

### Contatos de Suporte

- Documentação técnica: Este arquivo
- Issues: Repositório Git
- Monitoramento: Dashboard de métricas

---

**Nota**: Este guia deve ser atualizado conforme novas implementações e mudanças na infraestrutura.

