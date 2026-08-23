'use client';

import { useState } from 'react';
import {
  ADA_TOC,
  ASA_TOC,
  ADA_CONTENT,
  ASA_CONTENT,
  type TocItem,
  type PrdSection,
} from '@/data/prdContent';

function TocSidebar({
  toc,
  activeId,
  onNavigate,
}: {
  toc: TocItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="w-56 shrink-0 border-r border-[#E5E5E5] bg-[#FAFAFA] overflow-y-auto h-[calc(100vh-3.5rem)]">
      <nav className="py-4 px-3">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors ${
              item.level === 1
                ? 'font-medium text-[#1A1A1A] mt-2'
                : 'text-[#666666] pl-4'
            } ${
              activeId === item.id
                ? 'bg-[#E8E8E8] text-[#1A1A1A] font-medium'
                : 'hover:bg-[#F0F0F0]'
            }`}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function PrdContent({
  sections,
}: {
  sections: PrdSection[];
}) {
  return (
    <div className="px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              {section.title}
            </h2>
            {section.images && section.images.length > 0 && (
              <div className="mb-6 space-y-4">
                {section.images.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden bg-[#F5F5F5]">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
            {section.content && (
              <div className="text-[#333333] leading-[1.8] text-[15px] prd-content">
                {section.content.split('\n').map((paragraph, idx) => {
                  // Skip table lines (handled separately)
                  if (paragraph.startsWith('|')) {
                    return null;
                  }
                  // Skip empty lines
                  if (paragraph.trim() === '') {
                    return null;
                  }
                  // Handle horizontal rule
                  if (paragraph.trim() === '---') {
                    return <hr key={idx} className="my-6 border-t border-[#E5E5E5]" />;
                  }
                  // Handle list items
                  if (paragraph.startsWith('- **') || paragraph.startsWith('- ')) {
                    const boldMatch = paragraph.match(/^- \*\*([\s\S]+?)\*\*\s*(.*)$/);
                    return (
                      <div key={idx} className="ml-4 mb-2 flex">
                        <span className="mr-2 text-[#666666]">•</span>
                        <span>
                          {boldMatch ? (
                            <>
                              <strong className="font-semibold text-[#1A1A1A]">
                                {boldMatch[1]}
                              </strong>
                              {boldMatch[2] && (
                                <span>{boldMatch[2].replace(/\*\*/g, '')}</span>
                              )}
                            </>
                          ) : (
                            <span>{paragraph.replace(/^- /, '')}</span>
                          )}
                        </span>
                      </div>
                    );
                  }
                  // Handle bold-only paragraphs (section headers within content)
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={idx} className="font-bold mb-3 text-[#1A1A1A]">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  // Handle numbered list items
                  if (/^\d+\.\s/.test(paragraph)) {
                    const match = paragraph.match(/^(\d+)\.\s(.+)$/);
                    if (match) {
                      return (
                        <div key={idx} className="ml-4 mb-2 flex">
                          <span className="mr-2 text-[#666666] font-medium shrink-0">{match[1]}.</span>
                          <span>
                            {match[2].split(/(\*\*[^*]+\*\*)/).map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="font-semibold text-[#1A1A1A]">
                                    {part.replace(/\*\*/g, '')}
                                  </strong>
                                );
                              }
                              return <span key={pIdx}>{part}</span>;
                            })}
                          </span>
                        </div>
                      );
                    }
                  }
                  // Regular paragraph with inline bold
                  return (
                    <p key={idx} className="mb-3">
                      {paragraph.split(/(\*\*[^*]+\*\*)/).map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="font-semibold text-[#1A1A1A]">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
                {/* Render tables */}
                {section.content.includes('|') && (
                  <div className="my-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        {(() => {
                          const lines = section.content.split('\n').filter(l => l.startsWith('|'));
                          if (lines.length < 2) return null;
                          const headers = lines[0].split('|').filter(c => c.trim());
                          return (
                            <tr>
                              {headers.map((h, i) => (
                                <th key={i} className="border border-[#E5E5E5] px-3 py-2 bg-[#F5F5F5] font-medium text-left">
                                  {h.trim().replace(/\*\*/g, '')}
                                </th>
                              ))}
                            </tr>
                          );
                        })()}
                      </thead>
                      <tbody>
                        {(() => {
                          const lines = section.content.split('\n').filter(l => l.startsWith('|'));
                          return lines.slice(2).map((line, rowIdx) => {
                            const cells = line.split('|').filter(c => c.trim());
                            return (
                              <tr key={rowIdx}>
                                {cells.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="border border-[#E5E5E5] px-3 py-2">
                                    {cell.trim().replace(/\*\*/g, '')}
                                  </td>
                                ))}
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export function PrdPage() {
  const [activeProduct, setActiveProduct] = useState<'Agora.ai' | 'KnowFlow' | 'ArchDA'>('Agora.ai');
  const [activeSectionId, setActiveSectionId] = useState('ada-1-1');

  const toc = activeProduct === 'Agora.ai' ? ADA_TOC : ASA_TOC;
  const content = activeProduct === 'Agora.ai' ? ADA_CONTENT : ASA_CONTENT;

  const handleNavigate = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-1 flex-col h-screen">
      {/* Product Switch Tabs - Centered with max width */}
      <div className="shrink-0 bg-white px-4 py-2 flex items-center justify-center gap-2 w-full max-w-7xl mx-auto">
        <button
          onClick={() => {
            setActiveProduct('Agora.ai');
            setActiveSectionId('ada-1-1');
          }}
          className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
            activeProduct === 'Agora.ai'
              ? 'bg-[#333333] text-white shadow-md'
              : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
          }`}
        >
          Agora.ai
        </button>
        <button
          onClick={() => {
            setActiveProduct('KnowFlow');
            setActiveSectionId('asa-1-1');
          }}
          className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
            activeProduct === 'KnowFlow'
              ? 'bg-[#333333] text-white shadow-md'
              : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
          }`}
        >
          KnowFlow
        </button>
        <button
          onClick={() => {
            setActiveProduct('ArchDA');
            setActiveSectionId('archda-1-1');
          }}
          className={`flex-1 rounded px-4 py-2 text-sm font-medium transition-all ${
            activeProduct === 'ArchDA'
              ? 'bg-[#333333] text-white shadow-md'
              : 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
          }`}
        >
          ArchDA
        </button>
      </div>

      {/* Main Content - Feishu Document Embed (Centered with max width) */}
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto px-6">
        {/* Crop container to hide Feishu top navigation bar */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0" style={{ marginTop: '-56px' }}>
            <iframe
              key={activeProduct}
              src={
                activeProduct === 'Agora.ai'
                  ? 'https://vcnxjdphn663.feishu.cn/wiki/KscPwvr2ziA5HlkMicjcqWjcnKg'
                  : activeProduct === 'KnowFlow'
                  ? 'https://vcnxjdphn663.feishu.cn/wiki/KUi4wMcoTi2zNRk4L55cn7HWngb'
                  : 'https://vcnxjdphn663.feishu.cn/wiki/ATVBwBMaci46thkQH9PcRnzxnLg'
              }
              className="border-0"
              style={{ width: '100%', height: 'calc(100% + 56px)' }}
              title={`${activeProduct} PRD文档`}
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>
      </div>

      {/* Footer Author Info - Centered with max width */}
      <div className="shrink-0 border-t border-[#E5E5E5] px-4 py-3 text-center text-sm text-[#666666] bg-white w-full max-w-7xl mx-auto">
        <div>徐文康</div>
        <div>tel: 18795907388</div>
        <div>mail: 2668087983@qq.com</div>
      </div>
    </div>
  );
}
