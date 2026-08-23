"use client";

import { Navbar } from "@/components/Navbar";

export default function ResumePage() {
  const feishuUrl = "https://vcnxjdphn663.feishu.cn/wiki/UW64wtICdijbdgkpaeocPeIZnpe?hideTopBar=true";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col">
        {/* 飞书文档区域 */}
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto px-4">
          <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
            <div
              className="absolute inset-0"
              style={{ marginTop: "-56px" }}
            >
              <iframe
                src={feishuUrl}
                className="w-full h-full border-0"
                style={{
                  width: "calc(100% + 0px)",
                  height: "calc(100% + 56px)",
                }}
                title="Resume"
                allow="clipboard-read; clipboard-write"
              />
            </div>
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
