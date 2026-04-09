import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import photo1 from '../3Dphotos/3d1.png';
import photo2 from '../3Dphotos/3d2.png';
import photo3 from '../3Dphotos/3d3.png';
import photo4 from '../3Dphotos/3d4.png';
import photo5 from '../3Dphotos/3d5.png';

const photos = [photo1, photo2, photo3, photo4, photo5];

const SHOP_URL = import.meta.env.VITE_SHOP_URL || 'http://localhost:5175/browse';
const SHOP_UPLOAD_URL = import.meta.env.VITE_SHOP_UPLOAD_URL || 'http://localhost:5175/upload';

export function Hero() {
  const goToShopUpload = () => {
    window.location.href = SHOP_UPLOAD_URL;
  };
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (<section id="home" className="relative min-h-screen flex items-center pt-16 bg-white overflow-hidden">
      {/* Floating 3D Objects */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-80 animate-float">
        <ImageWithFallback
          src={photos[0]}
          alt="3D Object 1"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute top-32 right-20 w-40 h-40 opacity-70 animate-float-delayed">
        <ImageWithFallback
          src={photos[1]}
          alt="3D Shape 2"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute bottom-32 left-20 w-28 h-28 opacity-60 animate-float">
        <ImageWithFallback
          src={photos[2]}
          alt="Crystal 3"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute bottom-40 right-32 w-36 h-36 opacity-75 animate-float-delayed">
        <ImageWithFallback
          src={photos[3]}
          alt="Metallic Shape 4"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute top-1/2 left-1/4 w-24 h-24 opacity-50 animate-float">
        <ImageWithFallback
          src={photos[4]}
          alt="3D Object 5"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-gray-900 mb-12 leading-tight">
            Where ideas become tangible.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={goToShopUpload}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-lg group shadow-lg hover:shadow-2xl hover:shadow-purple-500/30"
            >
              Send your STL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.location.href = SHOP_URL}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center gap-2 group shadow-lg hover:shadow-2xl hover:shadow-purple-500/30"
            >
              Buy Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
