'use client';

import { useEffect, useMemo, useState } from 'react';

/** GitHub Pages 子路径前缀（静态导出时注入） */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const GUTTER = 5; // 作品分隔缝（列间/列内卡片间全局统一），旧 16 → 8 → 5，更紧凑但仍保留区分度
const PAGE_PAD_X = 12; // 外层水平 padding (px)，旧 px-4 (=16) → 12 收缩
const PAGE_PAD_Y = 16; // 外层垂直 padding (px)，旧 py-6 (=24) → 16 收缩
const STRIP_TO_WATERFALL_MB = 1; // 2×2 视频带与图片瀑布流之间的间距 (px)，旧 mb-2 (=8) → 1

const BREAKPOINTS: { minWidth: number; columns: number }[] = [
  { minWidth: 1280, columns: 5 },
  { minWidth: 1024, columns: 4 },
  { minWidth: 768, columns: 3 },
  { minWidth: 480, columns: 2 },
  { minWidth: 0, columns: 1 },
];

const MAX_H = 600;
const MIN_H = 200;

/** 分类标签严格三分法：图片按源文件夹（电商/漫剧），视频统一为"视频" */
const CAT_LABEL: Record<CatKey, string> = {
  manju: '漫剧',
  ecom: '电商',
  arch: '电商', // 建筑文件夹图片也归入"电商"标签（三分法只保留 电商/漫剧/视频）
};
const VIDEO_LABEL = '视频'; // 所有视频的统一标签

interface MediaItem {
  id: string;
  kind: 'image' | 'video';
  category: CatKey;
  categoryLabel: string;
  title: string;
  description: string;
  /** 已知时可直接给出（宽/高），否则加载后补齐 */
  ratio?: number;
  src: string;
  poster?: string;
}

/** 瀑布流中：按列宽与 ratio 计算卡片高度(px)，夹到 [MIN_H, MAX_H] */
function clampedHeight(ratio: number, colWidth: number) {
  const raw = ratio > 0 ? colWidth / ratio : colWidth * (4 / 3);
  return Math.max(MIN_H, Math.min(MAX_H, raw));
}

/* ---------- 数据源（34 项：30 图 + 4 视频） ---------- */

const IMAGE_ITEMS: MediaItem[] = [
  // 漫剧(8) → 标签"漫剧"
  ...[
    ['青云大殿.png', '青云大殿'],
    ['诛仙台.png', '诛仙台'],
    ['萧珩.png', '萧珩'],
    ['苏挽.png', '苏挽'],
    ['墨断剑红绳.png', '墨断剑与红绳'],
    ['灭门旧夜.png', '灭门旧夜'],
    ['玄青上人.png', '玄青上人'],
    ['墨玉牌.png', '墨玉牌'],
  ].map<MediaItem>(([file, title]) => ({
    id: `manju-img-${file}`,
    kind: 'image',
    category: 'manju',
    categoryLabel: CAT_LABEL.manju,
    title,
    description: title,
    src: `${BASE}/漫剧/${encodeURIComponent(file)}`,
  })),

  // 电商(6) → 标签"电商"
  ...Array.from({ length: 6 }, (_, i) => i + 1).map<MediaItem>((n) => ({
    id: `ecom-img-${n}`,
    kind: 'image',
    category: 'ecom',
    categoryLabel: CAT_LABEL.ecom,
    title: `电商作品 ${n}`,
    description: `电商作品 ${n}`,
    src: `${BASE}/电商/${n}.png`,
  })),

  // 建筑(16): 1-8 png, 9-16 jpeg → 标签"电商"
  ...Array.from({ length: 8 }, (_, i) => i + 1).map<MediaItem>((n) => ({
    id: `arch-img-${n}-png`,
    kind: 'image',
    category: 'arch',
    categoryLabel: CAT_LABEL.arch,
    title: `建筑作品 ${n}`,
    description: `建筑作品 ${n}`,
    src: `${BASE}/建筑/${n}.png`,
  })),
  ...Array.from({ length: 8 }, (_, i) => i + 9).map<MediaItem>((n) => ({
    id: `arch-img-${n}-jpeg`,
    kind: 'image',
    category: 'arch',
    categoryLabel: CAT_LABEL.arch,
    title: `建筑作品 ${n}`,
    description: `建筑作品 ${n}`,
    src: `${BASE}/建筑/${n}.jpeg`,
  })),
];

const VIDEO_ITEMS: MediaItem[] = [
  {
    id: 'v-manju-chengpin',
    kind: 'video',
    category: 'manju',
    categoryLabel: VIDEO_LABEL,
    title: '漫剧成片',
    description: '漫剧成片',
    // 封面修复：不再使用外部静态图 poster（此前与视频内容不符），直接展示视频首帧
    src: 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%AB%E5%89%A7%E6%88%90%E5%93%81.mp4',
    ratio: 16 / 9,
  },
  {
    id: 'v-manju-tour-1',
    kind: 'video',
    category: 'manju',
    categoryLabel: VIDEO_LABEL,
    title: '漫游视频 1',
    description: '漫游视频 1',
    src: 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%AB%E6%B8%B8%E8%A7%86%E9%A2%911.mp4',
    ratio: 16 / 9,
  },
  {
    id: 'v-manju-tour-2',
    kind: 'video',
    category: 'manju',
    categoryLabel: VIDEO_LABEL,
    title: '漫游视频 2',
    description: '漫游视频 2',
    src: 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%AB%E6%B8%B8%E8%A7%86%E9%A2%912.mp4',
    ratio: 16 / 9,
  },
  {
    id: 'v-arch-1',
    kind: 'video',
    category: 'arch',
    categoryLabel: VIDEO_LABEL,
    title: '建筑动画 1',
    description: '建筑动画 1',
    src: 'https://demovideo.tos-cn-shanghai.volces.com/1.mp4',
    ratio: 16 / 9,
  },
];

/* 瀑布流仅处理图片（视频独立放在顶部 2×2 特色区，不参与打散） */
const SHUFFLE_ITEMS: MediaItem[] = IMAGE_ITEMS;
const TOTAL_COUNT = SHUFFLE_ITEMS.length;

/* ---------- 打散算法：随机 + 均衡 + 最大连续 3 ---------- */

function fisherYates<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 均衡打散：保证比例基本一致、同类不连续超过 MAX_RUN 项。
 * 策略：按各分类"剩余配额"加权轮询抽取，天然分布均衡；事后做一次 repair，滑窗修掉超长连续段。
 */
const MAX_RUN = 3;
function balancedShuffle<T extends { category: string }>(items: T[]): T[] {
  if (items.length === 0) return [];
  // 统计各分类总体目标配额
  const target = new Map<string, number>();
  for (const it of items) target.set(it.category, (target.get(it.category) ?? 0) + 1);

  const remaining = new Map<string, T[]>(
    Array.from(target.keys()).map((k) => [k, items.filter((i) => i.category === k)]),
  );
  for (const [, arr] of remaining) {
    // 分类内部也先做一次 Fisher-Yates，避免同一文件夹顺序被保留
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  const result: T[] = [];
  let runKey: string | null = null;
  let runLen = 0;

  while (result.length < items.length) {
    // 候选：还有剩余的分类
    const candidates = Array.from(remaining.entries()).filter(([, arr]) => arr.length > 0);
    if (candidates.length === 0) break;

    // 若已达 MAX_RUN，排除同类
    const allowed =
      runLen >= MAX_RUN
        ? candidates.filter(([k]) => k !== runKey)
        : candidates;
    const pool = allowed.length > 0 ? allowed : candidates;

    // 按"剩余配额"加权抽取（剩余越多越容易被抽到），实现各段均匀
    const totalLeft = pool.reduce<number>((s, [, arr]) => s + arr.length, 0) || 1;
    let r = Math.random() * totalLeft;
    let pick: [string, T[]] = pool[0];
    for (const c of pool) {
      r -= c[1].length;
      if (r <= 0) {
        pick = c;
        break;
      }
    }
    const [pKey, pArr] = pick;
    const item = pArr.pop()!;
    result.push(item);

    if (pKey === runKey) runLen++;
    else {
      runKey = pKey;
      runLen = 1;
    }
  }

  // 兜底 repair：若仍出现超过 MAX_RUN 的同类（例如某类只剩它自己），则滑窗跟后面的异类交换
  for (let start = 0; start < result.length - 1; ) {
    let end = start;
    while (end + 1 < result.length && result[end + 1].category === result[start].category) {
      end++;
    }
    const run = end - start + 1;
    if (run > MAX_RUN) {
      // 找到 [start, end] 段中 MAX_RUN 后面第一个位置，与后面最近的异类交换
      const swapAt = start + MAX_RUN;
      let swapWith = end + 1;
      while (swapWith < result.length && result[swapWith].category === result[start].category) {
        swapWith++;
      }
      if (swapWith < result.length) {
        [result[swapAt], result[swapWith]] = [result[swapWith], result[swapAt]];
        // 重新从段首检查(交换后可能引入新段)
        start = swapAt;
        continue;
      }
    }
    start = end + 1;
  }

  return result;
}

/* ---------- 组件 ---------- */

export function PortfolioPage() {
  const [columns, setColumns] = useState<number>(4);
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);
  /** 已探测到的真实比例(id -> w/h)，用于下次布局 */
  const [ratios, setRatios] = useState<Record<string, number>>({});
  /** 为"每次刷新"提供新的打散顺序种子（触发 useMemo 重新洗牌） */
  const [shuffleSeed, setShuffleSeed] = useState<number>(() => Math.random());

  // 响应式列数
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

  // 每次挂载(刷新)用新种子 → 每次顺序都不一样，验证"随机性"
  useEffect(() => {
    setShuffleSeed(Math.random());
  }, []);

  // ESC 关闭
  useEffect(() => {
    if (!openItem) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenItem(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openItem]);

  // 混合展示顺序（shuffleSeed 变则重新洗牌）—— 仅图片 30 张参与打散瀑布
  const shuffledItems = useMemo(
    () => balancedShuffle(SHUFFLE_ITEMS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shuffleSeed],
  );

  // 最短列分桶 + 基于 clamp 高度近似的列高累计
  const { columnWidth, columnsArray, containerWidth } = useMemo(() => {
    const colCount = Math.max(1, columns);
    // 容器按 max-w-7xl（1280px）- padding 近似，但我们用"列宽计算式"配合实际渲染，
    // 这里用占位 colWidthEstimate=320 来算分桶的相对累计高度（不会影响最终显示的真实高度，只是决定哪个列"更矮"）
    const colWidthEstimate = 320;

    const sized = shuffledItems.map((it) => {
      const r = ratios[it.id] ?? it.ratio ?? 0.75;
      return { it, pxH: clampedHeight(r, colWidthEstimate) };
    });

    const colHeights = new Array<number>(colCount).fill(0);
    const buckets: MediaItem[][] = Array.from({ length: colCount }, () => []);

    for (const { it, pxH } of sized) {
      let idx = 0;
      let min = colHeights[0];
      for (let i = 1; i < colCount; i++) {
        if (colHeights[i] < min) {
          min = colHeights[i];
          idx = i;
        }
      }
      buckets[idx].push(it);
      colHeights[idx] = colHeights[idx] + pxH + GUTTER;
    }

    return {
      columnsArray: buckets,
      columnWidth: `calc((100% - ${(colCount - 1) * GUTTER}px) / ${colCount})`,
      containerWidth: colCount * colWidthEstimate + (colCount - 1) * GUTTER,
    };
  }, [columns, shuffledItems, ratios]);

  function onMediaLoad(id: string, w: number, h: number) {
    if (!w || !h) return;
    const ratio = w / h;
    setRatios((prev) => (prev[id] === ratio ? prev : { ...prev, [id]: ratio }));
  }

  return (
    <div
      className="mx-auto w-full max-w-7xl"
      style={{ paddingTop: PAGE_PAD_Y, paddingBottom: PAGE_PAD_Y, paddingLeft: PAGE_PAD_X, paddingRight: PAGE_PAD_X }}
    >
      {/* ======= 顶部 2×2 视频区（最前端 · 外层样式与图片卡统一） ======= */}
      <section
        aria-label="特色视频"
        style={{ marginBottom: STRIP_TO_WATERFALL_MB }}
      >
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gap: `${GUTTER}px`,
          }}
        >
          {VIDEO_ITEMS.map((v) => (
            <div
              key={v.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpenItem(v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenItem(v);
                }
              }}
              // 视频卡外层与图片卡完全一致：圆角 1px 浅灰边、白底、hover 统一效果（去掉之前的黑粗边 / 黑底）
              className="group relative w-full cursor-pointer overflow-hidden rounded-md border border-[#F1F1F1] bg-white transition-all duration-300 ease-out hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]"
              style={{ aspectRatio: (v.ratio ?? 16 / 9).toString(), maxHeight: MAX_H, minHeight: MIN_H }}
            >
              <video
                src={v.src}
                preload="auto"
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={(e) => {
                  const el = e.currentTarget;
                  if (el.paused) el.play().catch(() => {});
                }}
                onWaiting={(e) => {
                  const el = e.currentTarget;
                  el.setAttribute('data-waiting', '1');
                  setTimeout(() => el.removeAttribute('data-waiting'), 300);
                }}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              {/* 下方信息条（分类 + 标题）与图片卡的遮罩风格一致 */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#333]">
                    {v.categoryLabel}
                  </span>
                  <span className="truncate text-sm font-semibold text-white">{v.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= 图片作品瀑布流（主内容区 · 不包含视频） ======= */}
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
                  ratio={ratios[it.id] ?? it.ratio}
                  onLoad={onMediaLoad}
                  onClick={() => setOpenItem(it)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox 详情弹窗 —— 只展示媒体本体 + 关闭按钮（无右侧文字面板） */}
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
            <div className="flex max-h-[85vh] w-full items-center justify-center bg-[#FAFAFA] p-3 md:p-6">
              {openItem.kind === 'image' ? (
                <img
                  src={openItem.src}
                  alt={openItem.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              ) : (
                <video
                  src={openItem.src}
                  poster={openItem.poster}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[75vh] w-auto max-w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 卡片：高度按原始比例 + [200,600] clamp ---------- */

function Card({
  item,
  ratio,
  onLoad,
  onClick,
}: {
  item: MediaItem;
  ratio?: number;
  onLoad: (id: string, w: number, h: number) => void;
  onClick: () => void;
}) {
  const [shown, setShown] = useState(false);
  // 当 ratio 已知时，给外层 div 一个"按列宽100%的 h=colWidth/ratio"的高度，
  // 并强制 clamp(200..600)。未知时先用 3:4，等 onLoad 触发重算。
  const r = ratio ?? item.ratio ?? 0.75;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={[
        'group relative w-full cursor-pointer overflow-hidden rounded-md border border-[#F1F1F1] bg-white',
        'transition-all duration-300 ease-out hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]',
        shown ? 'opacity-100' : 'opacity-0 animate-fadeInCard',
      ].join(' ')}
      style={{
        // padding-top 的方式实现"根据容器宽度+比例"的响应式高度，避免硬编码像素影响响应式。
        // 再用 maxHeight/minHeight 的 CSS 变量 + 媒体查询在 style 里做 clamp 兜底
        aspectRatio: `${r}`,
        // 但 aspectRatio 不能控制高度上限，所以还要给 maxHeight/minHeight
        maxHeight: MAX_H,
        minHeight: MIN_H,
      }}
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
            setShown(true);
          }}
          onError={() => setShown(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
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
            setShown(true);
          }}
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            try {
              e.currentTarget.currentTime = 0;
            } catch {
              /* ignore */
            }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* 悬停遮罩：分类标签 + 标题 */}
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
