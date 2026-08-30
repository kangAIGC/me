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
        {/* PDF 预览区域：占满剩余全部空间，无边框无圆角 */}
        <div className="relative flex-1 min-h-0 w-full">
          <iframe
            src={PDF_URL}
            className="absolute inset-0 h-full w-full border-0"
            title="简历.pdf"
          />
        </div>
      </div>
    </div>
  );
}
