import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // For this assignment, we'll register with role in the request
      // Backend should accept role from frontend
      await api.post('/api/auth/register', { name: name.trim(), email: email.trim().toLowerCase(), password, role });
      setMessage('✨ Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFFBF5] to-[#FFE8D6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FFD166] to-[#F4A261] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#FF9A3C] to-[#FFD166] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-8"
          whileHover={{ boxShadow: '0 20px 50px rgba(244, 162, 97, 0.15)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-5xl mb-4 inline-block"
            >
              🍬
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl font-extrabold text-[#1F1F1F] mb-2"
            >
              Create your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-[#6B6B6B] text-sm leading-relaxed"
            >
              Join us to explore and manage delicious sweets.
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-5 p-4 bg-gradient-to-r from-[#FFEBEE] to-[#FFE0E6] border border-[#EF5350]/30 text-[#D84A4A] rounded-lg text-sm font-medium flex items-center gap-3"
              role="alert"
              aria-live="polite"
            >
              <span className="flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-5 p-4 bg-gradient-to-r from-[#E8F5F0] to-[#E0F7F4] border border-[#2A9D8F]/30 text-[#2A9D8F] rounded-lg text-sm font-medium flex items-center gap-3"
              role="status"
              aria-live="polite"
            >
              <span className="flex-shrink-0">✨</span>
              <span>{message}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-[#1F1F1F] mb-2">
                Full Name
              </label>
              <div className={`relative transition-all duration-300 rounded-xl ${focusedField === 'name' ? 'shadow-md' : 'shadow-sm'}`}>
                <User
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-[#F4A261]' : 'text-[#9E9E9E]'}`}
                  aria-hidden="true"
                />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={`w-full pl-11 pr-4 py-3 bg-white/60 border-2 rounded-xl outline-none transition-all duration-300 ${
                    focusedField === 'name'
                      ? 'border-[#F4A261] bg-white/90 shadow-lg shadow-[#F4A261]/20'
                      : 'border-transparent hover:bg-white/80'
                  } disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#BDBDBD]`}
                  aria-label="Full Name"
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F1F1F] mb-2">
                Email Address
              </label>
              <div className={`relative transition-all duration-300 rounded-xl ${focusedField === 'email' ? 'shadow-md' : 'shadow-sm'}`}>
                <Mail
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#F4A261]' : 'text-[#9E9E9E]'}`}
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={`w-full pl-11 pr-4 py-3 bg-white/60 border-2 rounded-xl outline-none transition-all duration-300 ${
                    focusedField === 'email'
                      ? 'border-[#F4A261] bg-white/90 shadow-lg shadow-[#F4A261]/20'
                      : 'border-transparent hover:bg-white/80'
                  } disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#BDBDBD]`}
                  aria-label="Email Address"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-[#1F1F1F] mb-2">
                Password
              </label>
              <div className={`relative transition-all duration-300 rounded-xl ${focusedField === 'password' ? 'shadow-md' : 'shadow-sm'}`}>
                <Lock
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#F4A261]' : 'text-[#9E9E9E]'}`}
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={`w-full pl-11 pr-4 py-3 bg-white/60 border-2 rounded-xl outline-none transition-all duration-300 ${
                    focusedField === 'password'
                      ? 'border-[#F4A261] bg-white/90 shadow-lg shadow-[#F4A261]/20'
                      : 'border-transparent hover:bg-white/80'
                  } disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#BDBDBD]`}
                  aria-label="Password"
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <fieldset>
                <legend className="block text-sm font-semibold text-[#1F1F1F] mb-3">I want to:</legend>
                <div className="grid grid-cols-2 gap-3">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      role === 'user'
                        ? 'border-[#F4A261] bg-[#FFF3E0]/50'
                        : 'border-transparent bg-white/40 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                      disabled={loading}
                      className="sr-only"
                      aria-label="Register as customer"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${role === 'user' ? 'border-[#F4A261] bg-[#F4A261]' : 'border-[#D0D0D0]'}`}>
                      {role === 'user' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-[#1F1F1F] font-medium flex-1">🛒 Shop</span>
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      role === 'admin'
                        ? 'border-[#F4A261] bg-[#FFF3E0]/50'
                        : 'border-transparent bg-white/40 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      disabled={loading}
                      className="sr-only"
                      aria-label="Register as admin"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${role === 'admin' ? 'border-[#F4A261] bg-[#F4A261]' : 'border-[#D0D0D0]'}`}>
                      {role === 'admin' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-[#1F1F1F] font-medium flex-1">⚙️ Manage</span>
                  </motion.label>
                </div>
              </fieldset>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="pt-2"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#F4A261] to-[#FF9A3C] hover:from-[#E9956A] hover:to-[#FF8C3C] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 text-center"
          >
            <p className="text-[#6B6B6B] text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#F4A261] font-semibold hover:text-[#FF9A3C] transition-colors duration-300 underline-offset-2 hover:underline"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
