import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/manage-sweets', label: 'Manage Sweets' },
];

export default function AdminHeader({ userName = 'Admin', onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
            className="hidden md:flex items-center gap-2"
            role="navigation"
            aria-label="Admin navigation"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.path}
                whileHover={{ y: -2 }}
                href={link.path}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 shadow-sm ${
                  isActive(link.path)
                    ? 'bg-white text-[#C25400] shadow-md scale-[1.02]'
                    : 'bg-white/15 text-white/90 border border-white/20 hover:bg-white/30 hover:text-white'
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
            <div className="hidden sm:flex items-center pr-3">
              <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-semibold text-white shadow-sm backdrop-blur">
                {userName}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#C25400] text-sm font-semibold shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-150"
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
