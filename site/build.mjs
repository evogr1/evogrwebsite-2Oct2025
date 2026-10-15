// Static site builder: site/pages/**/*.html + site/partials -> repo root (what Cloudflare serves).
// Run: node site/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (p) => fs.readFileSync(path.join(here, p), 'utf8');
const SITE = 'https://evogr.net';

const logos = JSON.parse(read('logos.json'));
const logoItem = (l) => {
  const img = `<img src="/assets/logos/${l.file}" alt="${l.alt}" width="120" height="60" loading="lazy">`;
  return l.url
    ? `<a href="${l.url}" target="_blank" rel="noopener noreferrer" aria-label="${l.alt}">${img}</a>`
    : `<span class="logo-static" aria-label="${l.alt}" style="display:grid;place-items:center;width:150px;height:64px">${img}</span>`;
};
const marquee = `<div class="marquee" aria-label="Organisations we work with"><div class="marquee-track">${logos.map(logoItem).join('')}${logos
  .map(logoItem)
  .join('')
  .replace(/ loading="lazy"/g, '')}</div></div>`;


const ICONS = {
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17.5 14c2.4.2 4 2 4 5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12l2 2 4-4M8.5 17h7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  handshake: '<path d="M2 12l4-4 5 2 5-2 6 5-4 5-3-1-3 2-3-2-3 1z"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;


const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const testimonials = JSON.parse(read('testimonials.json'));
const slider = `<div class="quote" data-slider>${testimonials
  .map((t) => `<figure class="q-slide" style="margin:0"><div class="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><blockquote>&ldquo;${esc(t.quote)}&rdquo;</blockquote><figcaption class="who"><strong>${esc(t.author ?? t.name)}</strong><span>${esc(t.position)}, ${esc(t.company)}</span></figcaption></figure>`)
  .join('')}<div class="q-nav" role="group" aria-label="Testimonials"></div></div>`;

const logoWall = `<div class="grid g4 logo-wall">${logos
  .map((l) => `<${l.url ? 'a href="' + l.url + '" target="_blank" rel="noopener noreferrer"' : 'div'} class="card logo-tile" aria-label="${l.alt}"><img src="/assets/logos/${l.file}" alt="${l.alt}" loading="lazy"></${l.url ? 'a' : 'div'}>`)
  .join('')}</div>`;

const partials = {
  head: read('partials/head.html'),
  header: read('partials/header.html'),
  footer: read('partials/footer.html'),
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

const pagesDir = path.join(here, 'pages');
const written = [];
for (const file of walk(pagesDir)) {
  const rel = path.relative(pagesDir, file); // e.g. services/field-operations.html
  let src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^<!--meta\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!m) throw new Error(`${rel}: missing <!--meta {...}--> header`);
  const meta = JSON.parse(m[1]);
  src = src.slice(m[0].length);

  const urlPath = rel === 'index.html' ? '/' : '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  const head = partials.head
    .replace(/{{title}}/g, meta.title)
    .replace(/{{desc}}/g, meta.desc || '')
    .replace(/{{canonical}}/g, SITE + (meta.noindex ? '' : urlPath))
    .replace(/{{robots}}/g, meta.noindex ? '<meta name="robots" content="noindex">' : '');
  const header = partials.header.replace(new RegExp(`data-nav="${meta.nav}"`, 'g'), `data-nav="${meta.nav}" class="active" aria-current="page"`);

  const html = `<!doctype html>\n<html lang="en">\n<head>\n${head}\n</head>\n<body>\n<a class="skip" href="#main">Skip to content</a>\n${header}\n<main id="main">\n${src
    .replace(/{{marquee}}/g, marquee)
    .replace(/{{logowall}}/g, logoWall)
    .replace(/{{testimonials}}/g, slider)
    .replace(/{{icon:(\w+)}}/g, (_, n) => icon(n))}\n</main>\n${partials.footer}\n<script src="/js/site.js" defer></script>\n</body>\n</html>\n`;

  const out = path.join(root, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  written.push(rel);
}

// static assets
fs.mkdirSync(path.join(root, 'css'), { recursive: true });
fs.mkdirSync(path.join(root, 'js'), { recursive: true });
fs.copyFileSync(path.join(here, 'css/site.css'), path.join(root, 'css/site.css'));
let js = read('js/site.js');
const bundle = fs.readFileSync(path.join(root, 'assets/index-CcLRYBum.js'), 'utf8');
const key = bundle.match(/supabase\.co",\w+="(eyJ[\w.-]+)"/)?.[1];
if (!key) throw new Error('Supabase anon key not found in legacy bundle');
fs.writeFileSync(path.join(root, 'js/site.js'), js.replace('__SUPABASE_ANON_KEY__', key));

// sitemap + robots
const sm = written.filter((r) => r !== '404.html')
  .map((r) => (r === 'index.html' ? '/' : '/' + r.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')))
  .sort();
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${written.length} pages:`, written.join(', '));
