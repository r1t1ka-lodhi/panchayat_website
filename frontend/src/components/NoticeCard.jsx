import { AlertTriangle, Calendar, Bell, Pin, Clock } from 'lucide-react';

const priorityConfig = {
  Emergency: {
    className: 'notice-emergency',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    label: 'Emergency',
  },
  Event: {
    className: 'notice-event',
    badge: 'bg-green-100 text-green-700 border border-green-200',
    icon: Calendar,
    iconColor: 'text-green-600',
    label: 'Event',
  },
  General: {
    className: 'notice-general',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: Bell,
    iconColor: 'text-blue-500',
    label: 'Notice',
  },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function NoticeCard({ notice, onDelete, isAdmin }) {
  const cfg = priorityConfig[notice.priority] || priorityConfig.General;
  const Icon = cfg.icon;

  return (
    <div className={`${cfg.className} rounded-2xl p-5 shadow-card animate-fade-in-up transition-shadow hover:shadow-md`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/70`}>
            <Icon size={18} className={cfg.iconColor} />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
          {notice.isPinned && (
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Pin size={12} /> Pinned
            </span>
          )}
        </div>
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(notice._id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"
            title="Delete notice"
          >
            ×
          </button>
        )}
      </div>

      {/* Title + Content */}
      <h3 className="font-display font-semibold text-gray-900 text-lg leading-snug mb-1.5">
        {notice.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{notice.content}</p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {timeAgo(notice.createdAt)}
        </span>
        {notice.createdBy && (
          <span>
            by {notice.createdBy?.wing ? `Wing ${notice.createdBy.wing}` : 'Admin'}
          </span>
        )}
      </div>
    </div>
  );
}
