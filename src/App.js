// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import RegionNav from './components/regionNav';
import ExploreByTerritory from './components/ExploreByTerritory';
import EventDetail from './components/eventDet';
import TicketSelection from './components/pilihTiket';
import PaymentStatus from './components/payStat';
import Footer from './components/footer';
import LoginPage from './pages/loginPages';
import ProfilePage from './pages/profilPgs';
import Home from './pages/home';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jelajah/:wilayah" element={<ExploreByTerritory />} />
          <Route path="/event/:widgetSlug" element={<EventDetail />} />
          <Route path="/event/:widgetSlug/ticket" element={<TicketSelection />} />
          <Route path="/payment/:orderId" element={<PaymentStatus />} />
          <Route path="/masuk" element={<LoginPage />} />
          <Route path="/daftar" element={<LoginPage />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}