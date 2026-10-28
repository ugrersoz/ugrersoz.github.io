# Ugur Ersoz

Personal portfolio in genetics, digital health, and product development.

**[Visit the website](https://ugrersoz.github.io/)**

HTML, CSS, and JavaScript. No application dependencies or build step.

- `index.html`: page and styles; `assets/`: scripts; `images/`: public media.
- Updates to `main` publish selected public files to GitHub Pages.
- Run `node scripts/check-site.cjs` before publishing.
- Keep personal documents, credentials, and local archives out of this public repository.

[Security policy](SECURITY.md) · [License](LICENSE)

## Languages and identity

The public display name follows the selected content language: **Ugur Ersoz** (EN),
**Ugur Ersöz** (DE), **Uğur Ersöz** (TR). The wordmark, hero, footer, accessible
labels, page metadata and structured-data name use the same selected spelling.
The EN / DE / TR control translates the navigation, profile, projects, experience,
background, skills, writing labels, contact, image labels and footer. Original
project, institution and credential names and Turkish article titles are retained.
External articles, certificate images and linked demos keep their original language.

Use `?lang=en`, `?lang=de` or `?lang=tr` for a shareable language choice. A valid URL
choice opens that language directly; a URL without a valid language always opens in
English, regardless of previous visits. The selected language stays in the URL;
no stored browser language overrides the English default.
Without JavaScript, the English page remains readable and the inactive control stays hidden.

`assets/translations.js` contains the DE/TR copy; English is the source HTML.
`assets/i18n.js` handles safe inline formatting and locale state; `assets/language.css`
styles the control and unified identity. Keep `data-i18n` keys stable when editing.
Run `node scripts/check-site.cjs` and `node scripts/check-i18n.cjs` before publishing.

## Name typography

The visible name in the wordmark, hero and footer uses Dreaming Outloud Sans
Regular (400, normal), the same upright handwriting face as the supplied reference.
The local preview asset is `assets/fonts/dreaming-outloud-sans-regular.woff2`.
It is ignored by Git because this copy comes from the publisher's public font tester,
not a transferred production license. Before publishing, supply the appropriately
licensed webfont at that path and remove its specific ignore entry. The site keeps
a readable sans-serif fallback if the font is unavailable.

Publisher: https://mycreativeland.com/family/dreaming-outloud/sans-regular/

## Category headings

Category headings and matching navigation labels use uppercase marker lettering
via the self-hosted Mansalva font (SIL Open Font License; bundled license in
`assets/fonts/Mansalva-OFL.txt`). The category headings are native section links,
so their yellow-green marker highlight also works with keyboard focus. Matching
navigation labels and expandable entry titles share the hover/focus highlight.
The highlight animates paint only, adds no layout shift, wraps with the text,
and respects reduced-motion preferences. Profile names keep their separate font.
