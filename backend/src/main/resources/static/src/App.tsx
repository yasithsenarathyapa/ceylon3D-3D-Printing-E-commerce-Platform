import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Hero />
      <Portfolio />
      <Services />
      <About />
      <Contact />
    </div>
  );
}
