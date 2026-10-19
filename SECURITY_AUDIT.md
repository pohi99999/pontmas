# Security Audit — pontmas (PontMás Alapítvány website)

- **Date:** 2026-10-19
- **Commit audited:** `11db564` (`main` at time of audit)
- **Auditor:** Claude Code (automated review, manually verified)

## 1. Scope

Everything in the repository `pohi99999/pontmas`, including its full git history (51 commits, all refs):

- Next.js 16 App Router site (`src/app/*`, `src/components/*`, `src/context/*`), all pages statically prerendered (14 routes, no API routes, no middleware/proxy, no server actions).
- Build/runtime configuration: `next.config.ts`, `package.json`, `package-lock.json`, `.gitignore`, `eslint.config.mjs`, `tsconfig.json`.
- Static assets in `public/` and repository-root files (docs, logs, stray files).

Out of scope: the hosting platform's live configuration (DNS, TLS, platform-level headers, environment variables, repository settings). These were **not** inspected or changed. Hosting may add some headers (e.g. HSTS on Vercel); verify against the live site.

## 2. Method

| Area | How it was checked |
|---|---|
| Secrets in git history | Listed every path ever added/deleted across all refs; regex scan of `git log --all -p` for API keys, tokens, passwords, private keys, cloud/provider key formats (AWS, GitHub, OpenAI, Slack, Google, SendGrid, Resend, Supabase), `DATABASE_URL`, SMTP creds, `NEXT_PUBLIC_*`; long high-entropy string scan (lockfile hashes excluded). |
| `.env` handling | `.gitignore` review; history check for any `.env*` file ever committed; code search for `process.env`. |
| Dependencies | `npm audit` (lockfile), `npm ls` for transitive versions. |
| Security headers | `next.config.ts` (`headers()`), presence of `middleware`/`proxy`, `vercel.json`. |
| Forms & input | Manual review of `ContactForm.tsx` and every place URL/query input reaches the DOM; search for `dangerouslySetInnerHTML`, `eval`, raw `<script>`. |
| Third-party scripts/trackers | Search for analytics/tag managers/pixels/SDKs/iframes/external `<script>`; external links and `target="_blank"` hygiene. |
| Cookies & GDPR | Search for `document.cookie`, `localStorage`, consent tooling; review of personal-data collection points. |
| Exposed files | Inventory of `public/` (the only directory served verbatim) and repo root for logs, backups, dumps, test output. |
| EXIF/GPS | Searched for raster images (`jpg/jpeg/png/webp/heic/tiff`) in the tree and in history. |
| Verification | `npm test` (20/20 pass), `npm run build` (succeeds), `npm run lint` before/after the fix. |

## 3. Summary

| Severity | Count | Fixed in this PR |
|---|---|---|
| Critical | 0 | — |
| High | 2 | 2 |
| Medium | 3 | 0 (recommendations) |
| Low | 6 | 0 (recommendations) |
| Info | 5 | n/a |

**No secrets, tokens or credentials were found anywhere in the git history.** No `.env` file has ever been committed. The two High findings were vulnerable runtime dependencies. This PR fixes both by upgrading `next` (lockfile-only for `sharp`).

---

## 4. Findings

### Critical

None.

### High

#### H-1 — `next@16.3.7` has six known High-severity advisories — **FIXED**

- **Location:** `package.json:16` (was `"next": "16.3.7"`), `package-lock.json`
- **Advisories (all affect `16.0.0 – 16.3.7`):**
  - GHSA-cjq9-62q9-8jv4: SSRF in Image Optimization
  - GHSA-4jqv-mc3x-m676: cache poisoning of SSG/ISR pages (self-hosted)
  - GHSA-mcj8-r9mp-w47p: SSG/ISR cache poisoning leading to cross-user content substitution and persistent DoS
  - GHSA-f87g-xv8r-7p7x: information disclosure in metadata image routes
  - GHSA-3w37-wq28-93x7: `use cache` Draft Mode leak
  - GHSA-39w2-rjm5-chcv: info disclosure in the dev server's MCP endpoint
- **Why it matters:** Next.js is the production runtime. Every page here is SSG, so the cache-poisoning advisories apply directly if the site is ever self-hosted. Then one attacker request could replace or break pages for all visitors (e.g. the donation page with the bank account number). The Image Optimization SSRF becomes reachable once `next/image` is used, and `public/images/README-kepek.txt` says that is planned.
- **Fix applied:** Upgraded to `next@16.4.2` (same major; the advisory's recommended fixed version). Build, tests and route output are unchanged.

#### H-2 — `sharp@0.35.4` (transitive, via `next`) bundles a vulnerable `librsvg` — **FIXED**

- **Location:** `package-lock.json` (`node_modules/sharp`, pulled in by `next`)
- **Advisory:** GHSA-wq5f-xc86-pv6w (CVE-2026-96889, librsvg)
- **Why it matters:** `sharp` is the image processor Next.js uses on the server for image optimization. A crafted SVG/image processed on the server could trigger the libvips/librsvg bug.
- **Fix applied:** Resolved to `sharp@0.35.5` by the `next@16.4.2` upgrade above. No direct dependency added.

### Medium

#### M-1 — No HTTP security headers configured (CSP, HSTS, X-Frame-Options, Referrer-Policy, etc.)

- **Location:** `next.config.ts:3-5` (empty config; no `headers()`), no `middleware.ts`/`proxy.ts`, no `vercel.json`
- **Why it matters:** The site can be framed by any origin (clickjacking/phishing look-alikes of the donation page). Browsers get no HSTS pinning to HTTPS, so a first visit is open to SSL-stripping. There is no CSP to limit damage if an XSS or a compromised dependency ever appears. Referrer behaviour is left to browser defaults. Rated Medium rather than High because the site has no login, sessions or state-changing actions.
- **Fix (recommended):** Add a `headers()` block to `next.config.ts`. Start with the non-breaking headers, then roll CSP out as `Content-Security-Policy-Report-Only` and enforce it after checking the browser console on every page. (Next.js inline hydration scripts need `'unsafe-inline'` or a nonce-based CSP via `proxy.ts`; see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.)

  ```ts
  const securityHeaders = [
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    {
      key: "Content-Security-Policy-Report-Only",
      value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
    },
  ];
  const nextConfig: NextConfig = {
    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  };
  ```
  Only enable `preload` on HSTS once every subdomain of `pontmas.hu` serves HTTPS.

#### M-2 — Contact form reports success but never sends the message

- **Location:** `src/components/forms/ContactForm.tsx:46-50` (`setTimeout` "simulated submission"), rendered at `src/app/kapcsolat/page.tsx:104`
- **Why it matters:** Users submit names, e-mails, phone numbers and possibly sensitive details about an autistic child. The page then says *"Üzenetét sikeresen megkaptuk"* ("we received your message"), but nothing is transmitted or stored. This is an integrity and trust failure: families seeking help are silently dropped. When a real backend is added, it becomes the site's main attack surface.
- **Fix (recommended):** Short term, replace the fake success with a clear `mailto:info@pontmas.hu` fallback or hide the form. When implementing for real, use a Server Action or Route Handler that:
  - validates server-side (schema, max lengths, e-mail format, `tema` allowlist; see L-1)
  - rate-limits per IP and adds a honeypot or privacy-friendly CAPTCHA
  - sends through a transactional mail provider, with the API key held only in server-side env vars (never `NEXT_PUBLIC_*`)
  - never echoes raw input back as HTML

#### M-3 — Personal data collected without a privacy notice or GDPR information

- **Location:** `src/components/forms/ContactForm.tsx:100` (form), the Google Form link at `src/app/hirek/page.tsx:47`; no privacy policy page exists under `src/app/`
- **Why it matters:** GDPR Art. 13 requires informing data subjects at the point of collection: controller, purpose, legal basis, retention and rights. Messages about a child's autism may contain special-category health data (Art. 9). The Google Form sends data to Google as a third-party processor.
- **Fix (recommended):** Add an `/adatvedelem` (privacy policy) page and link it from the footer and directly under the submit button ("Az üzenet elküldésével elfogadja az Adatkezelési tájékoztatót"). Add a note next to the Google Form link that it is operated by Google. Define a retention period for contact messages.

### Low

#### L-1 — `topic` query parameter is not checked against an allowlist

- **Location:** `src/components/forms/ContactForm.tsx:10, 21-24`
- **Why it matters:** `?topic=<anything>` is written straight into form state. React escapes it, so there is **no XSS today**. But the unvalidated value would be submitted as-is once a backend exists, and the `<select>` shows a mismatched state. (This effect is also one of the 2 pre-existing `react-hooks/set-state-in-effect` lint errors.)
- **Fix:** Keep a `const TOPICS = [...] as const` list, derive the initial state with `TOPICS.includes(t) ? t : 'altalanos'` in the `useState` initializer (removing the effect), and validate the same list server-side.

#### L-2 — JSON-LD injected via `dangerouslySetInnerHTML` without escaping `<`

- **Location:** `src/app/layout.tsx:48-51`
- **Why it matters:** The data is static today, so it is safe. If any field ever comes from a CMS or user input, a value containing `</script>` would break out of the tag (stored XSS).
- **Fix:** `JSON.stringify(jsonLd).replace(/</g, "\\u003c")`.

#### L-3 — Dev-tooling dependency advisories (`brace-expansion`, `braces`/`micromatch`/`fast-glob` via `eslint-config-next`, `source-map-js`)

- **Location:** `package-lock.json`; root cause `package.json:27` (`eslint-config-next`) and `@tailwindcss/postcss` → `postcss` → `source-map-js@1.2.1`
- **Why it matters:** `npm audit` reports these as High, but they are DoS bugs (ReDoS / stack exhaustion) in **lint and build-time** tooling. That tooling only processes the repository's own trusted files and is not shipped to visitors, so the real-world risk is low.
- **Fix:** Run `npm audit fix` (non-breaking) for `brace-expansion` and `source-map-js`. For the `eslint-config-next` chain, wait for an upstream release. Do **not** use `npm audit fix --force`: it would downgrade to `eslint-config-next@14`.

#### L-4 — `eslint-config-next` version does not match `next`

- **Location:** `package.json:27` (`16.3.4`) vs `package.json:16` (`16.4.2`)
- **Why it matters:** Lint rules and the framework drift apart, so new framework-specific checks (including security-relevant ones) are missed.
- **Fix:** Bump `eslint-config-next` to `16.4.2` in a separate dependency PR and re-run `npm run lint`.

#### L-5 — Images will be uploaded without EXIF/GPS stripping guidance

- **Location:** `public/images/README-kepek.txt` (instructs uploading `csapat.jpg`, `kek-seta.jpg`, `nyari-tabor.jpg`, `csaladi-nap.jpg`)
- **Why it matters:** **No raster images exist in the repo or its history today**, so nothing currently leaks. But phone photos of children at camps and family days usually carry GPS coordinates and device data. Files in `public/` are served byte-for-byte, and the originals stay in git history forever.
- **Fix:** Strip metadata before committing (`exiftool -all= -overwrite_original public/images/*.jpg`), add that step to `README-kepek.txt`, and optionally add a CI or pre-commit check that fails if `exiftool -gps:all` returns data. Make sure parental consent exists for any identifiable child photos.

#### L-6 — Stray / internal files at repository root

- **Location:** `0.26.0` (empty file, likely an accidental shell redirect such as `npm i x@>0.26.0`), `status.log`, `elemzes_es_terv.md`, `AGENT.md`, `conductor/`
- **Why it matters:** None of these are served by the website (only `public/` is). But the repository is public, so internal planning notes are world-readable, and stray files suggest commands are being run without review.
- **Fix:** Delete `0.26.0`. Consider moving internal notes out of the public repo. Add `*.log` to `.gitignore` (currently only `npm-debug.log*`, etc. are ignored).

### Info (no action required)

- **I-1 — No secrets in history.** All 51 commits on all refs were scanned. No credentials, tokens, private keys or `.env` files were found, and there are no deleted files that could hide one. `.gitignore:34` ignores `.env*` correctly, and the code has no `process.env` usage.
- **I-2 — Public financial identifiers are intentional.** The tax number and CIB bank account in `src/app/tamogatas/page.tsx` and `README.md` are deliberately published for donations. Because a malicious edit to them would redirect donations, consider branch protection on `main` and required reviews for changes to `src/app/tamogatas/`. These are repository settings; they were not changed by this audit.
- **I-3 — No third-party trackers.** There are no analytics, tag managers, pixels, social SDKs, iframes or external `<script>` tags. `next/font/google` (`src/app/layout.tsx:10`) self-hosts the font at build time, so visitors make no requests to Google. All `target="_blank"` links (`Footer.tsx:81`, `kapcsolat/page.tsx:89`, `hirek/page.tsx:181`) correctly set `rel="noopener noreferrer"`.
- **I-4 — No cookies; `localStorage` use is strictly functional.** The only client storage is accessibility preferences (`src/context/SensoryContext.tsx:55, 75`, key `pontmas_a11y_prefs`). This is user-requested functional storage, exempt from consent under ePrivacy Art. 5(3), so no cookie banner is needed. Re-evaluate if analytics or embeds are added.
- **I-5 — Pre-existing lint errors.** `npm run lint` reports 2 errors (`react-hooks/set-state-in-effect` in `ContactForm.tsx:22` and `SensoryContext.tsx:58`) and 24 warnings. These are identical before and after this PR (the ESLint dependency tree is untouched). They are code-quality issues, not vulnerabilities.

---

## 5. Changes made in this PR

| Finding | Change | Risk |
|---|---|---|
| H-1, H-2 | `next` `16.3.7` → `16.4.2` in `package.json`; lockfile updated (`next`, `@next/*` SWC binaries, `sharp` 0.35.4 → 0.35.5 and its `@img/*` binaries). No other packages changed. | Low: same major version. `npm test` 20/20 pass, `npm run build` succeeds with the identical 14 static routes, lint output unchanged. |

After the fix, `npm audit` reports 7 remaining advisories, all in dev/build tooling (see L-3). No production-runtime advisory remains.

## 6. Recommended next steps (priority order)

1. M-1: add security headers (CSP in report-only mode first).
2. M-2 and M-3: either wire up a real, validated contact backend with a privacy notice, or remove the fake success state.
3. L-5: adopt EXIF stripping before the first photos are uploaded.
4. L-1 to L-4, L-6: housekeeping in a follow-up PR.
5. Repository settings (owner action): branch protection on `main`, Dependabot/security alerts, secret scanning with push protection.
