import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const {
      title = 'Smart Tech - Acessórios para Celular | Fones, Capas e Carregadores',
      description = 'Smart Tech - Sua loja online de acessórios para celular com os melhores preços. Fones de ouvido, capas, carregadores, películas e muito mais. Entrega rápida e segura!',
      keywords = 'acessórios para celular, fones de ouvido, capas de celular, carregadores, películas, smart tech, e-commerce, loja online, acessórios smartphone',
      image = 'https://smarttech.com.br/og-image.jpg',
      url = window.location.href,
      type = 'website',
      structuredData,
      noIndex = false
    } = config;

    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[data-use-seo-structured-data]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-use-seo-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[data-use-seo-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [config]);
};

// Hook específico para páginas de produto
export const useProductSEO = (product: any) => {
  const seoConfig = {
    title: `${product.name} - Smart Tech | Acessórios para Celular`,
    description: `${product.description} Compre na Smart Tech com os melhores preços e entrega rápida. ${product.name} com qualidade garantida.`,
    keywords: `${product.name}, ${product.category}, acessórios celular, smart tech, ${product.brand || ''}`,
    image: product.images?.[0] || 'https://smarttech.com.br/og-image.jpg',
    url: `https://smarttech.com.br/produto/${product.id}`,
    type: 'product',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images || [],
      "sku": product.sku || product.id,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Smart Tech"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price?.toFixed(2),
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Smart Tech"
        }
      }
    }
  };

  useSEO(seoConfig);
};

// Hook específico para páginas de categoria
export const useCategorySEO = (category: any) => {
  const seoConfig = {
    title: `${category.name} - Smart Tech | Acessórios para Celular`,
    description: `Encontre os melhores ${category.name.toLowerCase()} na Smart Tech. Produtos de qualidade com os melhores preços e entrega rápida.`,
    keywords: `${category.name}, acessórios celular, smart tech, ${category.slug}`,
    url: `https://smarttech.com.br/categoria/${category.slug}`,
    type: 'website'
  };

  useSEO(seoConfig);
};

