import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react'; 
import FullPageSlider from '../Slider/FullPageSlider';
import ProductList from './ProductList';

const Dashboard = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <FullPageSlider />
      <ProductList />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-600 shadow-lg z-50 transition"
        >
             <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Dashboard;
