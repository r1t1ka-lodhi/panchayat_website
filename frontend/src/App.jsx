import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import EmergencyFAB from './components/EmergencyFAB.jsx';
import Auth from './pages/Auth.jsx';
import Chaupal from './pages/Chaupal.jsx';
import TrustCircle from './pages/TrustCircle.jsx';
import Vidhan from './pages/Vidhan.jsx';
import AdminHub from './pages/AdminHub.jsx';

// Protected route: must be logged in
const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// Admin-only route
const AdminOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="text-center animate-fade-in">
      <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 font-body">Loading Panchayat...</p>
    </div>
  </div>
);

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Protected><Chaupal /></Protected>} />
        <Route path="/helpers" element={<Protected><TrustCircle /></Protected>} />
        <Route path="/rules" element={<Protected><Vidhan /></Protected>} />
        <Route path="/admin" element={<AdminOnly><AdminHub /></AdminOnly>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <EmergencyFAB />}
    </BrowserRouter>
  );
}
