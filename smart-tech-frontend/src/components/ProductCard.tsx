import { useState } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<string>('');

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariation || undefined);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {/* Imagem do produto */}
      {product.imageUrl && (
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <CardHeader className={product.imageUrl ? "pt-4" : ""}>
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        {product.category && (
          <p className="text-sm text-gray-500">{product.category.name}</p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {product.description}
          </p>
        )}
        
        <div className="text-2xl font-bold text-blue-600 mb-4">
          {formatPrice(product.price)}
        </div>

        {product.variations && product.variations.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Variações disponíveis:
            </label>
            <Select value={selectedVariation} onValueChange={setSelectedVariation}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma variação" />
              </SelectTrigger>
              <SelectContent>
                {product.variations.map((variation) => (
                  <SelectItem key={variation.id} value={variation.name}>
                    {variation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={product.variations && product.variations.length > 0 && !selectedVariation}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

