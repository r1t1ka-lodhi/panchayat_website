import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Auth() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');   // 'login' | 'signup' | 'pending'
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', houseNo: '', wing: 'A',
  });

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      setMode('pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-pattern bg-cream flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sage-100 rounded-full opacity-30 translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-3xl leading-none">प</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-gray-900">Panchayat</h1>
          <p className="text-gray-500 text-sm mt-1">Society Connect · {mode === 'login' ? 'Welcome back!' : 'Join your community'}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          {/* Pending approval state */}
          {mode === 'pending' && (
            <div className="text-center py-4 animate-fade-in">
              <CheckCircle size={48} className="text-sage-600 mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl text-gray-900 mb-2">Registration Sent!</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Your request has been submitted to the society admin. You'll be notified once approved.
              </p>
              <button onClick={() => setMode('login')} className="btn-primary w-full">
                Back to Login
              </button>
            </div>
          )}

          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-5">Sign In</h2>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Email</label>
                <input name="email" type="email" required value={form.email}
                  onChange={handleChange} className="input-field" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} required
                    value={form.password} onChange={handleChange}
                    className="input-field pr-11" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                New resident?{' '}
                <button type="button" onClick={() => { setMode('signup'); setError(''); }}
                  className="text-primary-600 font-semibold hover:underline">
                  Request Access
                </button>
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center flex flex-col gap-1">
                <div>Demo Admin: <strong>admin@panchayat.com</strong> / <strong>Admin@123</strong></div>
                <div>Demo Resident: <strong>priya@example.com</strong> / <strong>Resident@123</strong></div>
              </div>
            </form>
          )}

          {/* Signup form */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-5">Request Access</h2>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Full Name</label>
                <input name="name" type="text" required value={form.name}
                  onChange={handleChange} className="input-field" placeholder="e.g. Mrs. Priya Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Wing</label>
                  <select name="wing" value={form.wing} onChange={handleChange} className="input-field">
                    {['A', 'B', 'C', 'D', 'E'].map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">House No.</label>
                  <input name="houseNo" type="text" required value={form.houseNo}
                    onChange={handleChange} className="input-field" placeholder="e.g. 201" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Email</label>
                <input name="email" type="email" required value={form.email}
                  onChange={handleChange} className="input-field" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} required minLength={6}
                    value={form.password} onChange={handleChange}
                    className="input-field pr-11" placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Submitting...' : 'Request Access'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Already a member?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }}
                  className="text-primary-600 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Panchayat © 2026 · Secure Community Connect
        </p>
      </div>
    </div>
  );
}
