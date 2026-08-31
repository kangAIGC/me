"use client";

import { Navbar } from "@/components/Navbar";

/** GitHub Pages 子路径前缀（静态导出时注入） */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** 简历长图（中文与全角括号需 URL 编码，保证静态部署后可访问） */
const RESUME_IMG = `${BASE}/${encodeURIComponent("简历（正式版）.jpg")}`;

export default function ResumePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 内容区域：简历长图居中展示，纵向滚动查看 */}
      <div className="flex w-full flex-1 flex-col min-h-0 overflow-y-auto bg-[#F5F5F5]">
        <div className="mx-auto w-full max-w-[900px] px-2 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RESUME_IMG}
            alt="徐文康简历"
            width={2480}
            height={3508}
            loading="eager"
            decoding="async"
            className="block h-auto w-full rounded-sm bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
