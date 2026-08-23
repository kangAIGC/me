import type { NextConfig } from 'next';

// GitHub Pages 部署在 https://<user>.github.io/<repo>/ 子路径下，需要 basePath。
// 本地开发时不设置（undefined），生产构建时通过 NEXT_PUBLIC_BASE_PATH 注入。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // 静态导出（GitHub Pages 不支持 Node.js server）
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  // 静态导出无法使用 Next.js 图片优化，禁用
  images: {
    unoptimized: true,
  },
  // 开发环境 origin 白名单
  allowedDevOrigins: ['*.dev.coze.site'],
};

export default nextConfig;
