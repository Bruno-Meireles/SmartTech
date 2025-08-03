import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import Categories from '../components/Categories';
import Footer from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProductsSection />
      <Categories />
      <Footer />
    </div>
  );
};

