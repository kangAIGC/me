/**
 * TOS 补充上传：站点零散媒体（Demo 封面 / Navbar logo / 简历长图）
 * 复用 upload-tos.mjs 的凭证读取与重试逻辑，上传至 site-media/ 前缀
 * 用法：node scripts/upload-tos-extra.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import tosModule from '@volcengine/tos-sdk';

const TOS = tosModule.TosClient ?? tosModule.default ?? tosModule;

const envPath = path.resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }),
);
const { TOS_ACCESS_KEY: ak, TOS_SECRET_KEY: sk, TOS_BUCKET: bucket, TOS_REGION: region } = env;
if (!ak || !sk) {
  console.error('缺少 TOS 凭证（.env.local）');
  process.exit(1);
}

const client = new TOS({
  accessKeyId: ak,
  accessKeySecret: sk,
  region: region || 'cn-shanghai',
  endpoint: env.TOS_ENDPOINT || 'tos-cn-shanghai.volces.com',
});

/** 本地文件 → TOS key（英文安全命名） */
const FILES = [
  ['agora封面.png', 'site-media/agora-cover.png', 'image/png'],
  ['ADA封面.png', 'site-media/ada-cover.png', 'image/png'],
  ['ArchDA封面.png', 'site-media/archda-cover.png', 'image/png'],
  ['1.png', 'site-media/knowflow-v2-cover.png', 'image/png'],
  ['封面2.png', 'site-media/knowflow-v1-cover.png', 'image/png'],
  ['1.jpg', 'site-media/logo.jpg', 'image/jpeg'],
  ['简历（正式版）.jpg', 'site-media/resume-v2.jpg', 'image/jpeg'],
];

async function uploadOne(job, attempt = 1) {
  try {
    await client.putObjectFromFile({
      bucket,
      key: job.key,
      filePath: job.local,
      acl: 'public-read',
      headers: { 'x-tos-server-side-encryption': undefined },
      options: {
        contentType: job.ctype,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    const kb = (fs.statSync(job.local).size / 1024).toFixed(0);
    console.log(`OK ${job.key} (${kb} KB)`);
  } catch (e) {
    if (attempt < 3) {
      const wait = 2 ** attempt * 800;
      console.warn(`RETRY ${job.key} attempt${attempt}: ${e.message}`);
      await new Promise((r) => setTimeout(r, wait));
      return uploadOne(job, attempt + 1);
    }
    console.error(`FAIL ${job.key}: ${e.message}`);
    process.exitCode = 1;
  }
}

const jobs = FILES.map(([f, key, ctype]) => {
  const local = path.resolve(process.cwd(), 'public', f);
  if (!fs.existsSync(local)) {
    console.error(`MISSING ${f}`);
    process.exitCode = 1;
    return null;
  }
  return { local, key, ctype };
}).filter(Boolean);

await Promise.all(jobs.map((j) => uploadOne(j)));
console.log(`\n完成 ${jobs.length} 个文件上传`);
