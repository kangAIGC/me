'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 静态导出时由 basePath 注入子路径前缀（GitHub Pages 部署在 /<repo>/ 下）
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function Navbar() {
  const pathname = usePathname();
  // 归一化：去掉末尾 '/' 再比较，兼容 /prd 与 /prd/ 两种情况
  const normalized = pathname?.replace(/\/+$/, '') ?? '';
  const [activeTab, setActiveTab] = useState<'demo' | 'prd' | 'resume'>(
    normalized === '/prd' ? 'prd' : normalized === '/resume' ? 'resume' : 'demo'
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src={`${BASE}/1.jpg`} alt="KangAigc" className="h-8 w-8 rounded-full object-cover" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-[#1A1A1A]">Wenkang Xu</span>
            <span className="text-xs text-[#666666]">kangAIGC</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            onClick={() => setActiveTab('demo')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'demo'
                ? 'bg-[#333333] text-white'
                : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
            }`}
          >
            Demo演示
          </Link>
          <Link
            href="/prd"
            onClick={() => setActiveTab('prd')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'prd'
                ? 'bg-[#333333] text-white'
                : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
            }`}
          >
            Prd文档
          </Link>
          <Link
            href="/resume"
            onClick={() => setActiveTab('resume')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'resume'
                ? 'bg-[#333333] text-white'
                : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
            }`}
          >
            Resume简历
          </Link>
        </div>
      </div>
    </nav>
  );
}
