import React from 'react';

interface SweetCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onPurchase: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export default function SweetCard({
  id,
  name,
  category,
  price,
  quantity,
  imageUrl,
  onPurchase,
  onEdit,
  onDelete,
  isAdmin = false,
}: SweetCardProps) {
  const inStock = quantity > 0;
  const lowStock = quantity > 0 && quantity <= 5;

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      {/* Image */}
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="rounded-xl h-40 w-full object-cover mb-4" />
      ) : (
        <div className="bg-gradient-to-br from-[#F4A261] to-[#E9C46A] rounded-xl h-40 mb-4 flex items-center justify-center text-white text-3xl">
          🍬
        </div>
      )}

      {/* Content */}
      <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">{name}</h3>

      <div className="flex items-center justify-between mb-3">
        <span className="badge badge-success text-xs">{category}</span>
        {lowStock && <span className="badge badge-warning text-xs">Low Stock</span>}
      </div>

      <p className="text-2xl font-bold text-[#F4A261] mb-3">₹{price.toFixed(2)}</p>

      <p className={`text-sm mb-4 ${inStock ? 'text-[#2A9D8F]' : 'text-[#D84A4A]'}`}>
        {inStock ? `🟢 In Stock (${quantity})` : '🔴 Out of Stock'}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onPurchase}
          disabled={!inStock}
          className="flex-1 btn btn-primary text-sm"
        >
          {inStock ? 'Purchase' : 'Out of Stock'}
        </button>

        {isAdmin && (
          <>
            <button onClick={onEdit} className="flex-1 btn btn-ghost text-sm">
              Edit
            </button>
            <button onClick={onDelete} className="btn btn-ghost text-sm text-[#D84A4A] hover:bg-[#FFEBEE]">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
