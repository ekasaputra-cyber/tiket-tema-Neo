import React from 'react';
import ExploreEvents from '../components/jelajah';

export default function ExplorePage() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#fffbeb', 
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >

      <main className="flex-grow pt-8 pb-16">
        <ExploreEvents />
      </main>

    </div>
  );
}