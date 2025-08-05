import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from '../types';
import api from '../lib/api';

export const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products');
        // Pegar produtos com imagem para o carrossel
        const productsWithImages = response.data.filter((product: Product) => product.imageUrl);
        setProducts(productsWithImages.slice(0, 6)); // Máximo 6 produtos no carrossel
      } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Auto-play do carrossel
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-lg">Carregando produtos em destaque...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-lg">Nenhum produto em destaque disponível</div>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-2xl overflow-hidden group">
      {/* Background com imagem do produto */}
      <div className="absolute inset-0">
        <img
          src={currentProduct.imageUrl}
          alt={currentProduct.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Informações do produto */}
          <div className="flex-1 max-w-lg">
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-100 border border-cyan-400/30">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Produto em Destaque
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
              {currentProduct.name}
            </h2>
            
            {currentProduct.description && (
              <p className="text-blue-100 mb-4 line-clamp-2">
                {currentProduct.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-cyan-300">
                {formatPrice(currentProduct.price)}
              </span>
              {currentProduct.category && (
                <span className="text-blue-200 text-sm">
                  {currentProduct.category.name}
                </span>
              )}
            </div>

            <Button 
              size="lg" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white border-0"
            >
              Ver Produto
            </Button>
          </div>

          {/* Imagem do produto */}
          <div className="hidden md:block flex-shrink-0 ml-8">
            <div className="w-64 h-64 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controles de navegação */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-cyan-400 w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

