import { useState } from 'react';
import { Phone, ShieldCheck, Star, Users, ThumbsUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const categoryColors = {
  Cook:        'bg-amber-100 text-amber-700',
  Maid:        'bg-purple-100 text-purple-700',
  Plumber:     'bg-blue-100 text-blue-700',
  Electrician: 'bg-yellow-100 text-yellow-700',
  Driver:      'bg-green-100 text-green-700',
  Carpenter:   'bg-orange-100 text-orange-700',
  Security:    'bg-slate-100 text-slate-700',
  Other:       'bg-gray-100 text-gray-600',
};

const AVATAR_COLORS = ['bg-rose-400','bg-violet-400','bg-blue-400','bg-amber-400','bg-teal-400'];

export default function HelperCard({ helper, onVouched }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localHelper, setLocalHelper] = useState(helper);

  const alreadyVouched = localHelper.vouchedBy?.some(
    (v) => v.userId === user?._id || v.name === user?.name
  );

  const handleVouch = async () => {
    if (!user?.isVerified) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/helpers/${localHelper._id}/vouch`);
      setLocalHelper(data.helper);
      onVouched?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not vouch right now.');
    } finally {
      setLoading(false);
    }
  };

  const statusClass = {
    Available:   'badge-status-available',
    Busy:        'badge-status-busy',
    Unavailable: 'badge-status-unavailable',
  }[localHelper.status] || 'badge-status-available';

  return (
    <div className="card hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in-up">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-bold text-lg font-display">
            {localHelper.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-lg leading-tight">
              {localHelper.name}
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[localHelper.category] || categoryColors.Other}`}>
              {localHelper.category}
            </span>
          </div>
        </div>
        <span className={statusClass}>
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
          {localHelper.status}
        </span>
      </div>

      {/* Rating + Verified */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{localHelper.rating?.toFixed(1)}</span>
        </div>
        {localHelper.verifiedByAdmin && (
          <span className="badge-verified">
            <ShieldCheck size={12} /> Verified
          </span>
        )}
        {localHelper.experience && (
          <span className="text-xs text-gray-400">{localHelper.experience}</span>
        )}
      </div>

      {/* Tags */}
      {localHelper.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {localHelper.tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      )}

      {/* Vouched By - Neighbor Avatars */}
      {localHelper.vouchedBy?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <Users size={12} /> Neighbors who trust
          </p>
          <div className="flex items-center gap-1">
            {localHelper.vouchedBy.slice(0, 4).map((v, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold border-2 border-white -ml-1 first:ml-0`}
                title={`${v.name} – Wing ${v.wing}-${v.houseNo}`}
              >
                {v.name.charAt(0)}
              </div>
            ))}
            {localHelper.vouchedBy.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white -ml-1">
                +{localHelper.vouchedBy.length - 4}
              </div>
            )}
            <span className="text-xs text-gray-500 ml-2">
              {localHelper.vouchedBy.length} neighbor{localHelper.vouchedBy.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <a
          href={`tel:${localHelper.contact.replace(/[^0-9+]/g, '')}`}
          className="flex-1 btn-success flex items-center justify-center gap-1.5 text-sm py-2.5"
        >
          <Phone size={16} /> Call {localHelper.name.split(' ')[0]}
        </a>
        {user?.isVerified && !alreadyVouched && (
          <button
            onClick={handleVouch}
            disabled={loading}
            className="px-3 py-2.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 flex items-center gap-1 text-sm font-medium disabled:opacity-60"
            title="Vouch for this helper"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
          </button>
        )}
        {alreadyVouched && (
          <div className="px-3 py-2.5 rounded-xl bg-sage-100 text-sage-700 flex items-center gap-1 text-sm font-medium">
            <ThumbsUp size={16} /> Vouched
          </div>
        )}
      </div>
    </div>
  );
}
