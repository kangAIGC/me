'use client';

import { useEffect, useMemo, useState } from 'react';

/** GitHub Pages 子路径前缀（静态导出时注入） */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const GUTTER = 16; // 间距 px，全局严格统一
const BREAKPOINTS: { minWidth: number; columns: number }[] = [
  { minWidth: 1280, columns: 5 },
  { minWidth: 1024, columns: 4 },
  { minWidth: 768, columns: 3 },
  { minWidth: 480, columns: 2 },
  { minWidth: 0, columns: 1 },
];

type Category = 'all' | 'manju' | 'ecom' | 'arch';

interface MediaItem {
  id: string;
  kind: 'image' | 'video';
  category: Exclude<Category, 'all'>;
  categoryLabel: string;
  title: string;
  description: string;
  /** 原始比例（宽/高），用于瀑布流渲染占位，避免初始布局塌陷 */
  ratio?: number;
  /** 媒体 URL（相对本地或绝对 CDN） */
  src: string;
  /** 可选：视频的海报图 */
  poster?: string;
}

/**
 * 构造图片数据（按三大分类 + 文件列目录对应）
 * 比例在图片加载后用 ResizeObserver/load 事件补齐，未加载前用默认 3:4，不影响瀑布流计算。
 */
const IMAGE_ITEMS: MediaItem[] = [
  // —— 漫剧 ——
  ...[
    ['青云大殿.png', '青云大殿', '漫剧场景概念设计：云雾萦绕的仙山宫殿。'],
    ['诛仙台.png', '诛仙台', '漫剧关键剧情场景：诛仙祭台。'],
    ['萧珩.png', '萧珩', '男主角·萧珩 角色立绘。'],
    ['苏挽.png', '苏挽', '女主角·苏挽 角色立绘。'],
    ['墨断剑红绳.png', '墨断剑与红绳', '关键道具概念：断剑与象征羁绊的红绳。'],
    ['灭门旧夜.png', '灭门旧夜', '第二幕回忆场景：雨夜的灭门之夜。'],
    ['玄青上人.png', '玄青上人', '配角·玄青上人 角色立绘。'],
    ['墨玉牌.png', '墨玉牌', '贯穿主线的信物·墨玉牌设定图。'],
  ].map<MediaItem>(([file, title, description]) => ({
    id: `manju-${file}`,
    kind: 'image',
    category: 'manju',
    categoryLabel: '漫剧',
    title,
    description,
    src: `${BASE}/漫剧/${encodeURIComponent(file)}`,
  })),

  // —— 电商 ——
  ...[1, 2, 3, 4, 5, 6].map<MediaItem>((n) => ({
    id: `ecom-${n}`,
    kind: 'image',
    category: 'ecom',
    categoryLabel: '电商',
    title: `电商作品 ${n}`,
    description: '电商视觉与商品详情页设计稿。',
    src: `${BASE}/电商/${n}.png`,
  })),

  // —— 建筑 ——
  // 1-8 为 .png，9-16 为 .jpeg
  ...Array.from({ length: 8 }, (_, i) => i + 1).map<MediaItem>((n) => ({
    id: `arch-${n}`,
    kind: 'image',
    category: 'arch',
    categoryLabel: '建筑',
    title: `建筑作品 ${n}`,
    description: '建筑概念渲染与空间设计。',
    src: `${BASE}/建筑/${n}.png`,
  })),
  ...Array.from({ length: 8 }, (_, i) => i + 9).map<MediaItem>((n) => ({
    id: `arch-${n}`,
    kind: 'image',
    category: 'arch',
    categoryLabel: '建筑',
    title: `建筑作品 ${n}`,
    description: '建筑概念渲染与空间设计。',
    src: `${BASE}/建筑/${n}.jpeg`,
  })),
];

/** 筛选分类按钮 */
const FILTERS: { key: Category; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'manju', label: '漫剧' },
  { key: 'ecom', label: '电商' },
  { key: 'arch', label: '建筑' },
];

export function PortfolioPage() {
  const [filter, setFilter] = useState<Category>('all');
  const [columns, setColumns] = useState<number>(4);
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);
  /** 为已加载到的图片补齐比例（宽/高），用于下一次布局重算 */
  const [ratios, setRatios] = useState<Record<string, number>>({});

  // —— 响应式：根据视口宽度确定列数 ——
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const match = BREAKPOINTS.find((b) => w >= b.minWidth)!;
      setColumns(match.columns);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // —— ESC 关闭详情弹窗 ——
  useEffect(() => {
    if (!openItem) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenItem(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openItem]);

  // —— 按分类过滤 ——
  const items = useMemo(
    () => (filter === 'all' ? IMAGE_ITEMS : IMAGE_ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  // —— 核心：最短列瀑布流算法，按 items -> columns 分配 ——
  const { columnWidth, columnsArray } = useMemo(() => {
    const colCount = Math.max(1, columns);
    // 先预估每个元素的高度(以"列宽"为基准，按比例或默认3:4)
    const sized = items.map((it) => {
      const r = ratios[it.id] ?? it.ratio ?? 0.75; // 默认 3:4（w:h）
      // 元素在列中的"占用高度"（以列宽为1的相对单位，不含 gap）
      // h = colWidth / ratio => 相对单位(以colWidth为1)就是 1/ratio
      return { it, relH: 1 / r };
    });

    const colHeights = new Array<number>(colCount).fill(0);
    const buckets: MediaItem[][] = Array.from({ length: colCount }, () => []);
    // 累计高度（含元素之间的 GUTTER，相对 colWidth）
    for (const { it, relH } of sized) {
      let idx = 0;
      let min = colHeights[0];
      for (let i = 1; i < colCount; i++) {
        if (colHeights[i] < min) {
          min = colHeights[i];
          idx = i;
        }
      }
      buckets[idx].push(it);
      colHeights[idx] = colHeights[idx] + relH; // 加上本卡片高度单位
      // 加上卡片之间的间距换算单位（GUTTER / colWidth，先用近似 0 不影响，渲染由 gap 处理）
      // 注意：视觉间距由父容器 flex gap 提供，这里只关心各列高度错落
    }
    return {
      columnsArray: buckets,
      columnWidth: `calc((100% - ${(colCount - 1) * GUTTER}px) / ${colCount})`,
    };
  }, [columns, items, ratios]);

  // 记录图片真实比例 -> 触发 useMemo 重新分桶
  function onImgLoaded(id: string, w: number, h: number) {
    if (!w || !h) return;
    setRatios((prev) => (prev[id] === w / h ? prev : { ...prev, [id]: w / h }));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* 分类筛选按钮 —— 风格与 Demo/Prd 页按钮一致 */}
      <div className="mx-auto mb-6 flex w-full justify-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={[
                'flex-1 rounded border px-4 py-2 text-sm font-medium transition-colors max-w-[260px]',
                active
                  ? 'border-[#333333] bg-[#333333] text-white shadow-md'
                  : 'border-[#E5E5E5] bg-white text-[#333333] hover:bg-[#F5F5F5]',
              ].join(' ')}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 瀑布流容器：多列 flex，每列一个 flex 容器，列高自适应 */}
      <div className="flex w-full" style={{ gap: `${GUTTER}px` }}>
        {columnsArray.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{ width: columnWidth, minWidth: 0 }}
            className="flex flex-col"
          >
            <div className="flex flex-col" style={{ gap: `${GUTTER}px` }}>
              {col.map((it) => (
                <Card
                  key={it.id}
                  item={it}
                  onLoad={onImgLoaded}
                  onClick={() => setOpenItem(it)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 点击查看详情 —— Lightbox 弹窗（半透明遮罩 + 居中大图） */}
      {openItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openItem.title}
          onClick={() => setOpenItem(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-fadeIn"
        >
          <div
            className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="关闭"
              onClick={() => setOpenItem(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm text-[#333] shadow hover:bg-white"
            >
              关闭 ×
            </button>
            <div className="flex max-h-[85vh] w-full flex-col md:flex-row">
              <div className="flex flex-1 items-center justify-center bg-[#FAFAFA] p-3 md:p-6">
                {openItem.kind === 'image' ? (
                  <img
                    src={openItem.src}
                    alt={openItem.title}
                    className="max-h-[65vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <video
                    src={openItem.src}
                    poster={openItem.poster}
                    controls
                    playsInline
                    className="max-h-[65vh] w-auto max-w-full"
                  />
                )}
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2 border-t border-[#E5E5E5] p-5 md:w-72 md:border-l md:border-t-0">
                <div className="inline-flex w-fit rounded bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#666]">
                  {openItem.categoryLabel}
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{openItem.title}</h3>
                <p className="text-sm leading-relaxed text-[#666]">{openItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 瀑布流卡片：带懒加载、淡入动画、悬停遮罩 */
function Card({
  item,
  onLoad,
  onClick,
}: {
  item: MediaItem;
  onLoad: (id: string, w: number, h: number) => void;
  onClick: () => void;
}) {
  const [show, setShow] = useState(false);
  // ratio 未知时先用 3:4 占位撑高，避免布局跳动；图片加载完成后 onLoad 会触发整体重算
  const aspect = `aspect-[3/4]`;

  return (
    <div
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-md border border-[#EFEFEF] bg-white transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 ${aspect} ${show ? 'opacity-100' : 'opacity-0'} animate-fadeInCard`}
    >
      {item.kind === 'image' ? (
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            const t = e.currentTarget;
            onLoad(item.id, t.naturalWidth, t.naturalHeight);
            setShow(true);
          }}
          onError={() => setShow(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <video
          src={item.src}
          poster={item.poster}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={(e) => {
            const t = e.currentTarget;
            onLoad(item.id, t.videoWidth, t.videoHeight);
            setShow(true);
          }}
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* 悬停遮罩：分类 + 标题 */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#333]">
            {item.categoryLabel}
          </span>
          <span className="truncate text-sm font-semibold text-white">{item.title}</span>
        </div>
      </div>
    </div>
  );
}
