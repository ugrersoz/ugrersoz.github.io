(() => {
 'use strict';
 const languages = ['en', 'de', 'tr'];
 const messages = {
  en: {language:'Content language', changed:'Content language changed to English.', home:'Ugur Ersoz, home', navigation:'Main navigation', contacts:'Contact links', portrait:'Portrait with black glasses', preview:'Image preview', close:'Close image preview', certificate:'Certificate preview', enlarge:'Enlarge: ', title:'Product Developer & Researcher in Berlin', description:'Ugur Ersoz, product developer and researcher in Berlin. Projects in genetics, data analysis, and digital health, plus experience and writing.', rights:'All rights reserved.', built:'Built with HTML, CSS & JavaScript.', hosted:'Hosted by ', updated:'Last updated: ', locale:'en-US', og:'en_US'},
  de: {language:'Inhaltssprache', changed:'Inhaltssprache auf Deutsch umgestellt.', home:'Ugur Ersöz, Startseite', navigation:'Hauptnavigation', contacts:'Kontaktlinks', portrait:'Porträt mit schwarzer Brille', preview:'Bildvorschau', close:'Bildvorschau schließen', certificate:'Zertifikatsvorschau', enlarge:'Vergrößern: ', title:'Produktentwickler & Forscher in Berlin', description:'Ugur Ersöz, Produktentwickler und Forscher in Berlin. Projekte zu Genetik, Datenanalyse und digitaler Gesundheit sowie Erfahrung und Texte.', rights:'Alle Rechte vorbehalten.', built:'Erstellt mit HTML, CSS & JavaScript.', hosted:'Gehostet von ', updated:'Zuletzt aktualisiert: ', locale:'de-DE', og:'de_DE'},
  tr: {language:'İçerik dili', changed:'İçerik dili Türkçe olarak değiştirildi.', home:'Uğur Ersöz, ana sayfa', navigation:'Ana gezinme', contacts:'İletişim bağlantıları', portrait:'Siyah gözlüklü portre', preview:'Görsel önizlemesi', close:'Görsel önizlemesini kapat', certificate:'Sertifika önizlemesi', enlarge:'Büyüt: ', title:'Berlin’de Ürün Geliştirici ve Araştırmacı', description:'Uğur Ersöz, Berlin’de ürün geliştirici ve araştırmacı. Genetik, veri analizi ve dijital sağlık projeleri, deneyimler ve yazılar.', rights:'Tüm hakları saklıdır.', built:'HTML, CSS ve JavaScript ile oluşturuldu.', hosted:'Barındırma: ', updated:'Son güncelleme: ', locale:'tr-TR', og:'tr_TR'}
 };
 const imageCopy = {
  'BerSync Remote Health Monitoring':['BerSync: Fernüberwachung der Gesundheit','BerSync uzaktan sağlık takibi'],
  'Genetic Testing Research':['Forschung zu Gentests','Genetik test araştırması'],
  'CYP1A2 Study':['CYP1A2-Studie','CYP1A2 çalışması'],
  'LiveUseful App':['LiveUseful-App','LiveUseful uygulaması'],
  'Uniqgene AI product launch page':['Produktlaunch-Seite von Uniqgene AI','Uniqgene AI ürün lansman sayfası'],
  'LinkedIn post recognizing Product Hunt launch coordination':['LinkedIn-Beitrag zur Würdigung der Product-Hunt-Launchkoordination','Product Hunt lansman koordinasyonunu takdir eden LinkedIn paylaşımı'],
  'Uniqgene Sports Predisposition Analysis interactive report':['Interaktiver Uniqgene-Bericht zur sportlichen Veranlagung','Uniqgene Spora Genetik Yatkınlık Analizi interaktif raporu'],
  'Uniqgene Caffeine Metabolism personalized report':['Personalisierter Uniqgene-Bericht zum Koffeinstoffwechsel','Uniqgene Kafein Metabolizması kişiselleştirilmiş raporu']
 };
 const translated = [...document.querySelectorAll('[data-i18n]')].map(element => ({element,key:element.dataset.i18n,english:element.innerHTML}));
 const images = [...document.querySelectorAll('img[alt]')].map(element => ({element,english:element.alt}));
 const switcher = document.querySelector('.language-switch');
 const buttons = [...switcher.querySelectorAll('[data-language]')];
 const footer = document.querySelector('.footer-details');
 const footerYear = document.getElementById('footer-year').textContent;
 const originalUpdated = document.getElementById('footer-updated').textContent;
 const updatedDate = new Date(originalUpdated + ' 12:00:00');
 const schemaElement=document.querySelector('script[type="application/ld+json"]');
 const schema=JSON.parse(schemaElement.textContent);
 let current = 'en';

 function validLanguage(value) { return typeof value === 'string' && languages.includes(value.toLowerCase()) ? value.toLowerCase() : null; }
 function preferredLanguage() {
  const fromUrl = validLanguage(new URL(location.href).searchParams.get('lang'));
  return fromUrl || 'en';
 }

 // Only formatting tags are accepted, even if a translation is edited later.
 function setInlineCopy(element, value) {
  const template = document.createElement('template');
  template.innerHTML = value;
  const allowed = new Set(['STRONG','EM','BR','SPAN']);
  function append(parent, node) {
   if (node.nodeType === Node.TEXT_NODE) { parent.append(document.createTextNode(node.data)); return; }
   if (node.nodeType !== Node.ELEMENT_NODE) return;
   if (!allowed.has(node.tagName)) { parent.append(document.createTextNode(node.textContent)); return; }
   const clean = document.createElement(node.tagName.toLowerCase());
   if (node.tagName === 'SPAN' && node.classList.contains('role-note')) clean.className = 'role-note';
   if (node.getAttribute('aria-hidden') === 'true') clean.setAttribute('aria-hidden','true');
   [...node.childNodes].forEach(child => append(clean, child)); parent.append(clean);
  }
  const fragment = document.createDocumentFragment();
  [...template.content.childNodes].forEach(node => append(fragment, node));
  element.replaceChildren(fragment);
 }

 function renderFooter(copy, name) {
  const copyright = document.createElement('p');
  copyright.append('© Copyright ');
  const year = document.createElement('span'); year.id='footer-year';year.textContent=footerYear;
  copyright.append(year, ' ');
  const signature=document.createElement('span');signature.setAttribute('data-profile-name','');signature.textContent=name;
  copyright.append(signature, '. ' + copy.rights + ' ' + copy.built + ' ' + copy.hosted);
  const host = document.createElement('a');host.href='https://pages.github.com/';host.target='_blank';host.rel='noopener noreferrer';host.textContent='GitHub Pages';
  copyright.append(host,'.');
  const updated = document.createElement('p'); updated.append(copy.updated);
  const date = document.createElement('span');date.id='footer-updated';
  date.textContent = Number.isNaN(updatedDate.getTime()) ? originalUpdated : new Intl.DateTimeFormat(copy.locale,{day:'numeric',month:'long',year:'numeric'}).format(updatedDate);
  updated.append(date,'.');footer.replaceChildren(copyright,updated);
 }

 function applyLanguage(language, {announce=false, updateUrl=false}={}) {
  const next = validLanguage(language); if (!next) return;
  current=next;const copy=messages[next];const languageIndex=next==='de'?0:1;
  document.documentElement.lang=next;
  const name=window.PORTFOLIO_NAMES[next];
  document.querySelectorAll('[data-profile-name]').forEach(element=>{element.textContent=name;});
  for (const item of translated) {
   const value=next==='en'?item.english:window.PORTFOLIO_COPY[item.key]?.[languageIndex];
   if (typeof value==='string') setInlineCopy(item.element,value);
  }
  for (const image of images) {
   image.element.alt = next==='en'?image.english:(imageCopy[image.english]?.[languageIndex] || image.english);
  }
  document.querySelectorAll('button.image-preview').forEach(button => {button.setAttribute('aria-label',copy.enlarge+button.querySelector('img').alt);});
  document.querySelector('.wordmark').setAttribute('aria-label',copy.home);
  document.querySelector('.topbar nav').setAttribute('aria-label',copy.navigation);
  document.querySelector('.profile-contacts').setAttribute('aria-label',copy.contacts);
  document.querySelector('.portrait-flip').setAttribute('aria-label',copy.portrait);
  document.getElementById('imageModal').setAttribute('aria-label',copy.preview);
  document.querySelector('#imageModal .close').setAttribute('aria-label',copy.close);
  switcher.setAttribute('aria-label',copy.language);
  buttons.forEach(button => {button.textContent={en:'EN',de:'DE',tr:'TR'}[button.dataset.language];button.setAttribute('aria-pressed',String(button.dataset.language===next));});
  document.title=name+' — '+copy.title;
  for (const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]']) document.querySelector(selector).content=copy.description;
  for (const selector of ['meta[property="og:title"]','meta[name="twitter:title"]']) document.querySelector(selector).content=document.title;
  document.querySelector('meta[property="og:locale"]').content=copy.og;
  document.querySelector('meta[name="author"]').content=name;
  document.querySelector('meta[property="og:site_name"]').content=name;
  document.querySelector('meta[property="profile:first_name"]').content=name.split(' ')[0];
  document.querySelector('meta[property="profile:last_name"]').content=name.split(' ').slice(1).join(' ');
  schema['@graph'].forEach(item=>{
   if (item['@type']==='WebSite' || item['@type']==='Person') item.name=name;
   if (item['@type']==='ProfilePage') {item.name=document.title;item.inLanguage=next;}
  });
  schemaElement.textContent=JSON.stringify(schema);
  renderFooter(copy,name);
  if (updateUrl) {try {const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);} catch { /* Local file previews need no URL write. */ }}
  if (announce) document.getElementById('language-status').textContent=copy.changed;
 }
 window.portfolioI18n=Object.freeze({get language(){return current;},message(key){return messages[current][key] || messages.en[key] || '';}});
 buttons.forEach((button,index) => {
  button.addEventListener('click',()=>applyLanguage(button.dataset.language,{announce:true,updateUrl:true}));
  button.addEventListener('keydown',event=>{
   if (event.ctrlKey || event.metaKey || event.altKey) return;
   let target;
   if (event.key==='ArrowRight') target=(index+1)%buttons.length;
   if (event.key==='ArrowLeft') target=(index+buttons.length-1)%buttons.length;
   if (event.key==='Home') target=0;
   if (event.key==='End') target=buttons.length-1;
   if (target===undefined) return;
   event.preventDefault();buttons[target].focus();buttons[target].click();
  });
 });
 window.addEventListener('popstate',()=>applyLanguage(preferredLanguage(),{announce:true}));
 applyLanguage(preferredLanguage());
 document.querySelector('.language-toolbar').hidden=false;
})();
