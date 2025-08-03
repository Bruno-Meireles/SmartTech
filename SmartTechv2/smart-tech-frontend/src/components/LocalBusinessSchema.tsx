import { useEffect } from 'react';

interface BusinessLocation {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  openingHours?: string[];
}

interface LocalBusinessSchemaProps {
  locations: BusinessLocation[];
  businessType?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ 
  locations, 
  businessType = "ElectronicsStore" 
}) => {
  useEffect(() => {
    if (!locations || locations.length === 0) return;

    const structuredData = locations.map(location => ({
      "@context": "https://schema.org",
      "@type": businessType,
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": location.address.streetAddress,
        "addressLocality": location.address.addressLocality,
        "addressRegion": location.address.addressRegion,
        "postalCode": location.address.postalCode,
        "addressCountry": location.address.addressCountry
      },
      "geo": location.geo ? {
        "@type": "GeoCoordinates",
        "latitude": location.geo.latitude,
        "longitude": location.geo.longitude
      } : undefined,
      "telephone": location.telephone,
      "openingHours": location.openingHours,
      "url": "https://smarttech.com.br",
      "logo": "https://smarttech.com.br/logo.png",
      "image": "https://smarttech.com.br/loja-foto.jpg",
      "description": "Loja física da Smart Tech especializada em acessórios para celular",
      "priceRange": "$$",
      "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "PIX"],
      "currenciesAccepted": "BRL",
      "sameAs": [
        "https://www.facebook.com/smarttechbr",
        "https://www.instagram.com/smarttechbr"
      ]
    }));

    // Remove existing local business schemas
    const existingScripts = document.querySelectorAll('script[data-local-business-schema]');
    existingScripts.forEach(script => script.remove());

    // Add new local business schemas
    structuredData.forEach((data, index) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-local-business-schema', `location-${index}`);
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      const scriptsToRemove = document.querySelectorAll('script[data-local-business-schema]');
      scriptsToRemove.forEach(script => script.remove());
    };
  }, [locations, businessType]);

  return null;
};

export default LocalBusinessSchema;

