import { MetadataRoute } from 'next';

// output: export 模式下，metadata route 需显式声明为静态
export const dynamic = "force-static";

export default function robot(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/'],
    },
  };
}
