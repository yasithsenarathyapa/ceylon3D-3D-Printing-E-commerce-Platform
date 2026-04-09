import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-[#2d2d44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-white">Get In Touch</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Ready to start your project? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#1a1a2e] text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#1a1a2e] text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-white mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#1a1a2e] text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#1a1a2e] text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full hover:scale-105 hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/30"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-white">Email</h3>
              <p className="text-white/60">contact@ceylon3d.com</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-white">Phone</h3>
              <p className="text-white/60">+1 (555) 123-4567</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-white">Location</h3>
              <p className="text-white/60">123 Innovation Drive<br />Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center text-white/60 border-t border-white/10 pt-8">
        <p>© 2026 Ceylon3D. All rights reserved.</p>
      </div>
    </section>
  );
}
