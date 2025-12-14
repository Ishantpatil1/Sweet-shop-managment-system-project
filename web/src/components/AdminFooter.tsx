import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AdminFooterProps {
  year?: number;
  version?: string;
  environment?: 'dev' | 'prod' | 'staging';
  role?: string;
}

export default function AdminFooter({
  year = new Date().getFullYear(),
  version = '1.0.0',
  environment = 'prod',
  role = 'Administrator',
}: AdminFooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-auto bg-gradient-to-r from-[#FF9A3C] via-[#FFD166] to-[#F4A261] text-white"
    >
      {/* Top Divider */}
      <div className="border-t border-white/20"></div>

      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h3 className="text-sm font-bold mb-2 opacity-95">SweetMart Admin</h3>
            <p className="text-xs opacity-85">Version {version}</p>
            <p className="text-xs opacity-75 mt-1">Management System</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-bold mb-4 opacity-95">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-85">
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/manage-sweets" 
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Manage Sweets
                </Link>
              </li>
              <li>
                <a 
                  href="#purchases" 
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Purchase History
                </a>
              </li>
            </ul>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <h3 className="text-sm font-bold mb-4 opacity-95">System</h3>
            <p className="text-xs opacity-85 mb-2">
              Role: <span className="font-semibold opacity-95">{role}</span>
            </p>
            {environment !== 'prod' && (
              <p className="text-xs opacity-75">
                Environment: <span className="font-semibold uppercase">{environment}</span>
              </p>
            )}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm opacity-80">
            <p className="mb-3 md:mb-0">© {year} SweetMart. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart size={16} className="text-[#FFE5E5]" /> for shop management
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
