import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KangAigc',
  description: 'KangAigc - 建筑设计全流程智能体',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-white text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
