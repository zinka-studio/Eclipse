import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const EXTS = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else if (EXTS.has(extname(name).toLowerCase())) entries.push(full);
  }
  return entries;
}

const files = walk(PUBLIC);
console.log(`Found ${files.length} image(s) to convert.\n`);

for (const src of files) {
  const dest = join(dirname(src), basename(src, extname(src)) + '.webp');
  const before = statSync(src).size;
  await sharp(src).webp({ quality: 85 }).toFile(dest);
  const after = statSync(dest).size;
  const saving = (((before - after) / before) * 100).toFixed(1);
  console.log(`✓  ${basename(src)} → ${basename(dest)}  (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB, -${saving}%)`);
  unlinkSync(src);
}

console.log('\nDone. All originals removed.');
