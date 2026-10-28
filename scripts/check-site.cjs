const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
process.chdir(path.resolve(__dirname, '..'));

const main = fs.readFileSync('index.html', 'utf8');
const redirect = fs.readFileSync('my-portfolio/index.html', 'utf8');
for (const html of [main, redirect]) {
  assert(!/\son[a-z]+\s*=/i.test(html), 'Inline event handlers are forbidden');
  assert(!/(?:href|src)\s*=\s*["']\s*javascript:/i.test(html), 'Unsafe URL');
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1];
  assert(policy?.includes("script-src 'self';"), 'Restrict scripts to same origin');
  assert(!policy.includes("'unsafe-eval'"), 'Dynamic code execution is forbidden');
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (script[1].includes('application/ld+json')) JSON.parse(script[2]);
    else {
      const source = script[1].match(/src="([^"]+)"/)?.[1];
      assert(source && !script[2].trim(), 'Executable scripts must be external');
      assert(/^\/?assets\/[\w-]+\.js$/.test(source), 'Unapproved script path');
      new vm.Script(fs.readFileSync(source.replace(/^\//, ''), 'utf8'));
    }
  }
  for (const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    assert(/rel="[^"]*noopener/.test(link[0]) && /rel="[^"]*noreferrer/.test(link[0]), 'External link isolation');
  }
}
assert(main.includes('<link rel="canonical" href="https://ugrersoz.github.io/">'));
const manifest = JSON.parse(fs.readFileSync('site.webmanifest', 'utf8'));
const imageNames = new Set([...main.matchAll(/images\/([\w.-]+\.(?:png|webp|jpg))/g)].map(m => m[1]));
for (const icon of manifest.icons) imageNames.add(path.basename(icon.src));
for (const name of imageNames) assert(fs.existsSync('images/' + name), 'Missing public image: ' + name);
for (const name of fs.readdirSync('images')) {
  assert(imageNames.has(name), 'Unreferenced image must not be published: ' + name);
  assert(!fs.lstatSync('images/' + name).isSymbolicLink(), 'Symlink in public images');
}
assert.equal(fs.readFileSync('googlec3d2fe7a9e66be57.html', 'utf8').trim(), 'google-site-verification: googlec3d2fe7a9e66be57.html');
assert(fs.readFileSync('sitemap.xml', 'utf8').includes('<loc>https://ugrersoz.github.io/</loc>'));

// Exercise the event listeners affected by removing inline JavaScript.
const element = () => ({events: {}, attrs: {}, addEventListener(t, fn) { this.events[t] = fn; }, setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k]; }});
let restored = false;
const portrait = element(), close = element(), certificate = element(), modal = element(), preview = element();
certificate.dataset = {previewSrc: 'images/bloomberg-market-concepts.png'};
const picture = {src: 'images/bersync-project.webp', alt: 'Project preview', removeAttribute() {}, before(button) {this.button = button;}};
modal.querySelector = () => close;
modal.showModal = () => {modal.open = true;};
modal.close = () => {modal.open = false; modal.events.close();};
const document = {
  body: {style: {}}, activeElement: {focus() {restored = true;}},
  querySelector: () => portrait,
  getElementById: id => id === 'imageModal' ? modal : preview,
  createElement: () => Object.assign(element(), {append() {}}),
  querySelectorAll: selector => selector === 'button[data-preview-src]' ? [certificate] : selector === 'img[data-preview]' ? [picture] : [],
};
vm.runInNewContext(fs.readFileSync('assets/site.js', 'utf8'), {document, window: {}});
portrait.events.click(); assert.equal(portrait.attrs['aria-pressed'], 'true');
portrait.events.click(); assert.equal(portrait.attrs['aria-pressed'], 'false');
certificate.events.click(); assert(modal.open); assert.equal(preview.src, certificate.dataset.previewSrc);
close.events.click(); assert(!modal.open); assert(restored); assert.equal(document.body.style.overflow, '');
picture.button.events.click(); assert.equal(preview.alt, picture.alt); assert(modal.open);
const location = {hash: '#projects', replace(url) {this.destination = url;}};
vm.runInNewContext(fs.readFileSync('assets/redirect.js', 'utf8'), {location});
assert.equal(location.destination, 'https://ugrersoz.github.io/#projects');
console.log('PASS: browser policy, public assets, Google verification, portrait, image previews, focus restoration and legacy redirect.');
require('./check-i18n.cjs');
