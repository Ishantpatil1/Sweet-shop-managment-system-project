import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email: email.trim().toLowerCase(), password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      // Decode JWT to get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ userId: payload.userId, role: payload.role, email: payload.email, name: payload.name });

      // Redirect based on role
      if (payload.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/store', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
            <div className="text-5xl mb-4">🍬</div>
            <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">SweetMart</h1>
            <p className="text-[#6B6B6B]">Welcome back</p>
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

          <form onSubmit={onSubmit} className="space-y-4">
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

            <button type="submit" disabled={loading} className="w-full btn btn-primary">
              {loading ? '🔄 Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6B6B6B]">
              No account?{' '}
              <Link to="/register" className="text-[#F4A261] font-semibold hover:text-[#E9C46A]">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
