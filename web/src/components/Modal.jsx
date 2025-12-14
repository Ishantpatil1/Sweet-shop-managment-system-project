import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal content - Mobile: slide up from bottom, Desktop: center */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-[#6B6B6B] hover:text-[#1F1F1F] hover:bg-[#FFF3E0] rounded-lg transition-all duration-200 z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </motion.button>

            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E8E1D8] bg-gradient-to-r from-[#FFF8F0] to-white">
              <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-[#1F1F1F] pr-8">
                {title}
              </h2>
            </div>

            {/* Body - Scrollable on mobile if needed */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
              {children}
            </div>

            {/* Footer - Stack on mobile, flex on desktop */}
            {footer && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#E8E1D8] bg-gradient-to-r from-[#FFFBF5] to-white flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
