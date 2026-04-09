import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const SHOP_URL = import.meta.env.VITE_SHOP_URL || 'http://localhost:5175/browse';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    if (id === 'shop' || id === 'ecommerce') {
      window.location.href = SHOP_URL;
      setIsMenuOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (<nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-white/95'}`}
      style={{ transform: 'none', transformOrigin: 'center', backfaceVisibility: 'hidden' }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 transform rotate-45 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">Ceylone 3D</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('shop')} className="text-gray-700 hover:text-gray-900 transition-colors">
              Shop
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-gray-900 transition-colors">
              About Us
            </button>
            <button
              onClick={() => { setSignedUp(true); scrollToSection('contact'); }}
              className={`${signedUp ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'} px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg`}
            >
              Sign up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (<div className={`md:hidden border-t border-gray-200 bg-white`}>
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('shop')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
              Shop
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors">
              About Us
            </button>
            <button
              onClick={() => { setSignedUp(true); scrollToSection('contact'); }}
              className={`block w-full text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
            >
              Sign up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
          40% { opacity: 0.35; }
          100% { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }

        .animate-sheen {
          animation: sheen 4s linear infinite;
        }
      `}</style>
    </nav>
  );
}
