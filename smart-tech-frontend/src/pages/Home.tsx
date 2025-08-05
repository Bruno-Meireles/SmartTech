import Hero from '../components/Hero';
import { ProductCarousel } from '../components/ProductCarousel';
import ProductsSection from '../components/ProductsSection';
import Categories from '../components/Categories';
import Footer from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Carrossel de produtos em destaque */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra nossa seleção especial de produtos com as melhores tecnologias e designs inovadores
            </p>
          </div>
          <ProductCarousel />
        </div>
      </section>

      <ProductsSection />
      <Categories />
      <Footer />
    </div>
  );
};

