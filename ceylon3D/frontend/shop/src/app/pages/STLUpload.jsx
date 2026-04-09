import { ArrowLeft, CheckCircle, FileText, Loader2, Package, Phone, Mail, Upload, User, X, MapPin } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { API_BASE_URL } from '../lib/config';

const STL_UPLOAD_URL = API_BASE_URL.endsWith('/api')
  ? `${API_BASE_URL}/uploads/stl`
  : `${API_BASE_URL}/api/uploads/stl`;

const MATERIALS = [
  { id: 'PLA', label: 'PLA', desc: 'Standard, great finish', icon: '🟢' },
  { id: 'ABS', label: 'ABS', desc: 'Strong & heat resistant', icon: '🔴' },
  { id: 'PETG', label: 'PETG', desc: 'Durable & flexible', icon: '🔵' },
  { id: 'RESIN', label: 'Resin', desc: 'Ultra-detailed prints', icon: '🟡' },
];

const STEPS = ['Upload File', 'Your Details', 'Review & Submit'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s()\-]{7,20}$/;

export function STLUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerEmail2, setCustomerEmail2] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Success state
  const [orderResult, setOrderResult] = useState(null);

  // Auto-populate user info on load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.fullName) setCustomerName(user.fullName);
        if (user.email) setCustomerEmail(user.email);
        if (user.phone) setCustomerPhone(user.phone);
        if (user.address) setCustomerAddress(user.address || '');
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
    }
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const isAllowedFile = (file) => {
    const name = file.name.toLowerCase();
    return name.endsWith('.stl') || name.endsWith('.pdf') || name.endsWith('.jpg') || name.endsWith('.jpeg');
  };

  const selectFile = (file) => {
    if (!file) return;
    if (!isAllowedFile(file)) {
      setError('Please choose a valid .stl, .pdf, or .jpg file.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    selectFile(e.dataTransfer.files?.[0] || null);
  };

  const handleFileInputClick = () => fileInputRef.current?.click();
  const handleInputFileChange = (e) => selectFile(e.target.files?.[0] || null);

  const canProceedStep0 = selectedFile && selectedMaterial && quantity > 0;
  const canProceedStep1 = customerName.trim() && customerEmail.trim() && customerPhone.trim() && customerAddress.trim();

  const isValidEmail = (email) => EMAIL_REGEX.test(email.trim());
  const isValidPhone = (phone) => {
    const raw = phone.trim();
    const digitsOnly = raw.replace(/\D/g, '');
    return PHONE_REGEX.test(raw) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const goNext = () => {
    if (step === 0 && !canProceedStep0) {
      setError('Please upload a file and select material.');
      return;
    }
    if (step === 1 && !canProceedStep1) {
      setError('Please fill in your valid name, email, phone number, and address.');
      return;
    }
    if (step === 1 && !isValidEmail(customerEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (step === 1 && !isValidPhone(customerPhone)) {
      setError('Please enter a valid phone number (10 to 15 digits).');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const goBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please attach a STL/PDF/JPG file before submitting.');
      return;
    }
    if (!isValidEmail(customerEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(customerPhone)) {
      setError('Please enter a valid phone number (10 to 15 digits).');
      return;
    }

    const payload = new FormData();
    payload.append('file', selectedFile);
    payload.append('name', customerName.trim());
    payload.append('email', customerEmail.trim());
    if (customerEmail2.trim()) payload.append('email2', customerEmail2.trim());
    payload.append('phone', customerPhone.trim());
    payload.append('address', customerAddress.trim());
    payload.append('material', selectedMaterial);
    payload.append('quantity', String(quantity));
    payload.append('message', notes.trim() || `Material: ${selectedMaterial}, Quantity: ${quantity}`);

    try {
      setIsSubmitting(true);
      setError('');

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(STL_UPLOAD_URL, {
        method: 'POST',
        headers,
        body: payload,
      });

      if (!response.ok) {
        const clone = response.clone();
        let errorMessage = `Order submission failed (${response.status})`;

        try {
          const json = await clone.json();
          if (json && json.message) {
            errorMessage = `Order submission failed (${response.status}): ${json.message}`;
          }
        } catch {
          try {
            const text = await clone.text();
            if (text) {
              errorMessage = `Order submission failed (${response.status}): ${text}`;
            }
          } catch (innerErr) {
            console.error('Failed to parse error body', innerErr);
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setOrderResult(data);
    } catch (err) {
      console.error('STL order submit failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setSelectedFile(null);
    setSelectedMaterial('PLA');
    setQuantity(1);
    setNotes('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerEmail2('');
    setCustomerPhone('');
    setCustomerAddress('');
    setOrderResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Success Screen ───
  if (orderResult) {
    return (
      <main className="min-h-full bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-6 flex items-center justify-center pt-24">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-200/60 animate-[bounce_0.6s_ease-in-out]">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Submitted!</h1>
            <p className="text-gray-600">Your 3D print request has been received. We'll review your file and get back to you with a quote.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left space-y-3 shadow-sm">
            <h3 className="font-semibold text-gray-900 text-lg">Order Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900">#{orderResult.stlOrderId || orderResult.id}</span>
              <span className="text-gray-500">File</span>
              <span className="font-medium text-gray-900 truncate">{selectedFile?.name || orderResult.fileName}</span>
              <span className="text-gray-500">Material</span>
              <span className="font-medium text-gray-900">{orderResult.material}</span>
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium text-gray-900">{orderResult.quantity}</span>
              <span className="text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="font-medium text-yellow-700">Pending Quote</span>
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">We'll send the final quote to <strong>{orderResult.email}</strong> once we review your file.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              Submit Another Order
            </button>
            <button
              onClick={goHome}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Main Form ───
  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={goHome}
          className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Custom 3D Print Order
          </h1>
          <p className="text-gray-500">Upload your design and we'll bring it to life</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  i === step ? 'text-blue-600' : i < step ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-5 transition-all ${
                  i < step ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
          {/* ─── Step 0: Upload File ─── */}
          {step === 0 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Your Design</h2>
                <p className="text-sm text-gray-500">Drag & drop or browse. Accepted: .STL, .PDF, .JPG</p>
              </div>

              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                    : selectedFile
                      ? 'border-green-300 bg-green-50/30'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileInputClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.pdf,.jpg,.jpeg"
                  onChange={handleInputFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-green-200 text-left max-w-sm mx-auto">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)} · {selectedFile.name.split('.').pop().toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleFileInputClick(); }}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-7 h-7 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-800">Drop your file here</p>
                      <p className="text-sm text-gray-400 mt-0.5">or click to browse</p>
                    </div>
                  </div>
                )}

                {isDragging && (
                  <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-blue-300 bg-blue-50/50 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    Drop to upload
                  </div>
                )}
              </div>

              {/* Material Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Material</label>
                <div className="grid grid-cols-2 gap-3">
                  {MATERIALS.map(mat => (
                    <button
                      type="button"
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                        selectedMaterial === mat.id
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{mat.icon}</span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{mat.label}</div>
                        <div className="text-xs text-gray-500">{mat.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <div className="inline-flex items-center bg-gray-100 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-14 h-11 text-center bg-white border-x border-gray-200 font-semibold text-gray-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none transition"
                  placeholder="Color preference, size adjustments, or special requirements..."
                />
              </div>
            </div>
          )}

          {/* ─── Step 1: Customer Details ─── */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Your Contact Details</h2>
                <p className="text-sm text-gray-500">So we can send you the quote and keep you updated</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      placeholder="you@example.com"
                      required
                      disabled={Boolean(localStorage.getItem("authUser"))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                      placeholder="+94 7X XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none transition"
                      placeholder="123 Example Street, City"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alternative Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={customerEmail2}
                      onChange={(e) => setCustomerEmail2(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                      placeholder="backup@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Review ─── */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Review Your Order</h2>
                <p className="text-sm text-gray-500">Make sure everything looks right before submitting</p>
              </div>

              <div className="space-y-4">
                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Design File</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedFile?.name}</p>
                      <p className="text-xs text-gray-500">{selectedFile && formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Print Details</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Material</span>
                    <span className="font-medium text-gray-900">{MATERIALS.find(m => m.id === selectedMaterial)?.label}</span>
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-medium text-gray-900">{quantity}</span>
                    {notes && (
                      <>
                        <span className="text-gray-500">Notes</span>
                        <span className="font-medium text-gray-900">{notes}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Info</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-900">{customerName}</span>
                    <span className="text-gray-500">Primary Email</span>
                    <span className="font-medium text-gray-900">{customerEmail}</span>
                    {customerEmail2 && (
                      <>
                        <span className="text-gray-500">Secondary Email</span>
                        <span className="font-medium text-gray-900">{customerEmail2}</span>
                      </>
                    )}
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{customerPhone}</span>
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900">{customerAddress}</span>
                  </div>
                </div>

                {/* Pricing Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                  <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-0.5">Pricing</p>
                    <p>Our team will review your file and send you an accurate quote based on the actual print time & material usage. You'll receive the quote at your email before we proceed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mx-6 sm:mx-8 mb-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Footer Actions — always visible */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between gap-3 rounded-b-2xl">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transition shadow-md"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Order →'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-gray-400">
          <span className="flex items-center gap-1">✓ No upfront payment</span>
          <span className="flex items-center gap-1">✓ Quote before printing</span>
          <span className="flex items-center gap-1">✓ Secure file upload</span>
        </div>
      </div>
    </main>
  );
}
