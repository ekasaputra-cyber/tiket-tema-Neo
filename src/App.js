// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header';
import ExploreByTerritory from './components/ExploreByTerritory';
import EventDetail from './components/eventDet';
import TicketSelection from './components/pilihTiket';
import PaymentStatus from './components/payStat';
import Footer from './components/footer';
import LoginPage from './pages/loginPages';
import Home from './pages/home';
import JelajahPage from './pages/jelajah';
import FAQPage from './pages/faq';
import AboutPage from './pages/tentang';
import ComingSoonPage from './pages/comingsoon.jsx';

import Kontak from './pages/kontakkami.jsx';
import Privasi from './pages/privasi.jsx';
import SyaratPage from './pages/syarat.jsx';

import ProfileLayout from './components/Layout/ProfLay';
import ProfileSettings from './pages/profile/ProfilSett';
import MyTickets from './pages/profile/TiketSaya';
import TransactionHistory from './pages/profile/HistoryTransaksi';

export default function App() {
  const location = useLocation();

  // Daftar rute yang sudah terdaftar (selain rute 404)
  const knownRoutes = [
    '/', '/jelajah', '/faq', '/tentang', '/masuk', '/daftar', '/profil'
  ];

  // Cek apakah rute saat ini ada di daftar (termasuk pengecekan rute dinamis)
  const isKnownRoute = knownRoutes.some(path => location.pathname === path || location.pathname.startsWith('/event/') || location.pathname.startsWith('/payment/'));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Header hanya muncul jika rute dikenal */}
      {isKnownRoute && <Header />}
      
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jelajah/" element={<JelajahPage />} />
          <Route path="/jelajah/:wilayah" element={<ExploreByTerritory />} />
          <Route path="/event/:widgetSlug" element={<EventDetail />} />
          <Route path="/event/:widgetSlug/ticket" element={<TicketSelection />} />
          <Route path="/payment/:orderId" element={<PaymentStatus />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/masuk" element={<LoginPage />} />
          <Route path="/daftar" element={<LoginPage />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/privasi" element={<Privasi />} />
          <Route path="/syarat" element={<SyaratPage />} />

          <Route path="/profil" element={<ProfileLayout />}>
            <Route index element={<ProfileSettings />} />
            <Route path="tiket" element={<MyTickets />} />
            <Route path="transaksi" element={<TransactionHistory />} />
          </Route>

          {/* Rute 404 / Coming Soon */}
          <Route path="*" element={<ComingSoonPage />} />
        </Routes>
      </main>
      
      {/* Footer hanya muncul jika rute dikenal */}
      {isKnownRoute && <Footer />}
    </div>
  );
}