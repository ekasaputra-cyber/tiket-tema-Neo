import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../profil/sidebarProf'; // Lihat file selanjutnya
import { FaSpinner } from 'react-icons/fa';

export default function ProfileLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data user utama untuk Sidebar (Nama & Email)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/masuk');
      return;
    }

    const fetchUserSummary = async () => {
      try {
        const res = await fetch('https://api.artatix.co.id/api/v1/customer/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.message === 'success') {
          setUser(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSummary();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-[#154D71]" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* SIDEBAR COMPONENT */}
          <div className="w-full md:w-72 flex-shrink-0">
             <ProfileSidebar user={user} />
          </div>

          {/* CONTENT AREA (Berubah sesuai route) */}
          <div className="flex-1">
            <Outlet context={{ user, setUser }} /> 
          </div>

        </div>
      </div>
    </div>
  );
}