// src/components/LoginCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function LoginCard() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);

  // Timer untuk resend OTP
  useEffect(() => {
    let interval;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email wajib diisi');
      return;
    }
    // Regex email sederhana
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Pastikan URL ini sesuai dengan solusi CORS Anda (Proxy atau Absolute URL)
      const res = await fetch('https://artatix.co.id/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.message === 'success') {
        setStep(2);
        setResendDisabled(true);
        setResendTimer(60); 
        setSuccess('Kode OTP terkirim! Cek kotak masuk email Anda.');
      } else {
        setError(data.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menghubungi server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.some(digit => !digit)) {
      setError('Mohon lengkapi 6 digit kode OTP');
      return;
    }

    const otpCode = otp.join('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://artatix.co.id/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await res.json();

      if (data.message === 'success') {
        if (data.data?.token) {
          localStorage.setItem('auth_token', data.data.token);
        }
        setSuccess('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          window.location.reload(); 
        }, 1500);
      } else {
        setError(data.message || 'Kode OTP salah');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // hanya angka
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit jika lengkap
    if (value && index === 5) {
      setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  // Handle Backspace navigation for OTP
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      await handleSendOtp({ preventDefault: () => {} });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Header Card */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-[#154D71]">
          {step === 1 ? 'Selamat Datang' : 'Verifikasi Akun'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {step === 1 
            ? 'Masuk untuk mengakses tiket Anda' 
            : 'Masukkan kode keamanan yang kami kirim'}
        </p>
      </div>

      <div className="p-8">
        {/* Alert Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 animate-pulse">
            <FaExclamationCircle className="mt-0.5 text-lg flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Alert Success */}
        {success && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
            <FaCheckCircle className="mt-0.5 text-lg flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          // === Langkah 1: Input Email ===
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FFD600] focus:border-transparent outline-none transition-all"
                  placeholder="nama@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-black shadow-lg hover:shadow-xl transform transition-all active:scale-95 ${
                loading 
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400' 
                  : 'bg-[#FFD600] hover:bg-yellow-400'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Mengirim Kode...
                </span>
              ) : (
                'Kirim Kode OTP'
              )}
            </button>
          </form>
        ) : (
          // === Langkah 2: Input OTP ===
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-1">Kode dikirim ke:</p>
              <p className="font-semibold text-[#154D71]">{email}</p>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#154D71] focus:ring-4 focus:ring-[#154D71]/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.some(d => !d)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-black shadow-md transition-all active:scale-95 ${
                  loading || otp.some(d => !d)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FFD600] hover:bg-yellow-400'
                }`}
              >
                {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
              </button>

              <div className="flex justify-between items-center text-sm mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                    setSuccess('');
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="flex items-center text-gray-500 hover:text-[#154D71] transition font-medium"
                >
                  <FaArrowLeft className="mr-1" /> Ganti Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className={`font-medium ${
                    resendDisabled
                      ? 'text-gray-400 cursor-default'
                      : 'text-[#154D71] hover:underline'
                  }`}
                >
                  {resendDisabled
                    ? `Kirim ulang (${resendTimer}s)`
                    : 'Kirim ulang kode'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}