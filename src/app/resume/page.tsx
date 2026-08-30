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

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col min-h-0 w-full max-w-7xl mx-auto px-4 py-2 gap-2">
          {/* 说明工具条：文件信息 + 查看方式提示 + 新窗口打开按钮 */}
          <div className="flex shrink-0 items-center justify-between gap-3 rounded border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#333333]">简历.pdf</div>
              <div className="text-xs text-[#666666]">
                简历已内嵌显示，可直接滚动查看；如未正常显示，请点击右侧按钮在新标签页打开
              </div>
            </div>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded bg-[#333333] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black"
            >
              新窗口打开
            </a>
          </div>

          {/* PDF 预览区域 */}
          <div className="flex-1 min-h-0">
            <iframe
              src={PDF_URL}
              className="h-full w-full rounded border border-[#E5E5E5]"
              title="简历.pdf"
            />
          </div>
        </div>
      </div>

      {/* 底部作者信息 */}
      <footer className="shrink-0 border-t border-[#E5E5E5] py-3">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#666666]">
          <div>徐文康</div>
          <div>tel: 18795907388</div>
          <div>mail: 2668087983@qq.com</div>
        </div>
      </footer>
    </div>
  );
}
