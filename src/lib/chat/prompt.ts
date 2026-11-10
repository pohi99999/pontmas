// The system prompt, in cache order (card c017f163): what changes least comes first.
// 1. RULES + KNOWLEDGE: fixed until a page or a rule changes; the cache breakpoint is on its end, so
//    repeated calls read it from the prompt cache at a tenth of the input price.
// 2. CURRENT ITEMS: the editor's visible news and programmes; changes when the editor saves.
// 3. LANGUAGE: per request, last, so it never breaks the cached prefix.
import type { NewsItem, ProgramItem } from '@/content/types';
import { SITE_KNOWLEDGE, type KnowledgePage } from './knowledge.generated';
import { REPLY_LANGUAGE, RULES, type ChatLocale } from './rules';

export interface SystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

export function knowledgeText(pages: KnowledgePage[] = SITE_KNOWLEDGE): string {
  return pages.map((p) => `### Page ${p.route}\n${p.text}`).join('\n\n');
}

export function itemsText(news: NewsItem[], programs: ProgramItem[]): string {
  const line = (x: { title: string; date: string; location: string; description: string }) =>
    `- ${x.title} | ${x.date} | ${x.location}\n  ${x.description}`;
  return [
    'NEWS (/hirek):', ...(news.length ? news.map(line) : ['- none']),
    '', 'PROGRAMMES (/programok):', ...(programs.length ? programs.map(line) : ['- none']),
  ].join('\n');
}

export function buildSystem(locale: ChatLocale, news: NewsItem[], programs: ProgramItem[], pages: KnowledgePage[] = SITE_KNOWLEDGE): SystemBlock[] {
  return [
    { type: 'text', text: `${RULES}\n\nKNOWLEDGE (the website's own text):\n\n${knowledgeText(pages)}`, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `CURRENT ITEMS (from the site's editor):\n${itemsText(news, programs)}` },
    { type: 'text', text: `Reply in ${REPLY_LANGUAGE[locale]}.` },
  ];
}
