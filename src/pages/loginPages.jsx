import React from 'react';
import LoginCard from '../components/loginCard'; 

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      <LoginCard />
    </div>
  );
}