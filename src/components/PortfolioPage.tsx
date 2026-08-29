'use client';

import { useState } from 'react';

const PORTFOLIO_CATEGORIES = ['漫剧', '电商', '建筑'] as const;
type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

// 静态导出时由 basePath 注入子路径前缀（GitHub Pages 部署在 /<repo>/ 下）
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type MediaKind = 'webpage' | 'video' | 'image';
interface MediaItem {
  kind: MediaKind;
  src: string;
  alt?: string;
}
interface CategoryContent {
  left: MediaItem; // 左侧大卡片：网页 iframe
  grid: MediaItem[]; // 右侧 2 列网格：第 1 行左侧是视频，其余为图片（按漫剧目录排版示例）
}

const CATEGORY_CONTENT: Record<PortfolioCategory, CategoryContent> = {
  漫剧: {
    left: {
      kind: 'webpage',
      src: `${BASE}/漫剧/html.html`,
    },
    grid: [
      // 第 1 行左：漫剧演示视频
      { kind: 'video', src: 'https://demovideo.tos-cn-shanghai.volces.com/mock-manju/video.mp4' },
      // 第 1 行右：图片
      { kind: 'image', src: `${BASE}/漫剧/青云大殿.png`, alt: '青云大殿' },
      // 第 2 行左
      { kind: 'image', src: `${BASE}/漫剧/诛仙台.png`, alt: '诛仙台' },
      // 第 2 行右
      { kind: 'image', src: `${BASE}/漫剧/萧珩.png`, alt: '萧珩' },
      // 第 3 行左
      { kind: 'image', src: `${BASE}/漫剧/苏挽.png`, alt: '苏挽' },
      // 第 3 行右
      { kind: 'image', src: `${BASE}/漫剧/墨断剑红绳.png`, alt: '墨断剑红绳' },
    ],
  },
  电商: {
    left: { kind: 'webpage', src: '' },
    grid: [
      { kind: 'video', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
    ],
  },
  建筑: {
    left: { kind: 'webpage', src: '' },
    grid: [
      { kind: 'video', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
      { kind: 'image', src: '' },
    ],
  },
};

function Placeholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex w-full h-full items-center justify-center rounded-md bg-[#F5F5F5] text-xs text-[#999999] ${className}`}
    >
      {label}
    </div>
  );
}

function MediaCard({ item, aspect }: { item: MediaItem; aspect?: string }) {
  const aspectCls = aspect ?? 'aspect-video';
  if (item.kind === 'video') {
    if (!item.src) {
      return (
        <div className={`w-full rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5] ${aspectCls}`}>
          <Placeholder label="视频占位，待补充视频链接" />
        </div>
      );
    }
    return (
      <div className={`w-full rounded-md border border-[#E5E5E5] overflow-hidden bg-black ${aspectCls}`}>
        <video src={item.src} controls className="w-full h-full object-contain" />
      </div>
    );
  }
  if (item.kind === 'image') {
    if (!item.src) {
      return (
        <div className={`w-full rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5] ${aspectCls}`}>
          <Placeholder label="图片占位" />
        </div>
      );
    }
    return (
      <div className={`w-full rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5] ${aspectCls}`}>
        <img src={item.src} alt={item.alt || ''} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
  // webpage
  if (!item.src) {
    return (
      <div className="w-full h-full min-h-[480px] rounded-md border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5]">
        <Placeholder label="Web Page" className="min-h-[480px]" />
      </div>
    );
  }
  return (
    <div className="w-full h-full min-h-[480px] rounded-md border border-[#E5E5E5] overflow-hidden bg-white">
      <iframe
        src={item.src}
        title={item.alt || 'webpage preview'}
        className="w-full h-full min-h-[480px] border-0 block bg-white"
        // 允许静态 HTML 渲染基础 JS/CSS；禁用表单提交与顶层跳转；same-origin 仅本地 html 需要访问自身资源
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('漫剧');
  const content = CATEGORY_CONTENT[activeCategory];

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

      {/* 内容排版：左 WebPage 大卡 + 右侧 2 列 6 卡网格（与示意图一致） */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-8 flex-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
          {/* 左：网页 iframe（大卡，占左侧整列） */}
          <div className="min-w-0 min-h-[480px] md:min-h-[calc(3*256px+2*16px)]">
            <MediaCard item={content.left} />
          </div>

          {/* 右：2 列 3 行网格（共 6 卡）；[0]视频, [1]图, [2]图, [3]图, [4]图, [5]图 */}
          <div className="grid grid-cols-2 gap-4 auto-rows-fr">
            {content.grid.map((item, idx) => (
              <div key={idx} className="min-w-0 min-h-[120px] md:min-h-[160px]">
                <MediaCard item={item} aspect="aspect-[4/3]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
