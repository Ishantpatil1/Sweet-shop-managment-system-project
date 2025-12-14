import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Floating emoji */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-7xl mb-6"
        aria-hidden="true"
      >
        🍬
      </motion.div>

      {/* Heading */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-[#1F1F1F] mb-2 text-center"
      >
        No Sweets Found
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[#6B6B6B] text-center max-w-xs leading-relaxed"
      >
        Try adjusting your search or filters to find delicious sweets
      </motion.p>
    </motion.div>
  );
}
