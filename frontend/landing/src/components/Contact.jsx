import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const SHOP_UPLOAD_URL = import.meta.env.VITE_SHOP_UPLOAD_URL || 'http://localhost:5175/upload';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [stlFile, setStlFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const user = (() => {
    const value = localStorage.getItem("authUser");
    if (!value) return null;
    try { return JSON.parse(value); } catch { return null; }
  })();

  useEffect(() => {
    // Only update form data if user is logged in
    if (isLoggedIn && user && user.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [isLoggedIn, user, formData.email]);

  if (!isLoggedIn) {
    return (
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to start your project? Contact us today for a free consultation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Sign In Required</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  To upload your 3D design files and get a quote, please log in or create an account first.
                </p>
                <button
                  onClick={() => window.location.href = "/account"}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In / Register Now
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@ceylon3d.com</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+94 (0) 123 4567</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', formData);
    console.log('Selected file:', stlFile);

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!formData.message.trim()) {
      alert('Please enter a message');
      return;
    }
    if (!stlFile) {
      alert('Please select a file (.stl, .pdf, or .jpg) before submitting.');
      return;
    }

    const payload = new FormData();
    payload.append('file', stlFile);
    payload.append('name', formData.name.trim());
    payload.append('email', formData.email.trim());
    payload.append('phone', formData.phone.trim());
    payload.append('message', formData.message.trim());

    try {
      setIsUploading(true);
      console.log('Uploading to:', `${API_BASE_URL}/api/uploads/stl`);
      
      // Get token from localStorage for authentication
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);

      const response = await fetch(`${API_BASE_URL}/api/uploads/stl`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: payload,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || `Upload failed with status ${response.status}`);
      }

      // Parse response data
      const data = await response.json();
      console.log('Upload successful:', data);
      
      // Set success state to show confirmation page
      setUploadData(data);
      setUploadSuccess(true);
      
      // Auto-redirect to shop upload page after 4 seconds
      setTimeout(() => {
        window.location.href = SHOP_UPLOAD_URL;
      }, 4000);
      
      setFormData({ name: '', email: '', phone: '', message: '' });
      setStlFile(null);
    } catch (error) {
      const msg = error.message || 'STL upload failed. Please make sure the backend is running and try again.';
      console.error('Upload error:', msg);
      alert(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setStlFile(file);
  };

  // Success Page
  if (uploadSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-200/60 animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Successful! 🎉</h1>
            <p className="text-gray-600 text-lg">
              Your 3D design file has been received. Our team will review it and contact you soon.
            </p>
          </div>

          {/* Upload Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left space-y-3 shadow-sm">
            <h3 className="font-semibold text-gray-900 text-lg">Upload Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Contact Email:</span>
                <span className="font-medium text-gray-900">{uploadData?.email || formData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">File Type:</span>
                <span className="font-medium text-gray-900">{stlFile ? stlFile.name.split('.').pop().toUpperCase() : 'STL'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="font-medium text-yellow-700">Pending Review</span>
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left">
            <h4 className="font-semibold text-blue-900 mb-3">What's Next?</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 mt-0.5">1.</span>
                <span>Our team will review your design file</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 mt-0.5">2.</span>
                <span>We'll calculate the printing cost and material usage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 mt-0.5">3.</span>
                <span>You'll receive a quote via email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 mt-0.5">4.</span>
                <span>Once approved, we'll start your 3D print!</span>
              </li>
            </ul>
          </div>

          {/* Redirect Message */}
          <div className="text-gray-600 text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin">⏳</div>
              <span>Redirecting to shop in a few seconds...</span>
            </div>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={() => window.location.href = SHOP_UPLOAD_URL}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
          >
            Go to Shop Upload →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl mb-4 text-gray-900">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to start your project? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-900 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="stlFileInput" className="block text-gray-900 mb-2">
                  STL File
                </label>
                <input
                  type="file"
                  id="stlFileInput"
                  name="stlFile"
                  accept=".stl,.pdf,.jpg,.jpeg,model/stl,application/pdf,image/jpeg"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                {stlFile && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {stlFile.name}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isUploading || !formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !stlFile}
                className={`w-full sm:w-auto px-8 py-4 rounded-full text-white text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isUploading || !formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !stlFile
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 hover:from-pink-600 hover:to-purple-600 active:scale-95 hover:shadow-2xl hover:shadow-purple-500/30'
                }`}
                title={!formData.name.trim() ? 'Please fill in your name' : !formData.email.trim() ? 'Please fill in your email' : !formData.message.trim() ? 'Please fill in the message' : !stlFile ? 'Please select a file' : 'Submit form'}
              >
                {isUploading ? 'Uploading...' : 'Upload STL & Send'}
                <Send className="w-5 h-5" />
              </button>

              {/* Validation hints */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className={formData.name.trim() ? 'text-green-600' : 'text-gray-500'}>
                  {formData.name.trim() ? '✓ Name' : '○ Name (required)'}
                </p>
                <p className={formData.email.trim() ? 'text-green-600' : 'text-gray-500'}>
                  {formData.email.trim() ? '✓ Email' : '○ Email (required)'}
                </p>
                <p className={formData.message.trim() ? 'text-green-600' : 'text-gray-500'}>
                  {formData.message.trim() ? '✓ Message' : '○ Message (required)'}
                </p>
                <p className={stlFile ? 'text-green-600' : 'text-gray-500'}>
                  {stlFile ? '✓ File selected' : '○ File (required)'}
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Email</h3>
              <p className="text-gray-700">contact@ceylon3d.com</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Phone</h3>
              <p className="text-gray-700">+1 (555) 123-4567</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Location</h3>
              <p className="text-gray-700">123 Innovation Drive<br />Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center text-gray-600 border-t border-gray-200 pt-8">
        <p>© 2026 Ceylon3D. All rights reserved.</p>
      </div>
    </section>
  );
}
