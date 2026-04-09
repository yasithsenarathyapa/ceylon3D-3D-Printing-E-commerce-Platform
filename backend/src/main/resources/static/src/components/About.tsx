import { Award, Users, Clock, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Award, value: '500+', label: 'Projects Completed' },
  { icon: Users, value: '200+', label: 'Happy Clients' },
  { icon: Clock, value: '5+', label: 'Years Experience' },
  { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' }
];

export function About() {
  return (
    <section id="about" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl mb-6 text-white">Why Choose Us</h2>
            <p className="text-xl text-white/60 mb-6">
              We're a team of passionate engineers and designers dedicated to pushing the boundaries 
              of what's possible with 3D printing technology.
            </p>
            <p className="text-white/60 mb-8">
              With state-of-the-art equipment and years of experience, we deliver exceptional quality 
              and precision for every project. From concept to completion, we work closely with our 
              clients to ensure their vision becomes reality.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-white">Advanced Technology</h3>
                  <p className="text-white/60">Latest 3D printing equipment and materials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-white">Expert Team</h3>
                  <p className="text-white/60">Skilled professionals with extensive experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-white">Customer Focus</h3>
                  <p className="text-white/60">Personalized service and support throughout</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-[#2d2d44] rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 text-center border border-white/10 hover:scale-105 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl text-purple-400 mb-2">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
