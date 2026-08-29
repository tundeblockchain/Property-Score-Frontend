import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import {
  HOME_SEO,
  PUBLIC_HTML_PAGES,
  applySeoPlaceholders,
} from './src/lib/seo';

export function seoPagesPlugin(): Plugin {
  let outDir = 'dist';
  let root = process.cwd();

  return {
    name: 'seo-pages',
    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },
    transformIndexHtml(html) {
      return applySeoPlaceholders(html, HOME_SEO);
    },
    writeBundle() {
      const indexPath = resolve(root, outDir, 'index.html');
      const html = readFileSync(indexPath, 'utf8');

      for (const page of PUBLIC_HTML_PAGES) {
        if (page.path === '/') {
          continue;
        }
        const target = join(resolve(root, outDir), page.path.slice(1), 'index.html');
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, applySeoPlaceholders(html, page));
      }
    },
  };
}
