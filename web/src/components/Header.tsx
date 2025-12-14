import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FF9A3C] via-[#FFD166] to-[#F4A261] border-b border-white/20 shadow-md">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center min-w-0">
            <a href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity duration-200">
              <span className="text-2xl font-bold text-white leading-tight">
                Kata
              </span>
              <span className="hidden sm:inline text-xs font-medium text-white/90 uppercase tracking-wide">
                Store
              </span>
            </a>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                      <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity duration-200">
              href="/store"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white"
            >
              Browse
            </a>
          </nav>
                      </Link>
          {/* Right: Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
                      <Link
                        to="/store"
              title="Sign out of your account"
            >
              <LogOut size={18} className="flex-shrink-0" />
                      </Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
