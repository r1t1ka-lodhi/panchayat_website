import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, Car, Dog, Hammer, Trash2, Volume2 } from 'lucide-react';

const RULES = [
  {
    category: 'Parking',
    icon: Car,
    color: 'text-blue-600 bg-blue-50',
    rules: [
      'Each flat is allocated one designated parking spot.',
      'Visitor parking is available in Zone V (near Gate 2) from 8 AM to 10 PM only.',
      'No vehicle shall block the fire lane or emergency access at any time.',
      'EV charging is available at spots E-01 to E-10 on a first-come basis.',
      'Two-wheelers must be parked in the basement only, not on the ramp.',
    ],
  },
  {
    category: 'Pets',
    icon: Dog,
    color: 'text-amber-600 bg-amber-50',
    rules: [
      'All pets must be registered with the society office and vaccinated annually.',
      'Pets must be on a leash in all common areas including lifts and lobbies.',
      'Pet owners must clean up after their pets. Violations carry a ₹500 fine.',
      'Pets are not permitted in the swimming pool area or gym.',
      'Maximum of 2 pets per household. Exotic animals require committee approval.',
    ],
  },
  {
    category: 'Construction',
    icon: Hammer,
    color: 'text-orange-600 bg-orange-50',
    rules: [
      'Renovation work is permitted only Monday–Saturday, 10 AM to 5 PM.',
      'Prior written approval from the society is mandatory before any structural changes.',
      'Waste from renovation must be disposed in the designated construction debris bin.',
      'Workers must sign in at the security desk and wear ID cards at all times.',
      'No drilling or heavy construction is permitted on Sundays or public holidays.',
    ],
  },
  {
    category: 'Waste Management',
    icon: Trash2,
    color: 'text-green-600 bg-green-50',
    rules: [
      'Wet waste (green bin) and dry waste (blue bin) must be segregated at source.',
      'Garbage must be kept inside your flat until the sweeper arrives (8–10 AM daily).',
      'E-waste collection is held on the first Sunday of every month.',
      'Do not dispose of cooking oil, chemicals, or paint down drains.',
      'Bulk garbage must be pre-arranged with the facilities manager.',
    ],
  },
  {
    category: 'Noise',
    icon: Volume2,
    color: 'text-purple-600 bg-purple-50',
    rules: [
      'Quiet hours are strictly 11 PM to 7 AM and 2 PM to 4 PM (afternoon rest).',
      'Music, TV, and appliances must be kept below 40 dB during quiet hours.',
      'Parties and gatherings must end by 10:30 PM on weekdays, 11:30 PM on weekends.',
      'Complaints can be raised via the app or at the security desk.',
      'Third violation of noise rules results in a formal warning from the committee.',
    ],
  },
];

function RuleAccordion({ item }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  return (
    <div className="card mb-3 overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
            <Icon size={20} />
          </div>
          <span className="font-display font-semibold text-gray-900 text-lg">{item.category}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {item.rules.length} rules
          </span>
        </div>
        {open ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
      </button>
      {open && (
        <ul className="mt-4 space-y-2 border-t border-gray-50 pt-4 animate-fade-in">
          {item.rules.map((rule, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Vidhan() {
  const [search, setSearch] = useState('');
  const filtered = RULES.filter(
    (r) =>
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.rules.some((rule) => rule.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={28} className="text-primary-600" />
          <h1 className="section-title">Vidhan</h1>
        </div>
        <p className="text-gray-500">Society Constitution — Rules that keep our community harmonious.</p>
        <div className="mt-5 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rules (e.g. parking, pets, noise)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="animate-fade-in-up">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No rules match your search.</p>
          </div>
        ) : (
          filtered.map((item) => <RuleAccordion key={item.category} item={item} />)
        )}
      </div>
    </div>
  );
}
