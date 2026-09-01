"use client";

import { Navbar } from "@/components/Navbar";

/** 简历长图（TOS 直链：CDN 加速 + 1 年强缓存；文件更新时递增版本号以绕过缓存） */
const RESUME_IMG = 'https://demovideo.tos-cn-shanghai.volces.com/site-media/resume-v2.jpg';

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
