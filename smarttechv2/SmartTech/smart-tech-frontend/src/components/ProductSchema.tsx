import { useEffect } from 'react';

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string[];
    price: number;
    currency?: string;
    availability?: string;
    condition?: string;
    brand?: string;
    category?: string;
    sku?: string;
    gtin?: string;
    mpn?: string;
    reviews?: {
      rating: number;
      reviewCount: number;
    };
    seller?: {
      name: string;
      url?: string;
    };
  };
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "sku": product.sku || product.id,
      "mpn": product.mpn || product.id,
      "gtin": product.gtin,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Smart Tech"
      },
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "price": product.price.toFixed(2),
        "priceCurrency": product.currency || "BRL",
        "availability": `https://schema.org/${product.availability || 'InStock'}`,
        "itemCondition": `https://schema.org/${product.condition || 'NewCondition'}`,
        "seller": {
          "@type": "Organization",
          "name": product.seller?.name || "Smart Tech",
          "url": product.seller?.url || "https://smarttech.com.br"
        },
        "url": `https://smarttech.com.br/produto/${product.id}`,
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }
    };

    // Add aggregateRating if reviews exist
    if (product.reviews && product.reviews.reviewCount > 0) {
      structuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": product.reviews.rating.toString(),
        "reviewCount": product.reviews.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    // Remove existing product schema
    const existingScript = document.querySelector('script[data-product-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new product schema
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-product-schema', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-product-schema]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product]);

  return null;
};

export default ProductSchema;

