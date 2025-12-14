import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer({ variant = 'user' }) {
  const currentYear = new Date().getFullYear();

  if (variant === 'admin') {
    return (
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto bg-white border-t border-[#E8E1D8]"
      >
        <div className="container py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h3 className="text-sm font-bold text-[#1F1F1F] mb-2">SweetMart Admin</h3>
              <p className="text-xs text-[#6B6B6B]">Version 1.0.0</p>
              <p className="text-xs text-[#9E9E9E] mt-1">Management System</p>
            </motion.div>

            {/* Admin Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-sm font-bold text-[#1F1F1F] mb-3">Quick Links</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#dashboard" className="text-[#6B6B6B] hover:text-[#F4A261] transition-colors duration-200">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#manage" className="text-[#6B6B6B] hover:text-[#F4A261] transition-colors duration-200">
                    Manage Sweets
                  </a>
                </li>
                <li>
                  <a href="#purchases" className="text-[#6B6B6B] hover:text-[#F4A261] transition-colors duration-200">
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
              <h3 className="text-sm font-bold text-[#1F1F1F] mb-3">System</h3>
              <p className="text-xs text-[#6B6B6B] mb-2">Role: <span className="font-semibold text-[#F4A261]">Administrator</span></p>
              <p className="text-xs text-[#9E9E9E]">© {currentYear} SweetMart. All rights reserved.</p>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E8E1D8] mt-6 pt-6">
            <p className="text-center text-xs text-[#9E9E9E]">
              Built with <span className="text-[#D84A4A]">❤</span> for sweet shop management
            </p>
          </div>
        </div>
      </motion.footer>
    );
  }

  // User Variant
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🍬</span>
              <div>
                <h3 className="text-lg font-bold">SweetMart</h3>
                <p className="text-sm opacity-90">Fresh sweets, made with love</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-bold mb-4 opacity-95">Shop</h3>
            <ul className="space-y-2 text-sm opacity-85">
              <li>
                <a
                  href="#store"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Browse Sweets
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#orders"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  My Orders
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <h3 className="text-sm font-bold mb-4 opacity-95">Support</h3>
            <ul className="space-y-2 text-sm opacity-85">
              <li>
                <a
                  href="#help"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Help & FAQ
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:opacity-100 transition-opacity duration-200 hover:underline underline-offset-2"
                >
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-sm font-bold mb-4 opacity-95">Follow Us</h3>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm opacity-80">
            <p className="mb-3 md:mb-0">© {currentYear} SweetMart. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart size={16} className="text-[#FFE5E5]" /> for sweet lovers
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
