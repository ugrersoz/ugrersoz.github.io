const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
process.chdir(path.resolve(__dirname, '..'));
const html = fs.readFileSync('index.html', 'utf8');
const sandbox = {window:{}};
vm.runInNewContext(fs.readFileSync('assets/translations.js','utf8'),sandbox);
const copy = sandbox.window.PORTFOLIO_COPY;
const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(match=>match[1]);
assert(keys.length >= 180, 'Expected full-page translations, including expanded content');
for (const key of keys) {
 assert(Array.isArray(copy[key]) && copy[key].length === 2, 'Missing DE/TR copy: '+key);
 for (const value of copy[key]) {
  assert(typeof value === 'string' && value.trim(), 'Empty translation: '+key);
  assert(!/<\s*(?:script|img|iframe|a|button|input)\b/i.test(value), 'Unexpected active content: '+key);
  assert(!/\son[a-z]+\s*=/i.test(value), 'Event handler in translation: '+key);
 }
}
assert(html.includes('<h1 id="intro-heading" data-profile-name>Ugur Ersoz</h1>'), 'English fallback display name');
assert.equal((html.match(/data-profile-name/g)||[]).length,3,'Wordmark, heading and footer follow language selection');
assert.equal(sandbox.window.PORTFOLIO_NAMES.en,'Ugur Ersoz');
assert.equal(sandbox.window.PORTFOLIO_NAMES.de,'Ugur Ersöz');
assert.equal(sandbox.window.PORTFOLIO_NAMES.tr,'Uğur Ersöz');
assert(!html.includes('class="alternate-names"'), 'Remove scattered language-specific names');
for (const language of ['en','de','tr']) assert(html.includes(`data-language="${language}"`));
assert(html.includes('role="group" aria-label="Content language"'), 'Accessible three-way choice');
assert(html.includes('id="language-status"'), 'Accessible language change announcement');
for (const filename of ['assets/site.js','assets/translations.js','assets/i18n.js']) new vm.Script(fs.readFileSync(filename,'utf8'));
assert.equal(new Set(keys).size, Object.keys(copy).filter(key=>keys.includes(key)).length);
console.log(`PASS: ${keys.length} translated elements have complete DE/TR copy; locale-specific identity, safe formatting, language controls and script syntax.`);
