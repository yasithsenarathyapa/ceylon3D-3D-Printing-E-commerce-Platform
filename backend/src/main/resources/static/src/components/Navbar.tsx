import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 transform rotate-45 rounded-lg blur-sm"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 transform rotate-45 rounded-lg"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Ceylon3D</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="text-white/70 hover:text-white transition-colors relative group">
              Solutions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-white/70 hover:text-white transition-colors relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => scrollToSection('about')} className="text-white/70 hover:text-white transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Solutions
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              Pricing
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-2">
              Sign up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
