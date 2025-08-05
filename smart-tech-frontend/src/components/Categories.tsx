import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Cable } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Zap,
      title: "Carregadores",
      description: "Sem fio, rápidos e portáteis",
      count: "15+ produtos",
      color: "blue",
      categoryName: "Carregadores",
    },
    {
      icon: Shield,
      title: "Capas & Proteção",
      description: "Proteção total com estilo",
      count: "25+ produtos",
      color: "green",
      categoryName: "Capas",
    },
    {
      icon: Cable,
      title: "Cabos & Adaptadores",
      description: "Conectividade premium",
      count: "12+ produtos",
      color: "purple",
      categoryName: "Cabos",
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore por <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Categoria</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre exatamente o que precisa para seu dispositivo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.title}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => handleCategoryClick(category.categoryName)}
              >
                {/* Background effect */}
                <div 
                  className={`absolute top-0 right-0 w-32 h-32 bg-${category.color}-100 rounded-full blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:bg-${category.color}-200`}
                ></div>
                
                <div className="relative z-10">
                  <div 
                    className={`w-16 h-16 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      {category.count}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.categoryName);
                      }}
                    >
                      Ver Tudo
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
            onClick={handleViewAllProducts}
          >
            Ver Todos os Produtos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;

