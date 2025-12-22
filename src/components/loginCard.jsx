// src/components/LoginCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaArrowLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LoginCard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]); 

  // Timer Resend
  useEffect(() => {
    let interval;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  // === HANDLE KIRIM EMAIL ===
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Email wajib diisi bos!');
    
    setLoading(true); setError(''); setSuccess('');

    try {
      // ✅ PERBAIKAN 1: Pakai Relative Path '/api/...' agar Proxy jalan (Bebas CORS)
      // ✅ PERBAIKAN 2: Hapus '/v1' karena di kode lamamu yang berhasil tidak pakai v1
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
        setSuccess('Kode OTP meluncur! Cek emailmu.');
      } else {
        setError(data.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // === HANDLE VERIFIKASI OTP ===
  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) return setError('Masukkan kode OTP lengkap');

    const otpCode = otp.join('');
    setLoading(true); setError('');

    try {
      // ✅ PERBAIKAN: Relative Path & Tanpa '/v1'
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sesuaikan body dengan backend kamu (token vs otp)
        // Di kode lamamu pakai key 'token', di sini saya sesuaikan jadi 'token' juga
        body: JSON.stringify({ token: otpCode }), 
      });

      const data = await res.json();
      
      const token = data?.data?.token || data?.token;

      if (token) {
        localStorage.setItem('auth_token', token);
        window.dispatchEvent(new Event('auth-update'));

        setSuccess('Login berhasil! Let\'s Party!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(data.message || 'Kode OTP salah');
        setOtp(['', '', '', '', '', '']); // Reset OTP
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error(err);
      setError('Gagal verifikasi OTP');
    } finally {
      setLoading(false);
    }
  };

  // === HANDLE INPUT OTP ===
  const handleOtpChange = (index, value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase().slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5) setTimeout(() => handleVerifyOtp(), 100);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!resendDisabled) handleSendOtp({ preventDefault: () => {} });
  };

  return (
    // DESAIN UI NEO-BRUTALIST (PESTAPORA STYLE)
    <div className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
      
      <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full"></div>
      <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full"></div>

      <div className="bg-[#facc15] px-8 py-8 border-b-4 border-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:10px_10px]"></div>
        <h2 className="text-3xl font-black text-black uppercase tracking-tighter relative z-10">
          {step === 1 ? 'MASUK / DAFTAR' : 'VERIFIKASI OTP'}
        </h2>
        <p className="text-black font-bold text-sm mt-2 relative z-10">
          {step === 1 ? 'Akses tiketmu & bersenang-senang!' : 'Cek email, ketik kodenya.'}
        </p>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-[#ef4444] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_black]">
            <FaExclamationTriangle className="text-xl flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-[#10b981] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_black]">
            <FaCheck className="text-xl flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-wide">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><FaEnvelope className="text-black" /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border-4 border-black font-bold text-black focus:bg-[#e0f2fe] focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all placeholder-gray-500" placeholder="NAMA@EMAIL.COM" disabled={loading} />
              </div>
            </div>
            <button type="submit" disabled={loading} className={`w-full py-4 px-4 font-black text-lg uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all ${loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'}`}>
              {loading ? 'SABAR YAK...' : 'KIRIM KODE OTP 🚀'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center bg-gray-100 p-3 border-2 border-black border-dashed">
              <p className="text-gray-600 text-xs font-bold uppercase">Kode dikirim ke:</p>
              <p className="font-black text-black text-lg">{email}</p>
            </div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} className="w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-black border-4 border-black bg-white focus:bg-[#facc15] focus:outline-none focus:-translate-y-1 shadow-[4px_4px_0px_0px_black] transition-all uppercase" disabled={loading} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={handleVerifyOtp} disabled={loading || otp.some((d) => !d)} className={`w-full py-4 px-4 font-black text-lg uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all ${loading || otp.some((d) => !d) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#10b981] text-black hover:bg-[#059669] hover:text-white'}`}>
                {loading ? 'MEMVERIFIKASI...' : 'MASUK SEKARANG!'}
              </button>
              <div className="flex justify-between items-center text-sm mt-4 font-bold">
                <button onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(['', '', '', '', '', '']); }} className="flex items-center text-black hover:text-[#ef4444] hover:underline decoration-2 underline-offset-2 transition"><FaArrowLeft className="mr-1" /> GANTI EMAIL</button>
                <button onClick={handleResend} disabled={resendDisabled} className={`${resendDisabled ? 'text-gray-400 cursor-default' : 'text-[#3b82f6] hover:underline decoration-2 underline-offset-2'}`}>{resendDisabled ? `KIRIM ULANG (${resendTimer}s)` : 'KIRIM ULANG'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}