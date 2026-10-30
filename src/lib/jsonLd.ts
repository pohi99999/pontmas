// JSON for an inline <script type="application/ld+json">. JSON.stringify leaves "<" as it is, so a
// value containing "</script>" would end the tag early; the characters that matter inside a script
// element are written as \u escapes, which JSON parsers read back as the same text.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
