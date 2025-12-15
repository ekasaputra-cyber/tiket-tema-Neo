// src/components/LoginCard.jsx
import React, { useState, useEffect, useRef } from 'react';

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('https://artatix.co.id/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.message === 'success') {
        setStep(2);
        setResendDisabled(true);
        setResendTimer(60); // 60 detik
        setSuccess('Kode OTP telah dikirim ke email Anda');
      } else {
        setError(data.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.some(digit => !digit)) {
      setError('Masukkan kode OTP lengkap');
      return;
    }

    const otpCode = otp.join('');
    setLoading(true);
    setError('');

    try {
      // ✅ Ganti dengan API Artatix untuk verifikasi OTP
      const res = await fetch('https://artatix.co.id/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await res.json();

      if (data.message === 'success') {
        // Simpan token jika ada
        if (data.data?.token) {
          localStorage.setItem('auth_token', data.data.token);
        }
        setSuccess('Login berhasil!');
        // Redirect atau tutup modal
        setTimeout(() => {
          window.location.reload(); // atau navigate('/dashboard')
        }, 1000);
      } else {
        setError(data.message || 'Kode OTP salah');
        // Reset OTP jika salah
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

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      await handleSendOtp({ preventDefault: () => {} });
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {step === 1 ? 'Masuk ke Akun Anda' : 'Verifikasi Kode OTP'}
      </h2>

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

      {step === 1 ? (
        // === Langkah 1: Masukkan Email ===
        <form onSubmit={handleSendOtp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="contoh@email.com"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
            } transition`}
          >
            {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
          </button>
        </form>
      ) : (
        // === Langkah 2: Masukkan OTP ===
        <div>
          <p className="text-gray-600 text-center mb-6">
            Kami telah mengirim kode ke <span className="font-medium">{email}</span>
          </p>

          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
              />
            ))}
          </div>

          <div className="text-center mb-4">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`text-sm ${
                resendDisabled
                  ? 'text-gray-400'
                  : 'text-blue-600 hover:underline'
              }`}
            >
              {resendDisabled
                ? `Kirim ulang (${resendTimer}s)`
                : 'Kirim ulang kode'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading || otp.some(d => !d)}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
              loading || otp.some(d => !d)
                ? 'bg-gray-400'
                : 'bg-black hover:bg-gray-800'
            } transition`}
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setError('');
              setSuccess('');
            }}
            className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
          >
            ← Ganti email
          </button>
        </div>
      )}
    </div>
  );
}