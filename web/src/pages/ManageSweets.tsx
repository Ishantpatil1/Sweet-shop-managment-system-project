import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import Modal from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';
import SweetCard from '../components/SweetCard';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
import { useUser } from '../context/UserContext';
import api from '../api';

type Sweet = {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const initialFormState = { name: '', category: 'Indian', price: '', quantity: '' };

// Helper function to construct full image URLs
const getImageUrl = (imageUrl?: string): string | undefined => {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${apiBaseUrl}${imageUrl}`;
  }
  return imageUrl;
};

export default function ManageSweets() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'edit' | 'restock'>('add');
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockAmount, setRestockAmount] = useState('10');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/api/sweets');
      // Process image URLs for all sweets
      const processedSweets = res.data.map((sweet: Sweet) => ({
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
    if (user?.role !== 'admin') {
      navigate('/store', { replace: true });
      return;
    }
    load();
  }, [user, navigate]);

  const handleAddClick = () => {
    setActionType('add');
    setEditingId(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleEditClick = (sweet: Sweet) => {
    setActionType('edit');
    setEditingId(sweet._id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    });
    setModalOpen(true);
  };

  const handleRestockClick = (sweet: Sweet) => {
    setActionType('restock');
    setSelectedSweet(sweet);
    setRestockAmount('10');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const priceNum = parseFloat(formData.price);
    const qtyNum = parseInt(formData.quantity);
    if (!formData.name.trim()) {
      setErrorMessage('Sweet name is required');
      return;
    }
    if (!formData.category.trim()) {
      setErrorMessage('Category is required');
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setErrorMessage('Price must be a non-negative number');
      return;
    }
    if (!Number.isInteger(qtyNum) || qtyNum < 0) {
      setErrorMessage('Initial stock must be a non-negative integer');
      return;
    }
    setSubmitting(true);
    try {
      if (actionType === 'add') {
        const createRes = await api.post('/api/sweets', {
          name: formData.name,
          category: formData.category,
          price: priceNum,
          quantity: qtyNum,
          description,
        });
        const sweetId = createRes.data._id || createRes.data.id;
        if (imageFile && sweetId) {
          const fd = new FormData();
          fd.append('image', imageFile);
          await api.post(`/api/sweets/${sweetId}/image`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        setSuccessMessage('✨ Sweet added successfully!');
      } else if (actionType === 'edit' && editingId) {
        await api.put(`/api/sweets/${editingId}`, {
          name: formData.name,
          category: formData.category,
          price: priceNum,
          quantity: qtyNum,
          description,
        });
        if (imageFile) {
          const fd = new FormData();
          fd.append('image', imageFile);
          await api.post(`/api/sweets/${editingId}/image`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        setSuccessMessage('✏️ Sweet updated successfully!');
      }

      setModalOpen(false);
      load();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save sweet';
      console.error(msg);
      setErrorMessage(msg);
    }
      setSubmitting(false);
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSweet) return;

    try {
      await api.post(`/api/sweets/${selectedSweet._id}/restock`, {
        quantity: parseInt(restockAmount),
      });
      setSuccessMessage(`📦 Restocked +${restockAmount} units!`);
      setModalOpen(false);
      load();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to restock');
      alert('Failed to restock');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.delete(`/api/sweets/${id}`);
        setSuccessMessage('🗑️ Sweet deleted!');
        load();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Failed to delete sweet');
        alert('Failed to delete sweet');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Admin Header */}
      <AdminHeader onLogout={handleLogout} userName={user?.name || 'Admin'} />

      <div className="container">
        {/* Success Message */}
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 bg-white rounded-lg p-3 sm:p-4 shadow-lg border-l-4 border-[#2A9D8F] max-w-xs">
            <p className="text-sm sm:text-base">{successMessage}</p>
          </motion.div>
        )}

        {/* Action Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6 sm:my-8">
          <button onClick={handleAddClick} className="btn btn-primary flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
            <Plus size={20} />
            <span>Add New Sweet</span>
          </button>
        </motion.div>

        {/* Sweets Grid */}
        {loading ? (
          <div className="grid-sweets mb-16">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : sweets.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-12">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No sweets yet</h3>
            <p className="text-[#6B6B6B] mb-6">Start by adding your first sweet to the inventory.</p>
            <button onClick={handleAddClick} className="btn btn-primary inline-flex items-center gap-2">
              <Plus size={18} />
              Add First Sweet
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid-sweets mb-16">
            {sweets.map((sweet) => (
              <div key={sweet._id} className="card overflow-hidden hover:shadow-lg transition">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">{sweet.name}</h3>
                  <p className="text-sm text-[#6B6B6B] mb-3">{sweet.category}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-[#F4A261]">₹{sweet.price.toFixed(2)}</p>
                      <p className={`text-sm font-medium ${sweet.quantity === 0 ? 'text-[#D84A4A]' : sweet.quantity <= 5 ? 'text-[#F4A261]' : 'text-[#2A9D8F]'}`}>
                        Stock: {sweet.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button onClick={() => handleRestockClick(sweet)} className="btn btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                      <TrendingUp size={16} />
                      Restock
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(sweet)} className="btn btn-ghost flex-1 flex items-center justify-center gap-2 text-[#2A9D8F]">
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(sweet._id)} className="btn btn-ghost flex-1 flex items-center justify-center gap-2 text-[#D84A4A]">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={actionType === 'add' ? '➕ Add New Sweet' : actionType === 'edit' ? '✏️ Edit Sweet' : '📦 Restock Sweet'}>
          {actionType === 'restock' && selectedSweet ? (
            <form onSubmit={handleRestock} className="space-y-4">
              <div className="bg-[#FFF3E0] p-4 rounded-lg border border-[#F4A261]">
                <p className="text-[#F4A261] font-semibold">{selectedSweet.name}</p>
                <p className="text-sm text-[#6B6B6B]">Current Stock: {selectedSweet.quantity}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Restock Amount</label>
                <input type="number" value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} min="1" className="input w-full" />
              </div>

              <div className="flex gap-2 justify-between">
                {[10, 50, 100].map((preset) => (
                  <button key={preset} type="button" onClick={() => setRestockAmount(preset.toString())} className="btn btn-ghost text-sm flex-1">
                    +{preset}
                  </button>
                ))}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Confirm Restock
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Sweet Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Gulab Jamun" className="input w-full" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input w-full">
                  <option>Indian</option>
                  <option>Chocolate</option>
                  <option>Dry Fruits</option>
                  <option>Cakes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Price (₹)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Quantity</label>
                  <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="0" className="input w-full" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Description (optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input w-full" rows={3} placeholder="Tasting notes, ingredients, etc." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Image Upload</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="input w-full" />
              </div>

              {errorMessage && (
                <div className="text-[#D84A4A] bg-[#FFEBEE] border border-[#D84A4A] rounded p-2 text-sm">{errorMessage}</div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : actionType === 'add' ? 'Add Sweet' : 'Update Sweet'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* Footer */}
        <AdminFooter version="1.0.0" environment="prod" />
      </div>
    </div>
  );
}
