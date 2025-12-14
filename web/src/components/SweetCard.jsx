import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Edit2, Trash2 } from 'lucide-react';

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
}) {
  const inStock = quantity > 0;
  const lowStock = quantity > 0 && quantity <= 5;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        {/* Image Container - Responsive height */}
        <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden bg-gradient-to-br from-[#FFF3E0] to-[#FFE8D6]">
          {imageUrl ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#F0F0F0] via-[#FFFFFF] to-[#F0F0F0] animate-pulse"></div>
              )}
              <motion.img
                src={imageUrl}
                alt={name}
                onLoad={() => setImageLoading(false)}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl bg-gradient-to-br from-[#F4A261] to-[#E9C46A]">
              🍬
            </div>
          )}

          {/* Stock Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 sm:top-3 right-2 sm:right-3"
          >
            {lowStock && (
              <span className="inline-block bg-[#FFB74D] text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                Low Stock
              </span>
            )}
            {!inStock && (
              <span className="inline-block bg-[#D84A4A] text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </motion.div>
        </div>

        {/* Content - Responsive padding */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block w-fit bg-[#FFF3E0] text-[#F4A261] text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg mb-2"
          >
            {category}
          </motion.span>

          {/* Name - Responsive text size */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1F1F1F] mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-2 sm:mb-3"
          >
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F4A261]">
              ₹{price.toFixed(2)}
            </p>
          </motion.div>

          {/* Stock Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${
              inStock ? 'text-[#2A9D8F]' : 'text-[#D84A4A]'
            }`}
          >
            {inStock ? `${quantity} available` : 'Out of Stock'}
          </motion.p>

          {/* Buttons - Responsive with touch-friendly sizes */}
          <div className="mt-auto flex gap-2">
            <motion.button
              whileHover={inStock ? { scale: 1.02 } : {}}
              whileTap={inStock ? { scale: 0.98 } : {}}
              onClick={onPurchase}
              disabled={!inStock}
              className="flex-1 py-2 sm:py-2.5 px-2 sm:px-3 bg-gradient-to-r from-[#F4A261] to-[#FF9A3C] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 hover:shadow-md text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
            >
              <ShoppingCart size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">Purchase</span>
              <span className="sm:hidden">Buy</span>
            </motion.button>

            {isAdmin && onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="py-2 sm:py-2.5 px-2 sm:px-3 bg-white border-2 border-[#F4A261] text-[#F4A261] font-semibold rounded-lg hover:bg-[#FFF3E0] transition-all duration-300 min-h-[44px] sm:min-h-[40px] flex items-center justify-center"
                aria-label="Edit sweet"
              >
                <Edit2 size={18} />
              </motion.button>
            )}

            {isAdmin && onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                className="py-2 sm:py-2.5 px-2 sm:px-3 bg-white border-2 border-[#D84A4A] text-[#D84A4A] font-semibold rounded-lg hover:bg-[#FFEBEE] transition-all duration-300 min-h-[44px] sm:min-h-[40px] flex items-center justify-center"
                aria-label="Delete sweet"
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
