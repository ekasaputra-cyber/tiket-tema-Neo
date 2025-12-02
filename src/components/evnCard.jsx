import React from 'react';

export default function EventCard({ title, date, location, imageUrl, lowestPrice, dateEnd, timeEnd}) {

  const isExpired = React.useMemo(() => {
    if (!dateEnd) return false;

    const timePart = timeEnd || '23:59:59';
    const dateTimeString = `${dateEnd}T${timePart}`;
    
    const endTime = new Date(dateTimeString);
    const now = new Date();

    return endTime < now;
  }, [dateEnd, timeEnd]);

  return (
    <div className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition max-w-sm mx-auto ${isExpired ? 'opacity-80 bg-gray-200' : 'bg-white'}`}>
        <div className="aspect-[1062/427] overflow-hidden relative">
            <img
            src={imageUrl || "https://placehold.co/1062x427/eee/999?text=loading..."}
            alt={title}
            className={`w-full h-full object-cover ${
                isExpired ? 'grayscale opacity-70' : ''
            }`}
            onError={(e) => {
                e.target.src = "https://placehold.co/1062x427/eee/999?text=gambar tidak ditemukan";
            }}
            loading="lazy"
            />

        </div>
        <div className={`p-4 ${isExpired ? 'bg-gray-100' : 'bg-white'}`}>
            {/* Judul dengan tinggi minimal 2 baris */}
            <h3 className={`font-bold ${
            isExpired ? 'text-gray-500' : 'text-gray-800'
            } line-clamp-2 min-h-[44px]`}>
            {title}
            </h3>

            {/* Tanggal */}
            <p className={`text-sm mt-2 ${isExpired ? 'text-gray-400' : 'text-gray-600'}`}>
            {date}
            </p>

            {/* Harga (selalu di bottom dengan margin konsisten) */}
            {lowestPrice && (
            <p className={`mt-2 font-bold ${
                isExpired ? 'text-gray-500' : 'text-green-600'
            }`}>
                Rp{parseInt(lowestPrice).toLocaleString('id-ID')}
            </p>
            )}
        </div>
    </div>
  );
}