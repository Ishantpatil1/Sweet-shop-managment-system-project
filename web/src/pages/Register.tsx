import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // For this assignment, we'll register with role in the request
      // Backend should accept role from frontend
      await api.post('/api/auth/register', { name, email, password, role });
      setMessage('✨ Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">Join SweetMart</h1>
            <p className="text-[#6B6B6B]">Create your account to get started</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-[#FFEBEE] border border-[#D84A4A] text-[#D84A4A] rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-[#E8F5F0] border border-[#2A9D8F] text-[#2A9D8F] rounded-lg text-sm"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">I want to:</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 flex-1 p-3 border border-[#E8E1D8] rounded-lg cursor-pointer hover:bg-[#FFF3E0]" onClick={() => setRole('user')}>
                  <input type="radio" checked={role === 'user'} onChange={() => setRole('user')} disabled={loading} />
                  <span className="text-[#1F1F1F] font-medium">🛒 Shop</span>
                </label>
                <label className="flex items-center gap-2 flex-1 p-3 border border-[#E8E1D8] rounded-lg cursor-pointer hover:bg-[#FFF3E0]" onClick={() => setRole('admin')}>
                  <input type="radio" checked={role === 'admin'} onChange={() => setRole('admin')} disabled={loading} />
                  <span className="text-[#1F1F1F] font-medium">⚙️ Manage</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn btn-primary">
              {loading ? '🔄 Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6B6B6B]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#F4A261] font-semibold hover:text-[#E9C46A]">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
