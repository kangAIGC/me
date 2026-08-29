const PORTFOLIO_CATEGORIES = ['漫剧', '电商', '建筑'] as const;

export function PortfolioPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">Portfolio作品</h1>
      <div className="mt-10 flex gap-2">
        {PORTFOLIO_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="flex-1 rounded px-4 py-2 text-sm font-medium transition-all bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]"
          >
            {category}
          </button>
        ))}
      </div>
    </main>
  );
}
