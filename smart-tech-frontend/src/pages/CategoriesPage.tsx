import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Zap, Shield, Headphones, Cable, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Category } from '../types';
import api from '../lib/api';

const categoryIcons: { [key: string]: any } = {
  'Carregadores': Zap,
  'Capas': Shield,
  'Fones': Headphones,
  'Cabos': Cable,
  'Câmeras': Smartphone,
  'default': Package,
};

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando categorias...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Explore Nossas
            <span className="block text-cyan-300">Categorias</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Descubra uma ampla variedade de acessórios premium para seu smartphone. 
            Cada categoria foi cuidadosamente curada para oferecer o melhor em qualidade e design.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || categoryIcons.default;
              
              return (
                <div
                  key={category.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-50" />
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {category.description || `Explore nossa coleção completa de ${category.name.toLowerCase()} com qualidade premium e designs inovadores.`}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="w-4 h-4 mr-2" />
                        <span>{category.products?.length || '10+'} produtos</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Disponível
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className="w-full group-hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.name);
                      }}
                    >
                      Explorar {category.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Não encontrou o que procura?
              </h2>
              <p className="text-gray-600 mb-6">
                Entre em contato conosco e nossa equipe especializada te ajudará a encontrar 
                o acessório perfeito para seu dispositivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Todos os Produtos
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    const footer = document.querySelector('footer');
                    if (footer) {
                      footer.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

