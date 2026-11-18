import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { publicPaths, guides } from '../src/publicSite';
for (const path of publicPaths) {
 const html=readFileSync(`dist${path==='/'?'':path}/index.html`,'utf8');
 assert.match(html, /<h1[ >]/,`${path} has a readable heading`);
 assert.match(html, new RegExp(`<link rel="canonical" href="https://missmuok.com${path}">`));
 assert.ok(!html.includes('src="/assets/index-'),`${path} does not require the application bundle`);
 for(const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
  const href=m[1]; assert.ok(publicPaths.includes(href)||href==='/login'||existsSync(`dist${href}`),`Broken link ${href} in ${path}`);
 }
}
for(const g of guides) assert.ok(g.body.replace(/<[^>]*>/g,' ').split(/\s+/).length>350,`${g.slug} contains substantive content`);
assert.match(readFileSync('dist/login/index.html','utf8'),/noindex,follow/);
assert.match(readFileSync('dist/login/index.html','utf8'),/src="\/assets\//);
assert.ok(existsSync('dist/app.html'));
assert.match(readFileSync('dist/sitemap.xml','utf8'),/<urlset/);
assert.ok(!readFileSync('dist/sitemap.xml','utf8').includes('/login'));
const login=readFileSync('src/components/LoginPage.tsx','utf8');
assert.match(login,/href="\/privacy"/);assert.match(login,/href="\/terms"/);
assert.ok(!login.includes('_viewOverride'));
console.log(`PASS: ${publicPaths.length} public pages, internal links, canonical URLs, guide content, login shell and sitemap.`);
