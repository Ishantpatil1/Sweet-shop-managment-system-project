import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, AlertCircle, Package } from 'lucide-react';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Modal from '../components/Modal';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
import { useUser } from '../context/UserContext';
import api from '../api';

const chartData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 200 },
  { name: 'Thu', sales: 278 },
  { name: 'Fri', sales: 190 },
  { name: 'Sat', sales: 229 },
  { name: 'Sun', sales: 200 },
];

const categoryData = [
  { name: 'Indian', value: 35 },
  { name: 'Chocolate', value: 25 },
  { name: 'Fruit', value: 20 },
  { name: 'Nuts', value: 20 },
];

const COLORS = ['#F4A261', '#2A9D8F', '#3A2E2A', '#E9C46A'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/api/sweets');
      setSweets(res.data);
      const m = await api.get('/api/admin/metrics');
      setMetrics(m.data);
      const pur = await api.get('/api/purchases');
      setPurchases(pur.data);
    } catch (err) {
      console.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/store', { replace: true });
      return;
    }
    load();
  }, [user, navigate]);

  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockCount = sweets.filter((s) => s.quantity > 0 && s.quantity <= 5).length;
  const totalSweets = sweets.length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Admin Header */}
      <AdminHeader onLogout={handleLogout} userName={user?.name || 'Admin'} />

      <div className="container">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6 sm:my-8"
        >
          <StatCard title="Total Sweets" value={metrics?.totalSweets ?? totalSweets} icon="📦" color="primary" />
          <StatCard title="In Stock" value={metrics?.totalStock ?? totalStock} icon="🏪" color="accent" />
          <StatCard
            title="Low Stock Alerts"
            value={metrics?.lowStockCount ?? lowStockCount}
            icon="⚠️"
            color="secondary"
            trend={{ value: lowStockCount > 0 ? 1 : 0, direction: lowStockCount > 0 ? 'up' : 'down' }}
          />
          <StatCard title="Total Purchases" value={metrics?.totalPurchases ?? purchases.length} icon="🧾" color="primary" />
        </motion.div>

        {/* Charts Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">📈 Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="sales" stroke="#F4A261" strokeWidth={2} dot={{ fill: '#F4A261' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">📊 Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        {lowStockCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8 border-l-4 border-[#F4A261] bg-[#FFF3E0]"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-[#F4A261] mt-1" />
              <div>
                <h4 className="font-bold text-[#F4A261] mb-1">⚠️ Inventory Alert</h4>
                <p className="text-[#6B6B6B]">
                  {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low. Consider restocking soon.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate('/admin/manage-sweets')} className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add New Sweet
            </button>
            <button onClick={() => navigate('/admin/manage-sweets')} className="btn btn-accent flex items-center gap-2">
              <Package size={18} />
              Manage Inventory
            </button>
          </div>
        </motion.div>

        {/* Recent Sweets */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">📋 Recent Inventory</h2>

          {loading ? (
            <div className="grid-sweets">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sweets.slice(0, 5).map((sweet) => (
                <div key={sweet._id} className="card flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold text-[#1F1F1F]">{sweet.name}</h3>
                    <p className="text-sm text-[#6B6B6B]">{sweet.category} • ₹{sweet.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${sweet.quantity === 0 ? 'bg-[#FFEBEE] text-[#D84A4A]' : sweet.quantity <= 5 ? 'bg-[#FFF3E0] text-[#F4A261]' : 'bg-[#E8F5F0] text-[#2A9D8F]'}`}>
                      Stock: {sweet.quantity}
                    </div>
                    <button onClick={() => navigate('/admin/manage-sweets')} className="btn btn-ghost text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Purchase History */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-10">
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">🧾 Purchase History</h2>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[#6B6B6B]">
                  <th className="py-3 px-4">Purchase ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4">Sweet Name</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 px-4 text-center text-[#6B6B6B]">No purchases yet</td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p._id} className="border-t border-[#E8E1D8]">
                      <td className="py-3 px-4 text-sm">{p._id}</td>
                      <td className="py-3 px-4">{p.userId?.name || p.contactName || '—'}</td>
                      <td className="py-3 px-4">{p.userId?.email || p.contactEmail || '—'}</td>
                      <td className="py-3 px-4">{p.sweetName}</td>
                      <td className="py-3 px-4">{p.quantity}</td>
                      <td className="py-3 px-4">₹{p.totalPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">{new Date(p.purchasedAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <AdminFooter version="1.0.0" environment="prod" />
    </div>
  );
}
