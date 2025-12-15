import React from 'react';

export default function TicketAttendeeForm({ index, ticketForms, setTicketForms }) {
  const handleChange = (field, value) => {
    setTicketForms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const form = ticketForms[index] || {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
        <input
          type="text"
          value={form.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Nama lengkap pemegang tiket"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipe Identitas *</label>
          <select
            value={form.idType || ''}
            onChange={(e) => handleChange('idType', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Pilih...</option>
            <option value="KTP">KTP</option>
            <option value="SIM">SIM</option>
            <option value="Paspor">Paspor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor Identitas *</label>
          <input
            type="text"
            value={form.idNumber || ''}
            onChange={(e) => handleChange('idNumber', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Nomor identitas"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          value={form.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="email@contoh.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">No. WhatsApp *</label>
        <div className="mt-1 flex">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            +62
          </span>
          <input
            type="tel"
            value={form.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="block w-full min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2"
            placeholder="81234567890"
          />
        </div>
      </div>
    </div>
  );
}