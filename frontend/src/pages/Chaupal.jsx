import { useState, useEffect } from 'react';
import axios from 'axios';
import NoticeCard from '../components/NoticeCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Wifi, WifiOff, RefreshCw, Megaphone, AlertTriangle, Calendar, Bell } from 'lucide-react';

const STATS = [
  { label: 'Active Notices', icon: Bell,          color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { label: 'Emergencies',    icon: AlertTriangle,  color: 'text-red-600',    bg: 'bg-red-50'    },
  { label: 'Events',         icon: Calendar,       color: 'text-green-600',  bg: 'bg-green-50'  },
];

export default function Chaupal() {
  const { user } = useAuth();
  const [notices, setNotices]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [offline, setOffline]   = useState(false);
  const [filter, setFilter]     = useState('All');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/notices');
      setNotices(data);
      setOffline(false);
    } catch {
      setOffline(true);
      // Try from SW cache — already handled by service worker
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await axios.delete(`/api/notices/${id}`);
    setNotices((n) => n.filter((x) => x._id !== id));
  };

  const filtered = filter === 'All' ? notices : notices.filter((n) => n.priority === filter);
  const stats = [
    notices.length,
    notices.filter((n) => n.priority === 'Emergency').length,
    notices.filter((n) => n.priority === 'Event').length,
  ];

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-600 font-semibold text-sm mb-1">
              🌅 Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
            </p>
            <h1 className="section-title">The Chaupal</h1>
            <p className="text-gray-500 mt-1">Wing {user?.wing}-{user?.houseNo} · Society Notice Board</p>
          </div>
          {offline && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2 text-sm">
              <WifiOff size={16} /> Offline — showing cached notices
            </div>
          )}
          <button onClick={fetchNotices} disabled={loading}
            className="flex items-center gap-2 btn-secondary text-sm py-2">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {STATS.map(({ label, icon: Icon, color, bg }, i) => (
            <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
              <Icon size={20} className={color} />
              <div>
                <p className="font-bold text-gray-900 text-xl leading-none">{stats[i]}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'Emergency', 'Event', 'General'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${filter === f
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notice Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <Megaphone size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} notices right now.</p>
          <p className="text-gray-300 text-sm mt-1">Check back later or refresh.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {filtered.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              isAdmin={user?.role === 'admin'}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
