import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Header({ onLogout, userName = 'User' }) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FF9A3C] via-[#FFD166] to-[#F4A261] border-b border-white/20 shadow-md">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
              <span className="text-2xl font-bold text-white leading-tight">
                Kata
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-white/90 uppercase tracking-wide px-2 py-1 rounded-full bg-white/15">
                Storefront
              </span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
            <Link
              to="/store"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white/15 text-white/90 border border-white/25 hover:bg-white/30 hover:text-white transition-all duration-200 shadow-sm"
            >
              Browse
            </Link>
          </nav>

          {/* Right: User & Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex pr-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-semibold text-sm shadow-sm backdrop-blur">
                {userName}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-white text-[#C25400] text-sm font-semibold shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200 flex items-center gap-2 min-h-[44px] md:min-h-[40px]"
              aria-label="Logout"
              title="Sign out of your account"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
