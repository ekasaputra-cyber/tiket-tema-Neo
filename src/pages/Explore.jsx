import React from 'react';
import EventCard from '../components/evnCard';

const mockEvents = [
  {
    id: 1,
    title: "Konser Musik Indie 2025",
    date: "Sabtu, 15 Mar 2025",
    location: "Jakarta",
    imageUrl: "https://placehold.co/600x400/4f46e5/white?text=Indie+Concert"
  },
  {
    id: 2,
    title: "Pameran Seni Digital",
    date: "Minggu, 22 Mar 2025",
    location: "Bandung",
    imageUrl: "https://placehold.co/600x400/0d9488/white?text=Digital+Art"
  },
  {
    id: 3,
    title: "Workshop Fotografi",
    date: "Jumat, 28 Mar 2025",
    location: "Yogyakarta",
    imageUrl: "https://placehold.co/600x400/ea580c/white?text=Photo+Workshop"
  },
  {
    id: 4,
    title: "Festival Kuliner Nusantara",
    date: "Sabtu, 5 Apr 2025",
    location: "Surabaya",
    imageUrl: "https://placehold.co/600x400/d97706/white?text=Food+Fest"
  },
];

export default function ExplorePage() {
  return (
    <div className="py-10 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Event Populer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {mockEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}