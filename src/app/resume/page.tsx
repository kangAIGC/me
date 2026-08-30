"use client";

import { Navbar } from "@/components/Navbar";

/** GitHub Pages 子路径前缀（静态导出时注入） */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PDF_URL = `${BASE}/简历.pdf`;

export default function ResumePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 内容区域：全宽铺满，无外边距 */}
      <div className="flex w-full flex-1 flex-col min-h-0">
        {/* 查看提示条：单行紧凑，仅保留必要指引 */}
        <div className="flex shrink-0 w-full items-center justify-between gap-3 bg-[#FAFAFA] px-3 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-xs font-medium text-[#333333]">简历.pdf</span>
            <span className="truncate text-xs text-[#666666]">
              可直接滚动查看；如未正常显示，点击右侧按钮在新标签页打开
            </span>
          </div>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded bg-[#333333] px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-black"
          >
            新窗口打开
          </a>
        </div>

        {/* PDF 预览区域：占满剩余全部空间，无边框无圆角 */}
        <div className="relative flex-1 min-h-0 w-full">
          <iframe
            src={PDF_URL}
            className="absolute inset-0 h-full w-full border-0"
            title="简历.pdf"
          />
        </div>
      </div>

      {/* 底部作者信息：压缩为单行 */}
      <footer className="shrink-0 border-t border-[#E5E5E5] py-1.5">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 px-4 text-xs text-[#666666]">
          <span>徐文康</span>
          <span>tel: 18795907388</span>
          <span>mail: 2668087983@qq.com</span>
        </div>
      </footer>
    </div>
  );
}
