import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Home, Users, BookOpen, Shield, LogOut, Menu, X, Bell
} from 'lucide-react';

const navItems = [
  { to: '/',        label: 'Chaupal',      icon: Home    },
  { to: '/helpers', label: 'Trust Circle', icon: Users   },
  { to: '/rules',   label: 'Vidhan',       icon: BookOpen },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-bold text-lg leading-none">प</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-900 text-lg leading-tight">Panchayat</p>
              <p className="text-[10px] text-gray-400 leading-none -mt-0.5">Society Connect</p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                   ${isActive
                     ? 'bg-primary-50 text-primary-700'
                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                   ${isActive
                     ? 'bg-amber-50 text-amber-700'
                     : 'text-amber-600 hover:bg-amber-50'}`
                }
              >
                <Shield size={16} />
                Admin Hub
              </NavLink>
            )}
          </div>

          {/* User & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name?.split(' ')[0]}</p>
              <p className="text-xs text-gray-400">Wing {user?.wing}-{user?.houseNo}</p>
            </div>
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full
                 ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 w-full"
            >
              <Shield size={18} />
              Admin Hub
            </NavLink>
          )}
          <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between px-4 py-2">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">Wing {user?.wing}-{user?.houseNo}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 text-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
