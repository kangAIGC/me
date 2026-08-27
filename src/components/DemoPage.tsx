'use client';

import { useState } from 'react';

// 静态导出时由 basePath 注入子路径前缀（GitHub Pages 部署在 /<repo>/ 下）
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Agora.ai 按版本区分视频（V2.0 / V1.0 暂与 V3.0 一致，待补充专属视频链接）
const AGORA_VIDEOS = {
  'V3.0': 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4',
  'V2.0': 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4',
  'V1.0': 'https://demovideo.tos-cn-shanghai.volces.com/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4',
};

const PRODUCT_VIDEOS = {
  KnowFlow: 'https://demovideo.tos-cn-shanghai.volces.com/%E8%A7%86%E9%A2%91.mp4',
};

const THUMBNAILS = {
  'Agora.ai': `${BASE}/agora封面.png`,
  KnowFlow: `${BASE}/封面.png`,
};

export function DemoPage() {
  const [activeProduct, setActiveProduct] = useState<'Agora.ai' | 'KnowFlow'>('Agora.ai');
  const [agoraVersion, setAgoraVersion] = useState<'V3.0' | 'V2.0' | 'V1.0'>('V3.0');

  const videoSrc = activeProduct === 'Agora.ai' ? AGORA_VIDEOS[agoraVersion] : PRODUCT_VIDEOS.KnowFlow;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Container - Centered with max width */}
      <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4">
        {/* Video Switch Buttons */}
        <div className="shrink-0 flex items-center justify-center gap-2 py-2 w-full">
          <button
            onClick={() => setActiveProduct('Agora.ai')}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
              activeProduct === 'Agora.ai'
                ? 'bg-[#333333] text-white shadow-md'
                : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
            }`}
          >
            Agora.ai
          </button>
          <button
            onClick={() => setActiveProduct('KnowFlow')}
            className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
              activeProduct === 'KnowFlow'
                ? 'bg-[#333333] text-white shadow-md'
                : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
            }`}
          >
            KnowFlow
          </button>
        </div>

        {/* Agora.ai 版本切换按钮 */}
        {activeProduct === 'Agora.ai' && (
          <div className="shrink-0 flex items-center justify-center gap-2 pb-1 w-full">
            {(['V3.0', 'V2.0', 'V1.0'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setAgoraVersion(v)}
                className={`min-w-[72px] rounded px-3 py-1 text-xs font-medium transition-all ${
                  agoraVersion === v
                    ? 'bg-[#333333] text-white shadow-sm'
                    : 'bg-white text-[#666666] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Video Display Area */}
        <div className="flex-1 flex items-center justify-center py-2 w-full">
          <div className="w-full">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-[#F5F5F5]" style={{ minHeight: '350px' }}>
              <video
                key={`${activeProduct}-${activeProduct === 'Agora.ai' ? agoraVersion : ''}`}
                src={videoSrc}
                poster={THUMBNAILS[activeProduct]}
                controls
                controlsList="nodownload"
                loop
                preload="metadata"
                className="w-full h-full object-contain"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="shrink-0 flex items-center justify-center gap-2 py-3 w-full">
          <div className="flex-1" />
          <div className="flex-1 flex items-center justify-center">
            {activeProduct === 'Agora.ai' && (
              <a
                href="https://kangaigc.github.io/Agora.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded px-4 py-2 text-sm font-bold bg-[#333333] text-white hover:bg-[#444444] transition-colors shadow-md text-center inline-block"
              >
                点击试用
              </a>
            )}
            {activeProduct === 'KnowFlow' && (
              <a
                href="https://kangaigc.github.io/KnowFlow/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded px-4 py-2 text-sm font-bold bg-[#333333] text-white hover:bg-[#444444] transition-colors shadow-md text-center inline-block"
              >
                点击试用
              </a>
            )}
          </div>
          <div className="flex-1" />
        </div>

        {/* Footer Author Info */}
        <div className="shrink-0 border-t border-[#E5E5E5] py-3 text-center text-sm text-[#666666] w-full">
          <div>徐文康</div>
          <div>tel: 18795907388</div>
          <div>mail: 2668087983@qq.com</div>
        </div>
      </div>
    </div>
  );
}
