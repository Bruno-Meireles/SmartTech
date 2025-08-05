import { useEffect } from 'react';

interface Review {
  id: string;
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  headline?: string;
}

interface ReviewSchemaProps {
  productId: string;
  productName: string;
  reviews: Review[];
}

const ReviewSchema: React.FC<ReviewSchemaProps> = ({ productId, productName, reviews }) => {
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const structuredData = reviews.map(review => ({
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Product",
        "name": productName,
        "url": `https://smarttech.com.br/produto/${productId}`
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      "headline": review.headline || review.reviewBody.substring(0, 50) + "...",
      "datePublished": review.datePublished,
      "publisher": {
        "@type": "Organization",
        "name": "Smart Tech"
      }
    }));

    // Remove existing review schemas
    const existingScripts = document.querySelectorAll('script[data-review-schema]');
    existingScripts.forEach(script => script.remove());

    // Add new review schemas
    structuredData.forEach((data, index) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-review-schema', `review-${index}`);
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      const scriptsToRemove = document.querySelectorAll('script[data-review-schema]');
      scriptsToRemove.forEach(script => script.remove());
    };
  }, [productId, productName, reviews]);

  return null;
};

export default ReviewSchema;

