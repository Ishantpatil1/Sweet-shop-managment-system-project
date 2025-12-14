import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, Home } from 'lucide-react';
import Modal from '../components/Modal';
import api from '../api';

export default function Admin() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });

  const load = async () => {
    try {
      const res = await api.get('/api/sweets');
      setSweets(res.data);
    } catch (err) {
      console.error('Failed to load sweets');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal) {
        const res = await api.put(`/api/sweets/${showEditModal._id}`, {
          name: form.name,
          category: form.category,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        setSweets((prev) => prev.map((s) => (s._id === showEditModal._id ? res.data : s)));
        setShowEditModal(null);
      } else {
        const res = await api.post('/api/sweets', {
          name: form.name,
          category: form.category,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        setSweets((prev) => [...prev, res.data]);
        setShowAddModal(false);
      }
      setForm({ name: '', category: '', price: '', quantity: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save sweet');
    }
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    try {
      await api.delete(`/api/sweets/${showDeleteModal._id}`);
      setSweets((prev) => prev.filter((s) => s._id !== showDeleteModal._id));
      setShowDeleteModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async (id, amount) => {
    try {
      const res = await api.post(`/api/sweets/${id}/restock`, { quantity: amount });
      setSweets((prev) => prev.map((s) => (s._id === id ? res.data : s)));
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  };

  const openEditModal = (sweet) => {
    setForm({ name: sweet.name, category: sweet.category, price: String(sweet.price), quantity: String(sweet.quantity) });
    setShowEditModal(sweet);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E1D8] sticky top-0 z-40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚙️</div>
            <h1 className="text-2xl font-bold text-[#1F1F1F]">Admin Panel</h1>
          </div>
          <button onClick={() => navigate('/')} className="btn btn-ghost text-[#6B6B6B] flex items-center gap-2">
            <Home size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="container">
        {/* Add Sweet Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-8">
          <button onClick={() => { setForm({ name: '', category: '', price: '', quantity: '' }); setShowAddModal(true); }} className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add New Sweet
          </button>
        </motion.div>

        {/* Sweets Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Manage Sweets</h2>
          <div className="grid-sweets">
            {sweets.map((sweet) => (
              <motion.div key={sweet._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card group">
                <div className="bg-gradient-to-br from-[#F4A261] to-[#E9C46A] rounded-xl h-40 mb-4 flex items-center justify-center text-white text-3xl">
                  🍬
                </div>

                <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">{sweet.name}</h3>
                <span className="badge badge-success text-xs mb-3">{sweet.category}</span>

                <p className="text-2xl font-bold text-[#F4A261] mb-2">₹{sweet.price.toFixed(2)}</p>
                <p className="text-sm text-[#6B6B6B] mb-4">Stock: {sweet.quantity}</p>

                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRestock(sweet._id, 10)}
                      className="flex-1 btn btn-accent text-sm"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleRestock(sweet._id, 50)}
                      className="flex-1 btn btn-accent text-sm"
                    >
                      +50
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(sweet)}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(sweet)}
                    className="btn btn-ghost text-[#D84A4A] hover:bg-[#FFEBEE] text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || !!showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(null); }}
        title={showEditModal ? '✏️ Edit Sweet' : '➕ Add New Sweet'}
        footer={
          <>
            <button onClick={() => { setShowAddModal(false); setShowEditModal(null); }} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              {showEditModal ? 'Update' : 'Add'} Sweet
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Gulab Jamun"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Category *</label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g., Indian, Chocolate"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Quantity *</label>
              <input
                type="number"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="🗑️ Delete Sweet?"
        footer={
          <>
            <button onClick={() => setShowDeleteModal(null)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-ghost text-[#D84A4A] hover:bg-[#FFEBEE]">
              Delete
            </button>
          </>
        }
      >
        <p className="text-[#6B6B6B]">
          Are you sure you want to delete <strong>{showDeleteModal?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
