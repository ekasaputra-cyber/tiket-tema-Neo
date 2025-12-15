// src/components/form.jsx (sebaiknya ganti nama file jadi PemesanForm.jsx)
import React from 'react';

export default function PemesanForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700">
          Nama Lengkap *
        </label>
        <input
          type="text"
          id="namaLengkap"
          name="namaLengkap"
          value={formData.namaLengkap}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nama lengkap Anda"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipeIdentitas" className="block text-sm font-medium text-gray-700">
            Tipe Identitas *
          </label>
          <select
            id="tipeIdentitas"
            name="tipeIdentitas"
            value={formData.tipeIdentitas}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Pilih tipe identitas</option>
            <option value="KTP">KTP</option>
            <option value="SIM">SIM</option>
            <option value="Paspor">Paspor</option>
          </select>
        </div>

        <div>
          <label htmlFor="nomorIdentitas" className="block text-sm font-medium text-gray-700">
            Nomor Identitas *
          </label>
          <input
            type="text"
            id="nomorIdentitas"
            name="nomorIdentitas"
            value={formData.nomorIdentitas}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nomor KTP/SIM/Paspor"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="nama@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="noWa" className="block text-sm font-medium text-gray-700">
          No. WhatsApp *
        </label>
        <div className="mt-1 flex">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 shadow-sm">
            +62
          </span>
          <input
            type="tel"
            id="noWa"
            name="noWa"
            value={formData.noWa}
            onChange={handleChange}
            className="block w-full min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="81234567890"
            required
          />
        </div>
      </div>
    </div>
  );
}