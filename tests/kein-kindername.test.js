// Guards against the child's first name appearing in any public source file.
// The name is never stored in clear text: every word is compared by SHA-256.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FORBIDDEN_HASH = '5f16795c54ab7de419edf8e9c6da6065f7dd448f122fcbc9815c67daa566ba8e';
const EXTENSIONS = new Set(['.html', '.js', '.css', '.md', '.json', '.svg']);
const SKIP_DIRS = new Set(['.git', '.superpowers', 'node_modules', 'gitignore', '.claude']);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

test("no source file contains the child's first name", () => {
  const hits = [];
  for (const file of walk(ROOT, [])) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const words = line.toLowerCase().match(/[a-zäöüß]+/g) || [];
      if (words.some((w) => sha256(w) === FORBIDDEN_HASH)) {
        hits.push(`${path.relative(ROOT, file).split(path.sep).join('/')}:${i + 1}`);
      }
    });
  }
  assert.deepEqual(hits, [], `Forbidden word found at:\n${hits.join('\n')}`);
});

test('privacy guard and reused hand SVGs exist in lernreise fork', () => {
  const haendeDir = path.resolve(ROOT, 'assets/haende');
  assert.ok(fs.existsSync(haendeDir), 'assets/haende directory must exist');
  const svgs = fs.readdirSync(haendeDir).filter((f) => f.endsWith('.svg'));
  assert.equal(svgs.length, 12, 'all 12 hand SVGs (L/R 0..5) must be copied from tabbi');
});
