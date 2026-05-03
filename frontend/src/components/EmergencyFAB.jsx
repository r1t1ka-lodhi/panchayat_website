import { useState } from 'react';
import { Phone, X, Shield, Flame, Ambulance } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { label: 'Security', number: '1800-SEC-XXXX', icon: Shield,    color: 'bg-blue-600'  },
  { label: 'Fire',     number: '101',            icon: Flame,     color: 'bg-red-600'   },
  { label: 'Ambulance',number: '108',            icon: Phone,     color: 'bg-green-600' },
  { label: 'Society',  number: '+91 99000-XXXX', icon: Phone,     color: 'bg-orange-600'},
];

export default function EmergencyFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact cards */}
      {open && (
        <div className="flex flex-col gap-2 animate-fade-in-up">
          {EMERGENCY_CONTACTS.map(({ label, number, icon: Icon, color }) => (
            <a
              key={label}
              href={`tel:${number.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100 hover:shadow-xl transition-all duration-200 group"
            >
              <div className={`${color} w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none">{label}</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600">{number}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl transition-all duration-300 animate-pulse-glow
          ${open ? 'bg-gray-800 rotate-45 scale-90' : 'bg-red-600 hover:bg-red-700 hover:scale-110'}`}
        aria-label="Emergency Contacts"
      >
        {open ? <X size={24} /> : '🚨'}
      </button>
    </div>
  );
}
