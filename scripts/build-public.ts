import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { publicPaths, renderPublicPage, sitemap } from '../src/publicSite';
const shell = readFileSync('dist/index.html','utf8');
writeFileSync('dist/app.html',shell);
mkdirSync('dist/reset-password',{recursive:true});
writeFileSync('dist/reset-password/index.html',shell);
mkdirSync('dist/login',{recursive:true});
writeFileSync('dist/login/index.html',shell.replace('</head>','<meta name="robots" content="noindex,follow"></head>'));
for(const path of publicPaths){const dir=`dist${path==='/'?'':path}`;mkdirSync(dir,{recursive:true});writeFileSync(`${dir}/index.html`,renderPublicPage(path)!);}
writeFileSync('dist/sitemap.xml',sitemap);
writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://missmuok.com/sitemap.xml\n');
