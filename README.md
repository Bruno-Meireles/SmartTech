# Smart Tech V2 - E-commerce Refatorado

## 📋 Visão Geral

Este projeto é uma refatoração completa do Smart Tech E-commerce, migrando de Python/Flask para uma stack moderna com NestJS, Prisma, TypeScript e React. O sistema mantém todos os dados existentes e corrige os problemas de autenticação e endpoints da versão anterior.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para APIs escaláveis
- **Prisma** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática para JavaScript
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
smart-tech-v2-refactored/
├── smart-tech-backend/          # API NestJS
│   ├── src/
│   │   ├── auth/               # Módulo de autenticação
│   │   ├── users/              # Módulo de usuários
│   │   ├── categories/         # Módulo de categorias
│   │   ├── products/           # Módulo de produtos
│   │   ├── orders/             # Módulo de pedidos
│   │   ├── prisma/             # Configuração Prisma
│   │   └── seed/               # Scripts de importação
│   ├── prisma/                 # Schema e migrações
│   └── scripts/                # Scripts utilitários
└── smart-tech-frontend/         # Aplicação React
    ├── src/
    │   ├── components/         # Componentes reutilizáveis
    │   ├── pages/              # Páginas da aplicação
    │   ├── hooks/              # Hooks personalizados
    │   ├── lib/                # Utilitários e configurações
    │   └── types/              # Definições de tipos
    └── public/                 # Arquivos estáticos
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm

### 1. Configuração do Backend

```bash
cd smart-tech-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações do banco
npm run db:migrate

# Importar dados existentes
npm run seed

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### 2. Configuração do Frontend

```bash
cd smart-tech-frontend

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev --host
```

## 🔧 Comandos Úteis

### Backend
```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot reload
npm run build             # Build para produção
npm run start:prod        # Executar build de produção

# Banco de dados
npm run db:migrate        # Executar migrações
npm run db:reset          # Resetar banco e reimportar dados
npm run db:studio         # Abrir Prisma Studio
npm run seed              # Importar dados do products.json

# Testes
npm run test              # Executar testes unitários
npm run test:e2e          # Executar testes end-to-end
```

### Frontend
```bash
# Desenvolvimento
pnpm run dev              # Servidor de desenvolvimento
pnpm run build            # Build para produção
pnpm run preview          # Preview do build

# Linting e formatação
pnpm run lint             # Verificar código
pnpm run lint:fix         # Corrigir problemas automaticamente
```

## 👤 Usuário Administrador Padrão

Para acessar o painel administrativo, use as seguintes credenciais:

- **Email:** bruno.meirelessilva90@gmail.com
- **Senha:** SenhaSegura123!
- **Role:** ADMIN

## 🔐 Autenticação e Autorização

O sistema implementa autenticação JWT com dois níveis de acesso:

- **USER**: Acesso às funcionalidades básicas da loja
- **ADMIN**: Acesso completo ao painel administrativo

### Endpoints Protegidos

- `/api/auth/profile` - Perfil do usuário (requer login)
- `/api/products` (POST, PUT, DELETE) - Gerenciar produtos (requer ADMIN)
- `/api/categories` (POST, PUT, DELETE) - Gerenciar categorias (requer ADMIN)
- `/api/users` - Gerenciar usuários (requer ADMIN)
- `/api/orders` - Visualizar todos os pedidos (requer ADMIN)

## 📊 Funcionalidades

### Loja (Frontend Público)
- [x] Catálogo de produtos com filtros
- [x] Busca por produtos
- [x] Visualização por categorias
- [x] Carrinho de compras
- [x] Sistema de login/registro
- [x] Perfil do usuário

### Painel Administrativo
- [x] Dashboard com estatísticas
- [x] Gerenciamento de produtos
- [x] Gerenciamento de categorias
- [x] Visualização de usuários
- [x] Acompanhamento de pedidos
- [x] Controle de acesso por roles

### API Backend
- [x] CRUD completo para produtos
- [x] CRUD completo para categorias
- [x] Sistema de autenticação JWT
- [x] Gerenciamento de usuários
- [x] Sistema de pedidos
- [x] Validação de dados
- [x] Tratamento de erros
- [x] CORS configurado

## 🗄️ Banco de Dados

### Modelos Principais

- **User**: Usuários do sistema (clientes e admins)
- **Category**: Categorias de produtos
- **Product**: Produtos do catálogo
- **ProductVariation**: Variações dos produtos
- **Order**: Pedidos realizados
- **OrderItem**: Itens dos pedidos

### Relacionamentos

- User 1:N Order
- Category 1:N Product
- Product 1:N ProductVariation
- Order 1:N OrderItem
- Product 1:N OrderItem

## 🔄 Migração de Dados

O sistema inclui um script automático que importa todos os dados do arquivo `products.json` original:

1. **Categorias**: Criadas automaticamente baseadas nos produtos
2. **Produtos**: Importados com preços, descrições e variações
3. **Usuário Admin**: Criado automaticamente com as credenciais padrão

## 🌐 URLs de Acesso

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Painel Admin**: http://localhost:5173/admin

### Endpoints da API
- `GET /api/products` - Listar produtos
- `GET /api/categories` - Listar categorias
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar usuário
- `GET /api/auth/profile` - Perfil do usuário

## 🐛 Problemas Corrigidos

### Da Versão Anterior
- ✅ Login de admin não funcionava
- ✅ Endpoints com erros
- ✅ Problemas de autenticação
- ✅ Estrutura de dados inconsistente

### Melhorias Implementadas
- ✅ Tipagem completa com TypeScript
- ✅ Validação robusta de dados
- ✅ Interface moderna e responsiva
- ✅ Arquitetura escalável
- ✅ Documentação completa
- ✅ Testes automatizados

## 📝 Próximos Passos

### Funcionalidades Futuras
- [ ] Sistema de pagamento
- [ ] Notificações em tempo real
- [ ] Upload de imagens para produtos
- [ ] Sistema de avaliações
- [ ] Relatórios avançados
- [ ] API de integração com marketplaces

### Melhorias Técnicas
- [ ] Cache com Redis
- [ ] Logs estruturados
- [ ] Monitoramento de performance
- [ ] Deploy automatizado
- [ ] Backup automático do banco

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Entre em contato via email: bruno.meirelessilva90@gmail.com

---

**Smart Tech V2** - E-commerce moderno e escalável 🚀

