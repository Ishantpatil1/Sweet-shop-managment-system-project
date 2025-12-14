import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LogOut, Plus, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import SweetCard from '../components/SweetCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import api from '../api';

type Sweet = {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<{ open: boolean; sweet?: Sweet }>({ open: false });
  const [quantity, setQuantity] = useState(1);


  const load = async () => {
    try {
      const res = await api.get('/api/sweets');
      setSweets(res.data);
    } catch (err) {
      console.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockCount = sweets.filter((s) => s.quantity > 0 && s.quantity <= 5).length;
  const totalSweets = sweets.length;

  const handlePurchase = async () => {
    if (!purchaseModal.sweet) return;
    try {
      await api.post(`/api/sweets/${purchaseModal.sweet._id}/purchase`, { quantity });
      setSweets((prev) =>
        prev.map((s) =>
          s._id === purchaseModal.sweet!._id ? { ...s, quantity: s.quantity - quantity } : s,
        ),
      );
      setPurchaseModal({ open: false });
    } catch (err) {
      alert('Purchase failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E1D8] sticky top-0 z-40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🍬</div>
            <h1 className="text-2xl font-bold text-[#1F1F1F]">Kata Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost text-[#6B6B6B] flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8"
        >
          <StatCard title="Total Sweets" value={totalSweets} icon="📦" color="primary" />
          <StatCard title="In Stock" value={totalStock} icon="🏪" color="accent" />
          <StatCard
            title="Low Stock"
            value={lowStockCount}
            icon="⚠️"
            color="secondary"
            trend={{ value: lowStockCount > 0 ? 1 : 0, direction: lowStockCount > 0 ? 'up' : 'down' }}
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="sales" stroke="#F4A261" strokeWidth={2} dot={{ fill: '#F4A261' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Sales by Category</h3>
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
                <h4 className="font-bold text-[#F4A261] mb-1">⚠️ Low Stock Alert</h4>
                <p className="text-[#6B6B6B]">
                  {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low. Consider restocking soon.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin')} className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Manage Sweets
            </button>
          </div>
        </motion.div>

        {/* Sweets Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Available Sweets</h2>

          {loading ? (
            <div className="grid-sweets">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : sweets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid-sweets">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  {...sweet}
                  onPurchase={() => {
                    setPurchaseModal({ open: true, sweet });
                    setQuantity(1);
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={purchaseModal.open}
        onClose={() => setPurchaseModal({ open: false })}
        title="🎁 Purchase Sweet"
        footer={
          <>
            <button onClick={() => setPurchaseModal({ open: false })} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handlePurchase} className="btn btn-primary">
              Confirm Purchase
            </button>
          </>
        }
      >
        {purchaseModal.sweet && (
          <div className="space-y-4">
            <div>
              <p className="text-[#6B6B6B] mb-2">Sweet: {purchaseModal.sweet.name}</p>
              <p className="text-2xl font-bold text-[#F4A261]">₹{purchaseModal.sweet.price.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                max={purchaseModal.sweet.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="bg-[#FFF3E0] p-3 rounded-lg">
              <p className="text-sm text-[#6B6B6B]">
                Total: <span className="font-bold text-[#F4A261]">₹{(purchaseModal.sweet.price * quantity).toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
