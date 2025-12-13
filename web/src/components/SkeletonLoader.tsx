export default function SkeletonLoader() {
  return (
    <div className="card animate-pulse">
      <div className="bg-[#E8E1D8] rounded-xl h-40 mb-4"></div>
      <div className="bg-[#E8E1D8] h-5 rounded mb-2 w-3/4"></div>
      <div className="bg-[#E8E1D8] h-4 rounded mb-4 w-1/2"></div>
      <div className="bg-[#E8E1D8] h-8 rounded mb-4 w-1/3"></div>
      <div className="bg-[#E8E1D8] h-10 rounded"></div>
    </div>
  );
}
