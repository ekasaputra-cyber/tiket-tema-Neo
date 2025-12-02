// src/App.js
import React from 'react';
import Header from './components/header';
import RegionNav from './components/regionNav';
import ExploreByTerritory from './components/ExploreByTerritory';
import Footer from './components/footer';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isExplorePage = urlParams.has('wilayah');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {isExplorePage ? <ExploreByTerritory /> : <RegionNav />}
      </main>
      <Footer />
    </div>
  );
}

export default App;