import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Search } from 'lucide-react';
import SweetCard from '../components/SweetCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { useUser } from '../context/UserContext';
import api from '../api';

type Sweet = {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export default function Storefront() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [purchaseModal, setPurchaseModal] = useState<{ open: boolean; sweet?: Sweet }>({ open: false });
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['All', 'Indian', 'Chocolate', 'Dry Fruits', 'Cakes'];

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
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    load();
  }, [user, navigate]);

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || sweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async () => {
    if (!purchaseModal.sweet) return;
    try {
      await api.post(`/api/sweets/${purchaseModal.sweet._id}/purchase`, { quantity });
      setSweets((prev) =>
        prev.map((s) =>
          s._id === purchaseModal.sweet!._id ? { ...s, quantity: s.quantity - quantity } : s,
        ),
      );
      setSuccessMessage(`🎉 Sweet choice! You ordered ${quantity} ${purchaseModal.sweet.name}(s)`);
      setPurchaseModal({ open: false });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Purchase failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#F4A261] via-[#E9C46A] to-[#F4A261] text-white py-12"
      >
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Fresh Sweets Made with Love 🍬</h1>
          <p className="text-lg opacity-90">Discover our delicious collection of premium sweets</p>
        </div>
      </motion.div>

      {/* Header */}
      <header className="bg-white border-b border-[#E8E1D8] sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛒</div>
            <h2 className="text-xl font-bold text-[#1F1F1F]">SweetMart Store</h2>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost text-[#6B6B6B] flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#E8F5F0] border border-[#2A9D8F] text-[#2A9D8F] px-6 py-3 rounded-lg shadow-lg"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="container py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 flex items-center gap-2 bg-[#FFF3E0] rounded-lg px-4 py-2">
                <Search size={20} className="text-[#F4A261]" />
                <input
                  type="text"
                  placeholder="Search sweets by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#1F1F1F]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#F4A261] text-white'
                      : 'bg-[#FFF3E0] text-[#F4A261] hover:bg-[#F4A261] hover:text-white'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sweets Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">
            {selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Sweets` : 'All Sweets'}
          </h2>

          {loading ? (
            <div className="grid-sweets">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : filteredSweets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid-sweets">
              {filteredSweets.map((sweet) => (
                <motion.div
                  key={sweet._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <SweetCard
                    {...sweet}
                    onPurchase={() => {
                      setPurchaseModal({ open: true, sweet });
                      setQuantity(1);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={purchaseModal.open}
        onClose={() => setPurchaseModal({ open: false })}
        title="🛍️ Complete Your Order"
        footer={
          <>
            <button onClick={() => setPurchaseModal({ open: false })} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handlePurchase} className="btn btn-primary">
              Complete Purchase
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
