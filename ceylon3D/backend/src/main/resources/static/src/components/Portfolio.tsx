import { ImageWithFallback } from './figma/ImageWithFallback';

const portfolioItems = [
  {
    id: 1,
    title: 'Industrial Prototype',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1603974739172-4ad6a3117e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMHByaW50ZXIlMjB3b3JraW5nfGVufDF8fHx8MTc3MDI1MDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Precision mechanical parts for industrial applications'
  },
  {
    id: 2,
    title: 'Custom Design Model',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1757038490165-64d8a6635d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMHByaW50ZWQlMjBkZXNpZ24lMjBtb2RlbHxlbnwxfHx8fDE3NzAyOTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Artistic 3D printed sculptures and models'
  },
  {
    id: 3,
    title: 'Functional Prototype',
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1741848137437-56fb14b7ba87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMHByaW50ZWQlMjBvYmplY3QlMjBwcm90b3R5cGV8ZW58MXx8fHwxNzcwMjE2MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Working prototypes for product development'
  },
  {
    id: 4,
    title: 'Industrial Components',
    category: 'Manufacturing',
    image: 'https://images.unsplash.com/photo-1603974739172-4ad6a3117e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwM0QlMjBwcmludGluZ3xlbnwxfHx8fDE3NzAyOTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-precision industrial manufacturing solutions'
  },
  {
    id: 5,
    title: 'Workspace Innovation',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1758762641372-e3b52bf061d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MDE5NzI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Cutting-edge technology solutions for modern workspaces'
  },
  {
    id: 6,
    title: 'Custom Engineering',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1703221561813-cdaa308cf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMHByaW50aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzAyMTcwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Tailored engineering solutions for complex projects'
  }
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-white">Our Portfolio</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Explore our collection of successful 3D printing projects across various industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#2d2d44] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2 text-white">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
