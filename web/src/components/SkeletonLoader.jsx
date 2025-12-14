import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  const shimmerAnimation = {
    background: [
      'linear-gradient(90deg, #F0F0F0 0%, #FFFFFF 50%, #F0F0F0 100%)',
      'linear-gradient(90deg, #FFFFFF 0%, #F0F0F0 50%, #FFFFFF 100%)',
    ],
    backgroundSize: ['200% 100%', '200% 100%'],
    backgroundPosition: ['0% 0%', '100% 0%'],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
        {/* Image skeleton */}
        <motion.div
          animate={shimmerAnimation}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-full h-48 bg-[#F0F0F0]"
        />

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col space-y-3">
          {/* Category badge skeleton */}
          <motion.div
            animate={shimmerAnimation}
            transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
            className="h-6 w-20 rounded-lg bg-[#F0F0F0]"
          />

          {/* Title skeleton */}
          <motion.div
            animate={shimmerAnimation}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="h-6 w-3/4 rounded bg-[#F0F0F0]"
          />

          {/* Price skeleton */}
          <motion.div
            animate={shimmerAnimation}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="h-8 w-1/2 rounded bg-[#F0F0F0]"
          />

          {/* Stock text skeleton */}
          <motion.div
            animate={shimmerAnimation}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            className="h-5 w-1/3 rounded bg-[#F0F0F0]"
          />

          <div className="mt-auto">
            {/* Button skeleton */}
            <motion.div
              animate={shimmerAnimation}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="h-10 w-full rounded-lg bg-[#F0F0F0]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
