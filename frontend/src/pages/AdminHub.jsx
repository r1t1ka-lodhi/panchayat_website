import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Megaphone, UserPlus, Users, Loader2, Shield, AlertCircle } from 'lucide-react';

// ── Sub-components ─────────────────────────────────────────

function PendingUsers({ refresh }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/admin/pending');
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, [refresh]);

  const approve = async (id) => {
    setWorking(id);
    await axios.patch(`/api/admin/verify/${id}`);
    setUsers((u) => u.filter((x) => x._id !== id));
    setWorking(null);
  };
  const reject = async (id) => {
    if (!confirm('Reject and remove this user?')) return;
    setWorking(id);
    await axios.delete(`/api/admin/reject/${id}`);
    setUsers((u) => u.filter((x) => x._id !== id));
    setWorking(null);
  };

  if (loading) return <div className="h-32 animate-pulse bg-gray-100 rounded-2xl" />;

  return (
    <div>
      {users.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <CheckCircle size={36} className="mx-auto mb-2 text-sage-400" />
          <p>No pending approvals 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
              <div>
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email} · Wing {u.wing}-{u.houseNo}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(u._id)}
                  disabled={working === u._id}
                  className="btn-success flex items-center gap-1 text-sm py-1.5 px-3"
                >
                  {working === u._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Approve
                </button>
                <button
                  onClick={() => reject(u._id)}
                  disabled={working === u._id}
                  className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BroadcastNotice({ onSuccess }) {
  const [form, setForm] = useState({ title: '', content: '', priority: 'General', days: 30, isPinned: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const expiresAt = new Date(Date.now() + form.days * 86400000);
      await axios.post('/api/notices', { ...form, expiresAt });
      setSuccess(true);
      setForm({ title: '', content: '', priority: 'General', days: 30, isPinned: false });
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post notice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
          <CheckCircle size={16} /> Notice broadcast successfully!
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Title</label>
        <input name="title" required value={form.title} onChange={handleChange}
          className="input-field" placeholder="e.g. Water supply shutdown tomorrow" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Content</label>
        <textarea name="content" required rows={3} value={form.content} onChange={handleChange}
          className="input-field resize-none" placeholder="Full details of the notice..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option>General</option>
            <option>Event</option>
            <option>Emergency</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Expires in (days)</label>
          <input name="days" type="number" min={1} max={90} value={form.days} onChange={handleChange}
            className="input-field" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" name="isPinned" checked={form.isPinned} onChange={handleChange}
          className="rounded text-primary-600 w-4 h-4" />
        Pin this notice to the top
      </label>
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
        {loading ? 'Broadcasting...' : 'Broadcast Notice'}
      </button>
    </form>
  );
}

function AddHelper({ onSuccess }) {
  const cats = ['Cook','Maid','Plumber','Electrician','Driver','Carpenter','Security','Other'];
  const [form, setForm] = useState({ name: '', category: 'Cook', contact: '', status: 'Available', experience: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await axios.post('/api/helpers', { ...form, tags });
      setSuccess(true);
      setForm({ name: '', category: 'Cook', contact: '', status: 'Available', experience: '', tags: '' });
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add helper.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 bg-sage-50 border border-sage-200 text-sage-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
          <CheckCircle size={16} /> Helper added successfully!
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Full Name</label>
          <input name="name" required value={form.name} onChange={handleChange}
            className="input-field" placeholder="e.g. Ramesh Kumar" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Contact</label>
          <input name="contact" required value={form.contact} onChange={handleChange}
            className="input-field" placeholder="+91 98XXX-XXXXX" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Experience</label>
          <input name="experience" value={form.experience} onChange={handleChange}
            className="input-field" placeholder="e.g. 5 years" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
          Tags <span className="normal-case font-normal text-gray-400">(comma-separated)</span>
        </label>
        <input name="tags" value={form.tags} onChange={handleChange}
          className="input-field" placeholder="Punctual, Great with Kids, Owns Toolbox" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
        {loading ? 'Adding...' : 'Add Helper to Directory'}
      </button>
    </form>
  );
}

// ── Main AdminHub ──────────────────────────────────────────
export default function AdminHub() {
  const [tab, setTab] = useState('pending');
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: 'pending',   label: 'Pending Users',  icon: Users   },
    { id: 'broadcast', label: 'Broadcast',       icon: Megaphone },
    { id: 'helper',    label: 'Add Helper',      icon: UserPlus },
  ];

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Shield size={22} className="text-amber-600" />
          </div>
          <h1 className="section-title">Admin Hub</h1>
        </div>
        <p className="text-gray-500 ml-13">Manage your society — approve residents, broadcast notices, add helpers.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card animate-fade-in">
        {tab === 'pending' && (
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">
              Pending Approvals
            </h2>
            <PendingUsers refresh={refreshKey} />
          </div>
        )}
        {tab === 'broadcast' && (
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Megaphone size={20} className="text-primary-600" /> Broadcast a Notice
            </h2>
            <BroadcastNotice onSuccess={() => setRefreshKey((k) => k + 1)} />
          </div>
        )}
        {tab === 'helper' && (
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-primary-600" /> Add Trusted Helper
            </h2>
            <AddHelper onSuccess={() => setRefreshKey((k) => k + 1)} />
          </div>
        )}
      </div>
    </div>
  );
}
