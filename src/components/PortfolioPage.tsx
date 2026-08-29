'use client';

import { useState } from 'react';

const PORTFOLIO_CATEGORIES = ['漫剧', '电商', '建筑'] as const;
type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

const SUB_TABS = ['AI图像', 'AI视频', 'AI网页'] as const;
type SubTab = (typeof SUB_TABS)[number];

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('漫剧');
  const [activeTab, setActiveTab] = useState<SubTab>('AI图像');

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* 一级分类（漫剧 / 电商 / 建筑）—— 与 Demo页/Prd页 产品按钮保持一致 */}
      <div className="shrink-0 flex items-center justify-center gap-2 py-2 w-full max-w-7xl mx-auto px-4">
        {PORTFOLIO_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setActiveTab('AI图像');
            }}
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

      {/* 二级标签（AI图像 / AI视频 / AI网页）—— 同一套按钮风格，位于所选大类下方，居中且与一级按钮同宽度 */}
      <div className="shrink-0 flex items-center justify-center gap-2 pb-1 w-full max-w-7xl mx-auto px-4">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#333333] text-white shadow-md'
                : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
