// src/pages/LoginPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array 6 digit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]); 
  const navigate = useNavigate();

  // Timer Resend OTP
  useEffect(() => {
    let interval;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  // Handle Kirim Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email wajib diisi');
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
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
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verifikasi OTP
  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) return setError('Masukkan kode OTP lengkap');

    const otpCode = otp.join(''); // Gabungkan array jadi string
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpCode }), // Sesuaikan key body dgn backend (token/otp)
      });

      const data = await res.json();
      const token = data?.data?.token || data?.token;

      if (token) {
        localStorage.setItem('auth_token', token);
        setSuccess('Login berhasil!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('Kode OTP salah');
        setOtp(['', '', '', '', '', '']); // Reset OTP
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Gagal verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  // === PERBAIKAN LOGIC INPUT HURUF & ANGKA ===
  const handleOtpChange = (index, value) => {
    // Regex: Hanya izinkan Huruf (A-Z) dan Angka (0-9)
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; 

    const newOtp = [...otp];
    // Ambil karakter terakhir dan ubah jadi KAPITAL
    newOtp[index] = value.toUpperCase().slice(0, 1);
    setOtp(newOtp);

    // Pindah ke kotak selanjutnya jika ada isi
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto submit jika kotak terakhir diisi
    if (value && index === 5) {
      setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  // Handle tombol Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!resendDisabled) handleSendOtp({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="max-w-md w-full">
        
        {/* Judul & Deskripsi */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Masuk ke Akun Anda' : 'Masukkan Kode OTP'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 
              ? 'Masukkan email untuk melanjutkan' 
              : <span>Kode dikirim ke <span className="font-bold text-black">{email}</span></span>
            }
          </p>
        </div>

        {/* Notifikasi Error/Success */}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">{success}</div>}

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {step === 1 ? (
            // FORM EMAIL
            <form onSubmit={handleSendOtp}>
              <div className="mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="nama@email.com"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
              </button>
            </form>
          ) : (
            // FORM OTP (Huruf & Angka)
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Ketik 6 karakter kode
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      // inputMode="text" agar keyboard HP muncul huruf lengkap
                      inputMode="text" 
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength="1"
                      className="w-full h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase bg-gray-50 focus:bg-white"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className={`w-full py-3 rounded-lg font-bold text-white transition ${
                  loading || otp.some((d) => !d)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
              </button>

              <div className="text-center mt-6 space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resendDisabled}
                  className={`text-sm font-medium ${
                    resendDisabled ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:underline'
                  }`}
                >
                  {resendDisabled ? `Kirim ulang (${resendTimer}s)` : 'Kirim ulang kode'}
                </button>
                <div>
                  <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-800">
                    ← Ganti alamat email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          Belum punya akun?{' '}
          <Link to="/daftar" className="text-black font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}