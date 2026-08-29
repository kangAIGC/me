'use client';

import { useState } from 'react';

const PORTFOLIO_CATEGORIES = ['漫剧', '电商', '建筑'] as const;
type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('漫剧');

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* 分类切换按钮 —— 与 Demo页/Prd页 产品按钮的样式和位置保持一致 */}
      <div className="shrink-0 flex items-center justify-center gap-2 py-2 w-full max-w-7xl mx-auto px-4">
        {PORTFOLIO_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-[#333333] text-white shadow-md'
                : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
