const PORTFOLIO_CATEGORIES = ['漫剧', '电商', '建筑'] as const;

export function PortfolioPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">Portfolio作品</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PORTFOLIO_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="flex h-40 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-xl font-semibold text-[#1A1A1A] transition-colors hover:bg-[#333333] hover:text-white"
          >
            {category}
          </button>
        ))}
      </div>
    </main>
  );
}
