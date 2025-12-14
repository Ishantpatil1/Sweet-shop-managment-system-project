import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/manage', label: 'Manage Sweets' },
  { path: '#inventory', label: 'Inventory' },
  { path: '#purchases', label: 'Purchases' },
];

export default function AdminHeader({ userName = 'Admin', onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    if (path === '/admin/manage') return location.pathname === path;
    return false;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-[#FF9A3C] via-[#FFD166] to-[#F4A261] sticky top-0 z-40 shadow-md"
      role="banner"
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5"
          >
            <span className="text-2xl leading-none">🍬</span>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white leading-tight">
                SweetMart
              </h1>
              <p className="text-xs text-white/80 leading-tight">
                Admin
              </p>
            </div>
          </motion.div>

          {/* Center: Navigation Links */}
          <nav 
            className="hidden md:flex items-center gap-1" 
            role="navigation" 
            aria-label="Admin navigation"
          >
            {NAV_LINKS.slice(0, 2).map((link) => (
              <motion.a
                key={link.path}
                whileHover={{ y: -2 }}
                href={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-150 border-b-2 ${
                  isActive(link.path)
                    ? 'text-white border-white'
                    : 'text-white/80 border-transparent hover:text-white'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Right: Actions & Logout */}
          <div className="flex items-center gap-3">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 border-r border-white/30 pr-3">
              <span className="text-xs font-medium text-white/90 uppercase tracking-wide">
                {userName}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors duration-150"
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
