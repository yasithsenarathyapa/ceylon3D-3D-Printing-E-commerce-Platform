import { Box, Zap, Settings, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Box,
    title: 'Rapid Prototyping',
    description: 'Turn your concepts into physical prototypes within days. Perfect for product development and design validation.',
    features: ['Fast turnaround', 'Multiple materials', 'Iterative refinement']
  },
  {
    icon: Settings,
    title: 'Custom Manufacturing',
    description: 'Small to medium batch production with high precision. Ideal for specialized parts and limited runs.',
    features: ['Quality control', 'Material variety', 'Production scaling']
  },
  {
    icon: Zap,
    title: 'Design Services',
    description: 'Expert CAD modeling and design optimization for 3D printing. We bring your sketches to life.',
    features: ['3D modeling', 'Design optimization', 'File preparation']
  },
  {
    icon: CheckCircle,
    title: 'Consultation',
    description: 'Technical guidance on materials, processes, and feasibility. We help you make informed decisions.',
    features: ['Material selection', 'Cost estimation', 'Technical advice']
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-[#2d2d44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-white">Our Services</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Comprehensive 3D printing solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-[#1a1a2e] rounded-2xl p-8 hover:bg-[#23233d] hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-500/30 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl mb-3 text-white">{service.title}</h3>
                <p className="text-white/60 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/70">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
