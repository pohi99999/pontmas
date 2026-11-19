// The legal pages (card c017f163): drafts until approved, and a draft must never look final.
import test from 'node:test';
import assert from 'node:assert/strict';
import { src } from './helpers/load.mjs';
import { renderHtml, visibleText } from './helpers/render.mjs';

const PAGES = ['app/adatkezeles/page.tsx', 'app/impresszum/page.tsx'];
const { LEGAL_DRAFT, REVIEW_MARKERS } = await src('lib/legal.ts');
const hasMarker = (text) => REVIEW_MARKERS.some((m) => text.includes(m));

test('a page with an open review marker is a draft: banner shown, not indexed', async () => {
  for (const p of PAGES) {
    const text = visibleText(await renderHtml(p));
    const { metadata } = await src(p);
    if (hasMarker(text)) {
      assert.equal(LEGAL_DRAFT, true, `${p} has open review points, so LEGAL_DRAFT must stay true`);
      assert.ok(text.includes('Tervezet: ez a szöveg még nem hatályos.'), `${p} shows the draft banner`);
      assert.deepEqual(metadata.robots, { index: false, follow: false }, `${p} is not indexed`);
    }
  }
});

test('the draft guard is not vacuous: the drafts do have markers today', async () => {
  for (const p of PAGES) assert.ok(hasMarker(visibleText(await renderHtml(p))), `${p} still has open points`);
});

test('the privacy notice states only what the site measurably does', async () => {
  const text = visibleText(await renderHtml('app/adatkezeles/page.tsx'));
  // the contact form's fields (src/lib/contact.ts validateContact)
  for (const w of ['név, e-mail-cím, telefonszám (nem kötelező), a választott téma és az üzenet szövege'])
    assert.ok(text.includes(w), w);
  const { LIMITS } = await src('lib/contact.ts');
  assert.deepEqual(Object.keys(LIMITS).sort(), ['email', 'nev', 'telefon', 'uzenet'], 'the form fields changed: update section 3');
  // the processors the code uses
  for (const w of ['Vercel Inc.', 'Resend']) assert.ok(text.includes(w), w);
  // the site has no chat: the notice says nothing about one, and names no processor the code does not use
  for (const w of ['chat', 'Anthropic']) assert.ok(!text.toLowerCase().includes(w.toLowerCase()), `the notice mentions "${w}"`);
  // the short films load from YouTube only after a click (src/content/kisfilmek.ts)
  assert.ok(text.includes('youtube-nocookie.com'));
  // the foundation's facts come from foundation.ts
  const { FOUNDATION } = await src('lib/foundation.ts');
  const { ADDRESS_LINE } = await src('lib/foundation.ts');
  for (const w of [FOUNDATION.name, FOUNDATION.taxNumber, FOUNDATION.phone, FOUNDATION.registrationNumber, ADDRESS_LINE]) assert.ok(text.includes(w), w);
});

// The notice's sentences about the site are tied to the code they describe (review of #60): when the code changes, one
// of these fails and names the sentence to rewrite. Before, the text could say 15 minutes while the code said 20.
test('what the notice says about the editors is what the code does', async () => {
  const fs = await import('node:fs');
  const text = visibleText(await renderHtml('app/adatkezeles/page.tsx'));
  const read = (f) => fs.readFileSync(f, 'utf8');
  // the two times are the code's own constants
  const { LOGIN_TOKEN_TTL_MS, SESSION_TTL_MS } = await src('lib/editorAuth.ts');
  assert.ok(text.includes(`egy ${LOGIN_TOKEN_TTL_MS / 60_000} percig érvényes linket`), 'the login link\'s minutes');
  assert.ok(text.includes(`egy ${SESSION_TTL_MS / 3_600_000} óráig érvényes`), 'the session cookie\'s hours');
  // the login brake keeps the IP address and the e-mail address in memory, for an hour at most
  const api = read('src/lib/editorApi.ts');
  assert.match(api, /loginIp: createRateLimiter\(10 \* 60_000, 5\)/);
  assert.match(api, /loginAddress: createRateLimiter\(60 \* 60_000, 3\)/);
  assert.match(api, /x-forwarded-for/);
  assert.ok(text.includes('a kérés IP-címét és a megadott e-mail-címet legfeljebb egy óráig a memóriájában tartja'));
  // the draft in the editor's own browser
  assert.match(read('src/components/editor/EditorApp.tsx'), /localStorage\.setItem\(DRAFT_KEY/);
  assert.ok(text.includes('a félbehagyott szerkesztést a szerkesztő saját böngészője tárolja (localStorage)'));
  // the change notice: who, what, when, and the image's address
  const mail = read('src/lib/editorMail.ts');
  for (const line of ['`Ki: ${info.editor}`', '`Mi: ${info.summary}`', '`Mikor: ${formatBudapest(info.at)}`', '`Kép: ${info.imageUrl}`']) assert.ok(mail.includes(line), line);
  assert.ok(text.includes('ki végezte, mi változott, mikor, és képfeltöltésnél a kép címe'));
  assert.ok(text.includes('a szerkesztői változás-értesítők e-mailes kézbesítése'), 'the processors\' table names the change notices');
  // the photo declaration is recorded with who and when
  assert.deepEqual([...(await src('content/types.ts')).DECLARATION_FIELDS], ['declaredBy', 'at']);
  assert.ok(text.includes('a nyilatkozó szerkesztő megjelölésével és az időponttal együtt rögzítjük'));
});

test('what the notice says about a visitor is what the code does', async () => {
  const fs = await import('node:fs');
  const text = visibleText(await renderHtml('app/adatkezeles/page.tsx'));
  const read = (f) => fs.readFileSync(f, 'utf8');
  // the contact form's brake: the sender's IP address, 10 minutes, 5 messages, in memory
  const brake = read('src/lib/contactBrake.ts');
  assert.match(brake, /export const WINDOW_MS = 10 \* 60_000;/);
  assert.match(brake, /export const MAX = 5;/);
  assert.match(read('src/app/api/kapcsolat/route.ts'), /import \{ limited \} from '@\/lib\/contactBrake';/);
  assert.ok(text.includes('legfeljebb 10 percig a memóriájában tartja (ennyi idő alatt egy címről 5 üzenet küldhető)'));
  // the message goes out through Resend and is not logged on the way
  assert.ok(read('src/lib/contact.ts').includes('https://api.resend.com/emails'));
  assert.ok(text.includes('a Resend e-mail-küldő szolgáltatáson keresztül'));
  for (const f of ['src/lib/contact.ts', 'src/lib/contactBrake.ts', 'src/app/api/kapcsolat/route.ts']) assert.ok(!/console\.|logger\./.test(read(f)), `${f} logs something: the notice says the message is not logged`);
  // no cookie for a visitor: the only Set-Cookie of the site is the editor's
  const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(`${dir}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) ? [`${dir}/${e.name}`] : []);
  const setsCookie = files('src').filter((f) => /Set-Cookie|cookies\(\)\.set|document\.cookie\s*=/.test(read(f)));
  assert.deepEqual(setsCookie.filter((f) => !/editor/i.test(f)), [], 'a file outside the editor sets a cookie');
  assert.ok(text.includes('a weboldal nem használ sütit a látogatóknál'));
  // no visitor statistics in the code
  const deps = Object.keys(JSON.parse(read('package.json')).dependencies);
  assert.deepEqual(deps.filter((d) => /analytics|speed-insights|gtag|plausible|matomo|posthog/i.test(d)), []);
  // the theme and the accessibility settings stay in the browser
  assert.match(read('src/lib/theme.ts'), /localStorage/);
  assert.match(read('src/context/SensoryContext.tsx'), /localStorage/);
});

test('what was not read from a source is marked, not stated', async () => {
  const html = await renderHtml('app/adatkezeles/page.tsx');
  const text = visibleText(html);
  for (const open of ['A napló pontos tartalma és megőrzési ideje', 'A Vercel-projektben a látogatottságmérés (Web Analytics, Speed Insights) kikapcsolt állapota', 'A hely a 2026. november 10-i lekérdezésből való'])
    assert.ok(text.includes(`[KÉRDÉS] ${open}`), `not marked as open: ${open}`);
});

test('footer and contact form link the legal pages, and the notice links the 2024 policy', async () => {
  const footer = await renderHtml('components/layout/Footer.tsx');
  assert.ok(footer.includes('href="/adatkezeles"') && footer.includes('href="/impresszum"'), 'footer links both');
  assert.ok(!/href="\/kapcsolat"[^>]*>Adatvédelem/.test(footer), 'the old "Adatvédelem & Kapcsolat" link to /kapcsolat is gone');
  // and the notice names the place of the 2024 policy, which the documents page offers for download
  assert.ok((await renderHtml('app/adatkezeles/page.tsx')).includes('href="/dokumentumok"'), 'the notice links the documents page');
  assert.ok((await renderHtml('app/dokumentumok/page.tsx')).includes('pontmas-adatvedelmi-szabalyzat-2024.pdf'), 'the documents page offers the 2024 policy');
  assert.ok((await renderHtml('app/kapcsolat/page.tsx')).includes('href="/adatkezeles"') ||
    (await renderHtml('components/forms/ContactForm.tsx')).includes('href="/adatkezeles"'), 'contact form links the notice');
});
