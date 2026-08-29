/**
 * TOS 批量上传脚本（官方 @volcengine/tos-sdk）
 *
 * 功能：读 .env.local 凭证 → 扫描 public/{漫剧,电商,建筑} → 上传 portfolio/{cat}/{safe-name}
 *      分片上传(大文件) + 3次指数退避重试 + manifest 断点续传 + Cache-Control 公共缓存
 * 用法：node scripts/upload-tos.mjs
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

const MANIFEST = path.resolve(process.cwd(), '.tos-upload-manifest.json');
const done = fs.existsSync(MANIFEST) ? new Set(JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).done ?? []) : new Set();
const manifest = { done: [...done] };
const saveManifest = () => fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

const NAME_MAP = {
  '青云大殿.png': 'qingyun-dadian.png',
  '诛仙台.png': 'zhuxiantai.png',
  '萧珩.png': 'xiaoheng.png',
  '苏挽.png': 'suwan.png',
  '墨断剑红绳.png': 'moduanjian-hongsheng.png',
  '灭门旧夜.png': 'miemen-jiuye.png',
  '玄青上人.png': 'xuanqing-shangren.png',
  '墨玉牌.png': 'moyupai.png',
};
const safeName = (f) => NAME_MAP[f] ?? f.toLowerCase().replace(/\s+/g, '-');

const DIRS = [
  ['漫剧', 'manju'],
  ['电商', 'ecom'],
  ['建筑', 'arch'],
];
const jobs = [];
for (const [dir, key] of DIRS) {
  const abs = path.resolve(process.cwd(), 'public', dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!/\.(png|jpe?g|webp|gif)$/i.test(f)) continue;
    jobs.push({ local: path.join(abs, f), key: `portfolio/${key}/${safeName(f)}`, file: f });
  }
}
console.log(`待上传 ${jobs.length}，断点已完成 ${done.size}`);

async function uploadOne(job, attempt = 1) {
  try {
    await client.putObjectFromFile({
      bucket,
      key: job.key,
      filePath: job.local,
      acl: 'public-read', // 公开读：前端直链访问
      headers: { 'x-tos-server-side-encryption': undefined },
      options: {
        contentType: job.key.endsWith('.png') ? 'image/png' : 'image/jpeg',
        // 1 年不可变缓存，命中 CDN/浏览器强缓存
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    done.add(job.key);
    manifest.done = [...done];
    saveManifest();
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

const CONC = 4;
let idx = 0;
async function worker() {
  while (idx < jobs.length) {
    const job = jobs[idx++];
    if (done.has(job.key)) {
      console.log(`SKIP ${job.key}`);
      continue;
    }
    await uploadOne(job);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log(`\n完成 ${done.size}/${jobs.length}${done.size === jobs.length ? ' ✔ 全部成功' : ''}`);
