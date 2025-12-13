export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-5xl mb-4">🍬</div>
      <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No Sweets Found</h3>
      <p className="text-[#6B6B6B]">Try adjusting your search or filters</p>
    </div>
  );
}
