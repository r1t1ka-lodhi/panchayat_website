import { useState, useEffect } from 'react';
import axios from 'axios';
import HelperCard from '../components/HelperCard.jsx';
import { Search, Users } from 'lucide-react';

const CATEGORIES = ['All', 'Cook', 'Maid', 'Plumber', 'Electrician', 'Driver', 'Carpenter'];

export default function TrustCircle() {
  const [helpers, setHelpers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await axios.get('/api/helpers', { params });
      setHelpers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchHelpers, 300);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="section-title">Trust Circle</h1>
        <p className="text-gray-500 mt-1">
          Helpers verified and vouched for by your neighbors.
        </p>

        {/* Search bar */}
        <div className="mt-5 relative max-w-lg">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                ${
                  category === cat
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Helper count */}
      {!loading && (
        <p className="text-sm text-gray-400 mb-4 animate-fade-in">
          {helpers.length} helper{helpers.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="card h-64 animate-pulse bg-gray-100 rounded-2xl"
            />
          ))}
        </div>
      ) : helpers.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No helpers found.</p>
          <p className="text-gray-300 text-sm mt-1">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {helpers.map((helper) => (
            <HelperCard
              key={helper._id}
              helper={helper}
              onVouched={fetchHelpers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
