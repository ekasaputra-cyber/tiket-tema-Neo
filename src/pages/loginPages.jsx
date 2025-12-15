// src/pages/LoginPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]); // ✅ array ref
  const navigate = useNavigate();

  // Timer untuk resend OTP
  useEffect(() => {
    let interval;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  // === Langkah 1: Kirim email ===
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email wajib diisi');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Email tidak valid');

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Gunakan proxy (di package.json: "proxy": "https://artatix.co.id")
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.message === 'success') {
        setStep(2);
        setResendDisabled(true);
        setResendTimer(60);
        setSuccess('Kode OTP telah dikirim ke email Anda');
      } else {
        setError(data.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // === Langkah 2: Verifikasi OTP ===
  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) return setError('Masukkan kode OTP lengkap');

    const otpCode = otp.join('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpCode }),
      });

      const data = await res.json();
      const token = data?.data?.token || data?.token;

      if (token) {
        localStorage.setItem('auth_token', token);
        setSuccess('Login berhasil!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('Kode OTP salah atau telah kadaluarsa');
        setOtp(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } catch (err) {
      console.error('OTP error:', err);
      setError('Gagal verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan input OTP (alfanumerik kapital)
  const handleOtpChange = (index, value) => {
    if (!/^[A-Z0-9]*$/.test(value)) return; // hanya A-Z dan 0-9
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase().slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value && index === 5) {
      setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  const handleResend = () => {
    if (!resendDisabled) handleSendOtp({ preventDefault: () => {} });
  };

  const handleBackToEmail = () => {
    setStep(1);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">Artatix</Link>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 font-medium bg-gray-50">
              ID
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {step === 1 ? 'Masuk ke Akun Anda' : 'Masukkan Kode OTP'}
            </h1>
            {step === 1 ? (
              <p className="text-gray-600 mt-2">Masukkan email Anda</p>
            ) : (
              <p className="text-gray-600 mt-2">
                Kami telah mengirim kode ke <span className="font-medium">{email}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="contoh@email.com"
                  disabled={loading}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-lg font-medium text-white ${
                    loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </button>
              </form>
            ) : (
              <div>
                <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Kode OTP
                </label>
                <input
                    id="otp"
                    type="text"
                    value={otp.join('')}
                    onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    // Pisahkan ke array 6 karakter
                    const newOtp = Array(6).fill('');
                    for (let i = 0; i < Math.min(value.length, 6); i++) {
                        newOtp[i] = value[i];
                    }
                    setOtp(newOtp);
                    }}
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                    placeholder="Masukkan 6 digit kode"
                    disabled={loading}
                />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.some((d) => !d)}
                  className={`w-full py-3 rounded-lg font-medium text-white ${
                    loading || otp.some((d) => !d)
                      ? 'bg-gray-400'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                </button>

                <div className="text-center mt-4">
                  <button
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className={`text-sm ${
                      resendDisabled ? 'text-gray-400' : 'text-blue-600 hover:underline'
                    }`}
                  >
                    {resendDisabled
                      ? `Kirim ulang (${resendTimer}s)`
                      : 'Kirim ulang kode'}
                  </button>
                </div>

                <button
                  onClick={handleBackToEmail}
                  className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Ganti email
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-6 text-gray-600">
            Belum punya akun?{' '}
            <Link to="/daftar" className="text-black font-medium hover:underline">
              Daftar
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Artatix. Semua hak dilindungi.
      </footer>
    </div>
  );
}