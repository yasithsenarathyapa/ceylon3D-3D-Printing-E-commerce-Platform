import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0a0a0f]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-blue-900/20 animate-gradient"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] animate-pulse-slower"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse-slowest"></div>

      {/* Floating 3D Objects with enhanced effects */}
      <div 
        className="absolute top-20 left-10 w-32 h-32 opacity-80 animate-float"
        style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-pink-500/50 blur-xl rounded-full"></div>
          <ImageWithFallback
            src="/src/3d1/photos.png"
            alt="3D Object"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div 
        className="absolute top-32 right-20 w-40 h-40 opacity-70 animate-float-delayed"
        style={{ transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)` }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-500/50 blur-xl rounded-full"></div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1763259502799-df7c1f865695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcmlkZXNjZW50JTIwZ2VvbWV0cmljJTIwc2hhcGV8ZW58MXx8fHwxNzcwMjk1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="3D Shape"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div 
        className="absolute bottom-32 left-20 w-28 h-28 opacity-60 animate-float"
        style={{ transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)` }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/50 to-purple-500/50 blur-xl rounded-full"></div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1621544170639-fb0189e518ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xvZ3JhcGhpYyUyMGNyeXN0YWwlMjAzRHxlbnwxfHx8fDE3NzAyOTU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Crystal"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div 
        className="absolute bottom-40 right-32 w-36 h-36 opacity-75 animate-float-delayed"
        style={{ transform: `translate(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px)` }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-blue-500/50 blur-xl rounded-full"></div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759259738806-b1167248fcd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbWUlMjBtZXRhbGxpYyUyMDNEJTIwc2hhcGV8ZW58MXx8fHwxNzcwMjk1NDgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Metallic Shape"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-1/4 right-1/4 animate-float-slow">
        <Sparkles className="w-8 h-8 text-purple-400/40" />
      </div>
      <div className="absolute bottom-1/3 left-1/3 animate-float-delayed">
        <Zap className="w-6 h-6 text-pink-400/40" />
      </div>
      <div className="absolute top-2/3 right-1/3 animate-float-slow">
        <Star className="w-7 h-7 text-blue-400/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/80">Powered by cutting-edge 3D technology</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 leading-tight animate-fade-in-up">
            <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Where ideas
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              become tangible.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Transform your concepts into reality with precision 3D printing. 
            <span className="text-white/80"> Fast, reliable, and innovative solutions for every project.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
            <button 
              onClick={scrollToContact}
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden bg-[length:200%_100%] hover:bg-[position:100%_0] animate-gradient-x"
            >
              <span className="relative z-10 flex items-center gap-2">
                Send your STL
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={scrollToPortfolio}
              className="group relative bg-white/5 backdrop-blur-md border-2 border-white/20 text-white px-8 py-4 rounded-full hover:scale-105 hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-white/10"
            >
              BUY NOW
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">500+</div>
              <div className="text-sm text-white/60">Projects Done</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-1">24/7</div>
              <div className="text-sm text-white/60">Support</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">99%</div>
              <div className="text-sm text-white/60">Satisfaction</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">Fast</div>
              <div className="text-sm text-white/60">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
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

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.08);
          }
        }

        @keyframes pulse-slowest {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
        }

        .animate-pulse-slowest {
          animation: pulse-slowest 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}
