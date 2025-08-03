# Documentação de SEO e Otimizações - SmartTech

## Visão Geral

Este documento detalha todas as implementações de SEO, structured data e otimizações realizadas no projeto SmartTech para torná-lo 100% funcional para vendas online e marketplaces.

## Implementações Realizadas

### 1. SEO Básico e Meta Tags

#### 1.1 Meta Tags Otimizadas no index.html

Foram implementadas meta tags completas e otimizadas para SEO:

- **Title**: Otimizado com palavras-chave principais
- **Description**: Descrição atrativa e informativa com call-to-action
- **Keywords**: Palavras-chave relevantes para o nicho
- **Author**: Identificação da marca
- **Robots**: Configuração para indexação
- **Canonical**: URL canônica para evitar conteúdo duplicado

#### 1.2 Open Graph Tags

Implementação completa de Open Graph para redes sociais:

- `og:type`: Tipo de conteúdo (website/product)
- `og:url`: URL da página
- `og:title`: Título otimizado
- `og:description`: Descrição para compartilhamento
- `og:image`: Imagem de preview
- `og:site_name`: Nome do site
- `og:locale`: Localização (pt_BR)

#### 1.3 Twitter Cards

Tags específicas para Twitter:

- `twitter:card`: Tipo de card (summary_large_image)
- `twitter:title`: Título para Twitter
- `twitter:description`: Descrição para Twitter
- `twitter:image`: Imagem para Twitter
- `twitter:url`: URL para Twitter

### 2. Structured Data (Schema.org)

#### 2.1 Organization Schema

Implementado no index.html para identificar a empresa:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Smart Tech",
  "url": "https://smarttech.com.br",
  "logo": "https://smarttech.com.br/logo.png",
  "description": "Loja online especializada em acessórios para celular",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-99999-9999",
    "contactType": "customer service"
  }
}
```

#### 2.2 WebSite Schema

Schema para funcionalidade de busca:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Smart Tech",
  "url": "https://smarttech.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://smarttech.com.br/buscar?q={search_term_string}"
  }
}
```

### 3. Componentes React para SEO Dinâmico

#### 3.1 SEOHead Component

Componente para gerenciar meta tags dinamicamente:

**Localização**: `/src/components/SEOHead.tsx`

**Funcionalidades**:
- Atualização dinâmica de title
- Gerenciamento de meta tags
- Atualização de Open Graph e Twitter Cards
- Gerenciamento de canonical URLs
- Inserção de structured data dinâmico

#### 3.2 ProductSchema Component

Componente para structured data de produtos:

**Localização**: `/src/components/ProductSchema.tsx`

**Schema implementado**:
- Product schema completo
- Offers com preço e disponibilidade
- Brand information
- AggregateRating (quando há reviews)
- Seller information

#### 3.3 BreadcrumbSchema Component

Componente para navegação estruturada:

**Localização**: `/src/components/BreadcrumbSchema.tsx`

**Funcionalidades**:
- BreadcrumbList schema
- Hierarquia de navegação
- Posicionamento sequencial

#### 3.4 ReviewSchema Component

Componente para reviews de produtos:

**Localização**: `/src/components/ReviewSchema.tsx`

**Schema implementado**:
- Review schema individual
- Rating information
- Author details
- Review body e headline

#### 3.5 LocalBusinessSchema Component

Componente para lojas físicas:

**Localização**: `/src/components/LocalBusinessSchema.tsx`

**Funcionalidades**:
- LocalBusiness/ElectronicsStore schema
- Endereço e geolocalização
- Horários de funcionamento
- Métodos de pagamento aceitos

### 4. Hooks Personalizados

#### 4.1 useSEO Hook

Hook principal para gerenciamento de SEO:

**Localização**: `/src/hooks/useSEO.tsx`

**Funcionalidades**:
- Configuração completa de SEO
- Meta tags dinâmicas
- Structured data
- Controle de indexação

#### 4.2 useProductSEO Hook

Hook específico para páginas de produto:

**Funcionalidades**:
- SEO otimizado para produtos
- Product schema automático
- Meta tags baseadas no produto

#### 4.3 useCategorySEO Hook

Hook específico para páginas de categoria:

**Funcionalidades**:
- SEO otimizado para categorias
- Meta tags baseadas na categoria

### 5. Arquivos de Configuração SEO

#### 5.1 robots.txt

**Localização**: `/public/robots.txt`

**Configurações**:
- Permissões para crawlers
- Bloqueio de áreas administrativas
- Localização do sitemap
- Crawl delay configurado

#### 5.2 Gerador de Sitemap

**Localização**: `/src/utils/sitemapGenerator.ts`

**Funcionalidades**:
- Geração automática de sitemap.xml
- Páginas estáticas
- Produtos dinâmicos
- Categorias
- Configuração de prioridades e frequências

## Como Usar

### Para Páginas Estáticas

```tsx
import { useSEO } from '../hooks/useSEO';

const HomePage = () => {
  useSEO({
    title: 'Smart Tech - Página Inicial',
    description: 'Descrição da página',
    keywords: 'palavras-chave específicas'
  });

  return <div>Conteúdo da página</div>;
};
```

### Para Páginas de Produto

```tsx
import { useProductSEO } from '../hooks/useSEO';
import ProductSchema from '../components/ProductSchema';

const ProductPage = ({ product }) => {
  useProductSEO(product);

  return (
    <div>
      <ProductSchema product={product} />
      {/* Conteúdo do produto */}
    </div>
  );
};
```

### Para Breadcrumbs

```tsx
import BreadcrumbSchema from '../components/BreadcrumbSchema';

const breadcrumbItems = [
  { name: 'Início', url: 'https://smarttech.com.br' },
  { name: 'Produtos', url: 'https://smarttech.com.br/produtos' },
  { name: 'Fones de Ouvido', url: 'https://smarttech.com.br/categoria/fones' }
];

return <BreadcrumbSchema items={breadcrumbItems} />;
```

## Benefícios para Marketplaces

### Google Shopping
- Product schema completo
- Preços e disponibilidade estruturados
- Informações de marca e categoria

### Facebook/Instagram Shopping
- Open Graph otimizado
- Imagens de produto estruturadas
- Informações de preço

### Amazon e Outros Marketplaces
- Structured data padronizado
- Meta tags otimizadas
- Informações de produto completas

## Validação e Testes

### Ferramentas Recomendadas

1. **Google Rich Results Test**: Para validar structured data
2. **Facebook Sharing Debugger**: Para testar Open Graph
3. **Twitter Card Validator**: Para validar Twitter Cards
4. **Google PageSpeed Insights**: Para performance
5. **Google Search Console**: Para monitoramento

### URLs de Teste

- Rich Results Test: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Validator: https://cards-dev.twitter.com/validator

## Próximos Passos

### Implementações Futuras

1. **AMP (Accelerated Mobile Pages)**: Para melhor performance mobile
2. **PWA (Progressive Web App)**: Para experiência app-like
3. **Core Web Vitals**: Otimizações específicas de performance
4. **International SEO**: Para expansão internacional

### Monitoramento Contínuo

1. Configurar Google Search Console
2. Implementar Google Analytics 4
3. Monitorar Core Web Vitals
4. Acompanhar rankings de palavras-chave

## Conclusão

Todas as implementações de SEO foram realizadas seguindo as melhores práticas atuais e guidelines do Google. O projeto SmartTech está agora otimizado para:

- Melhor ranking nos motores de busca
- Integração com marketplaces
- Compartilhamento em redes sociais
- Experiência do usuário aprimorada
- Conversões otimizadas

O sistema é escalável e permite fácil manutenção e expansão das funcionalidades de SEO conforme necessário.

