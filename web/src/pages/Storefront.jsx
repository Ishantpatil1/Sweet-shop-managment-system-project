import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import SweetCard from '../components/SweetCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';
import api from '../api';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
    return `${apiBaseUrl}${imageUrl}`;
  }
  return imageUrl;
};

export default function Storefront() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [purchaseModal, setPurchaseModal] = useState({ open: false });
  const [quantity, setQuantity] = useState(1);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');

  const categories = ['All', 'Indian', 'Chocolate', 'Dry Fruits', 'Cakes'];

  const load = async () => {
    try {
      const res = await api.get('/api/sweets');
      const processedSweets = res.data.map((sweet) => ({
        ...sweet,
        imageUrl: getImageUrl(sweet.imageUrl),
      }));
      setSweets(processedSweets);
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
    setContactName(user?.name || '');
    setContactEmail(user?.email || '');
  }, [user, navigate]);

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || sweet.category === selectedCategory;
    const matchesAvailability = inStockOnly ? sweet.quantity > 0 : true;
    const matchesPrice = maxPrice != null ? sweet.price <= maxPrice : true;
    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  });

  const handlePurchase = async () => {
    if (!purchaseModal.sweet) return;
    if (quantity < 1) {
      alert('❌ Quantity must be at least 1');
      return;
    }
    if (quantity > purchaseModal.sweet.quantity) {
      alert('❌ Quantity exceeds available stock');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/purchases', {
        sweetId: purchaseModal.sweet._id,
        quantity,
        deliveryNote,
        contactName,
        contactEmail,
        mobileNumber,
        deliveryAddress,
        paymentMethod,
      });
      setSweets((prev) =>
        prev.map((s) =>
          s._id === purchaseModal.sweet._id ? { ...s, quantity: s.quantity - quantity } : s,
        ),
      );
      const orderSummary = `✅ Order Placed Successfully!\n\n🍬 ${purchaseModal.sweet.name}\n📦 Qty: ${quantity}\n💰 Total: ₹${(purchaseModal.sweet.price * quantity).toFixed(2)}\n💳 Payment: ${paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : paymentMethod}\n\n👤 ${contactName}\n📱 ${mobileNumber}\n📧 ${contactEmail}\n📍 ${deliveryAddress}`;
      alert(orderSummary);
      setSuccessMessage(`✅ Order placed for ${quantity}x ${purchaseModal.sweet.name}!`);
      setPurchaseModal({ open: false });
      setQuantity(1);
      setDeliveryNote('');
      setMobileNumber('');
      setDeliveryAddress('');
      setPaymentMethod('cashOnDelivery');
      setContactName(user?.name || '');
      setContactEmail(user?.email || '');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      alert('❌ Purchase failed. Please try again.');
      console.error('Purchase error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <Header onLogout={handleLogout} />

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

      <div className="container py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-[#FFE3C7] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <label htmlFor="store-search" className="sr-only">Search sweets</label>
              <div className="relative flex items-center gap-2 rounded-xl bg-white border border-[#FFD8AF] focus-within:border-[#F4A261] focus-within:ring-2 focus-within:ring-[#F4A261]/20 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.2)] px-3 sm:px-4 py-2.5">
                <Search size={18} className="text-[#F4A261]" aria-hidden />
                <input
                  id="store-search"
                  type="text"
                  placeholder="Search sweets by name, category, or price…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#1F1F1F] text-sm sm:text-base"
                  aria-label="Search sweets"
                />
                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm('')}
                    className="p-1 text-[#9E9E9E] hover:text-[#F4A261] transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="category" className="text-xs font-semibold text-[#6B6B6B]">Category</label>
                  <select
                    id="category"
                    value={selectedCategory || 'All'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#FFD8AF] bg-white px-3 py-2 text-sm text-[#1F1F1F] focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#6B6B6B]">Max Price</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={50}
                      value={maxPrice ?? 1000}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="flex-1 accent-[#F4A261]"
                    />
                    <span className="text-sm font-semibold text-[#F4A261] whitespace-nowrap">₹{(maxPrice ?? 1000).toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-3 rounded-lg border border-[#FFD8AF] bg-white px-3 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#6B6B6B]">Availability</span>
                    <span className="text-sm text-[#1F1F1F]">In stock</span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 accent-[#F4A261]"
                      aria-label="Show in-stock only"
                    />
                  </label>
                </div>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#F4A261]" />
                  <span>Loading sweets…</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

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
                    id={sweet._id}
                    name={sweet.name}
                    category={sweet.category}
                    price={sweet.price}
                    quantity={sweet.quantity}
                    imageUrl={sweet.imageUrl}
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

      <Modal
        isOpen={purchaseModal.open}
        onClose={() => setPurchaseModal({ open: false })}
        title="🛍️ Complete Your Order"
        footer={
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPurchaseModal({ open: false })}
              className="btn btn-ghost px-6 py-2"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchase}
              className="btn btn-primary px-6 py-2 flex items-center gap-2"
              disabled={submitting || (purchaseModal.sweet ? purchaseModal.sweet.quantity === 0 : false)}
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                'Complete Purchase'
              )}
            </motion.button>
          </>
        }
      >
        {purchaseModal.sweet && (
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE8D6] rounded-xl p-4"
            >
              <p className="text-sm text-[#6B6B6B] mb-1">Sweet</p>
              <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">{purchaseModal.sweet.name}</h3>
              <p className="text-3xl font-extrabold text-[#F4A261]">₹{purchaseModal.sweet.price.toFixed(2)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#FFF3E0] text-[#F4A261] font-bold rounded-lg hover:bg-[#F4A261] hover:text-white transition-all duration-200"
                >
                  −
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max={purchaseModal.sweet.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  disabled={submitting}
                  className="w-16 px-3 py-2 text-center border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.min(purchaseModal.sweet.quantity, quantity + 1))}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#FFF3E0] text-[#F4A261] font-bold rounded-lg hover:bg-[#F4A261] hover:text-white transition-all duration-200"
                >
                  +
                </motion.button>
              </div>
              <p className="text-xs text-[#9E9E9E] mt-1">Max: {purchaseModal.sweet.quantity} items</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Your Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={submitting}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-white border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Your Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={submitting}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={submitting}
                placeholder="Your mobile number"
                className="w-full px-4 py-3 bg-white border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                disabled={submitting}
                placeholder="Enter complete delivery address"
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 resize-none disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-3">Payment Method</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-[#E8E1D8] cursor-pointer hover:bg-[#FFF3E0]/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cashOnDelivery"
                    checked={paymentMethod === 'cashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={submitting}
                    className="h-4 w-4 accent-[#F4A261]"
                  />
                  <div>
                    <p className="font-semibold text-[#1F1F1F]">💵 Cash on Delivery</p>
                    <p className="text-xs text-[#9E9E9E]">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Delivery Note (optional)</label>
              <textarea
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                disabled={submitting}
                placeholder="Any special instructions for delivery?"
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-[#E8E1D8] rounded-lg outline-none focus:border-[#F4A261] focus:ring-2 focus:ring-[#F4A261]/20 transition-all duration-300 resize-none disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-r from-[#F4A261] to-[#FF9A3C] text-white p-4 rounded-lg"
            >
              <p className="text-sm opacity-90 mb-1">Total Amount</p>
              <p className="text-3xl font-extrabold">₹{(purchaseModal.sweet.price * quantity).toFixed(2)}</p>
            </motion.div>
          </div>
        )}
      </Modal>
      <Footer variant="user" />
    </div>
  );
}
