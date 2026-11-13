"use client";

// The content editor (/szerkeszto), mobile first: one column, large buttons (at least 44 px).
// Flow for one item: edit, "Előnézet" (the real card the public page will show), then "Mentés",
// which stays inactive until the preview of the current text was shown. The text being edited is
// kept in the phone's local storage, so a lost connection does not lose it.
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { NewsCard, NewsFeaturedCard, ProgramCard } from '@/components/content/ContentCards';
import type { HistoryEntry } from '@/content/store';
import {
  CHILD_PHOTO_DECLARATION_TEXT,
  DECLARATION_HEADER,
  LIMITS,
  PROGRAM_CATEGORIES,
  type NewsItem,
  type ProgramCategory,
  type ProgramItem,
  type SiteContent,
} from '@/content/types';
import { HIDDEN_TOGGLE_HINT, HIDDEN_TOGGLE_LABEL, blankNews, blankProgram, saveButtonText, savedMessage } from '@/content/newItems';
import { validateNewsItem, validateProgramItem, type ValidationError } from '@/content/validate';
import { LEZARULT_ESEMENYEK, publicNews } from '@/content/public';
import { MAX_BYTES, resizeForUpload } from './imageResize';

type Kind = 'news' | 'programs';
type AnyItem = NewsItem | ProgramItem;
interface Editing {
  kind: Kind;
  item: AnyItem;
  isNew: boolean;
}
interface Loaded {
  content: SiteContent;
  base: string | null;
  history: HistoryEntry[];
  storeConfigured: boolean;
}

const DRAFT_KEY = 'pontmas-szerkeszto-piszkozat-v1';
const CATEGORY_LABEL: Record<ProgramCategory, string> = {
  event: 'Kiemelt esemény',
  camp: 'Nyári tábor',
  family: 'Szülőklub és családok',
};
const ERROR_TEXT: Record<string, string> = {
  conflict: 'Időközben valaki más is mentett. Kérjük, töltse újra az oldalt; a piszkozata megmarad ebben a böngészőben.',
  unauthorized: 'A belépése lejárt. Kérjük, lépjen be újra; a piszkozata megmarad ebben a böngészőben.',
  store_unavailable: 'A tároló most nem érhető el. Kérjük, próbálja újra később.',
  too_large: 'A kép túl nagy (legfeljebb 5 MB lehet).',
  not_an_image: 'Ez a fájl nem JPEG, PNG vagy WebP kép.',
  unreadable: 'A képet nem sikerült beolvasni.',
  too_big_dimensions: 'A kép mérete túl nagy.',
  declaration_required: 'A kép feltöltéséhez előbb be kell jelölni a gyermekfotó-nyilatkozatot.',
  has_metadata: 'A kép rejtett adatokat (például helyadatot) tartalmaz. Kérjük, töltse fel újra a szerkesztőn keresztül.',
  rate_limited: 'Túl sok kérés érkezett. Kérjük, próbálja újra később.',
  version_not_found: 'Ez a korábbi változat már nem érhető el.',
  invalid: 'A mentés nem sikerült, mert néhány mező hibás.',
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('hu-HU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Budapest' }).format(new Date(iso));

function readDraft(): Editing | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Editing) : null;
  } catch {
    return null;
  }
}
function writeDraft(e: Editing | null) {
  try {
    if (e) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(e));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* private mode or full storage: the editor still works, only without the safety copy */
  }
}

const btn = 'min-h-11 rounded-xl px-4 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const btnPrimary = `${btn} bg-blue-700 text-white hover:bg-blue-800`;
const btnSecondary = `${btn} border border-slate-300 bg-white text-slate-900 hover:bg-slate-50`;
const btnDanger = `${btn} border border-red-300 bg-white text-red-800 hover:bg-red-50`;
const inputCls = 'block min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base';

export default function EditorApp({ editor }: { editor: string }) {
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Kind | 'history'>('news');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [savedDraft, setSavedDraft] = useState<Editing | null>(null);
  const [previewed, setPreviewed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch('/api/szerkeszto/tartalom', { cache: 'no-store' });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        setLoadError(ERROR_TEXT[body?.error] ?? 'A tartalmat nem sikerült betölteni.');
        return;
      }
      setData({ content: body.content, base: body.base, history: body.history, storeConfigured: body.storeConfigured });
    } catch {
      setLoadError('A tartalmat nem sikerült betölteni. Kérjük, ellenőrizze az internetkapcsolatot.');
    }
  }, []);

  useEffect(() => {
    // loading data from the API when the editor opens
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    setSavedDraft(readDraft());
  }, [load]);

  // every change of the edited item is kept locally
  useEffect(() => {
    if (editing) writeDraft(editing);
  }, [editing]);

  const errors = useMemo(() => {
    if (!editing) return [];
    const v = editing.kind === 'news' ? validateNewsItem(editing.item) : validateProgramItem(editing.item);
    return v.ok ? [] : v.errors;
  }, [editing]);

  const itemKey = editing ? JSON.stringify(editing.item) : '';
  const canSave = !!editing && errors.length === 0 && previewed === itemKey && !busy && !!data?.storeConfigured;

  function update(patch: Partial<NewsItem> & Partial<ProgramItem>) {
    setEditing((e) => (e ? { ...e, item: { ...e.item, ...patch } as AnyItem } : e));
    setServerErrors([]);
  }

  async function save(content: SiteContent, okText: string, extra?: { restore: string }) {
    if (!data) return false;
    setBusy(true);
    setMessage(null);
    setServerErrors([]);
    try {
      const res = await fetch('/api/szerkeszto/tartalom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extra ? { base: data.base, ...extra } : { base: data.base, content }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        setMessage({ kind: 'error', text: ERROR_TEXT[body?.error] ?? 'A mentés nem sikerült. Kérjük, próbálja újra.' });
        if (Array.isArray(body?.errors)) setServerErrors(body.errors);
        return false;
      }
      setData({ ...data, content: body.content, base: body.base, history: body.history });
      setMessage({ kind: 'ok', text: `${okText} (${body.summary})` });
      return true;
    } catch {
      setMessage({ kind: 'error', text: 'A mentés nem sikerült: nincs internetkapcsolat. A szöveg megmaradt ebben a böngészőben.' });
      return false;
    } finally {
      setBusy(false);
    }
  }

  function withItem(content: SiteContent, kind: Kind, item: AnyItem, isNew: boolean): SiteContent {
    const list = content[kind] as AnyItem[];
    const next = isNew ? [item, ...list] : list.map((x) => (x.id === item.id ? item : x));
    return { ...content, [kind]: next } as SiteContent;
  }

  async function saveEditing() {
    if (!editing || !data || !canSave) return;
    const ok = await save(withItem(data.content, editing.kind, editing.item, editing.isNew), savedMessage(editing.item.hidden));
    if (ok) {
      setEditing(null);
      setPreviewed(null);
      writeDraft(null);
      setSavedDraft(null);
    }
  }

  async function toggleHidden(kind: Kind, item: AnyItem) {
    if (!data) return;
    const text = item.hidden ? 'Közzétéve, a honlapon látszik.' : 'Elrejtve, a honlapon nem látszik.';
    await save(withItem(data.content, kind, { ...item, hidden: !item.hidden }, false), text);
  }

  async function remove(kind: Kind, item: AnyItem) {
    if (!data) return;
    if (!window.confirm(`Biztosan törli ezt az elemet?\n\n"${item.title}"\n\nHa csak ideiglenesen nem szeretné mutatni, használja inkább az Elrejtés gombot.`)) return;
    const list = (data.content[kind] as AnyItem[]).filter((x) => x.id !== item.id);
    await save({ ...data.content, [kind]: list } as SiteContent, 'Törölve.');
  }

  async function move(kind: Kind, index: number, delta: number) {
    if (!data) return;
    const list = [...(data.content[kind] as AnyItem[])];
    const j = index + delta;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    await save({ ...data.content, [kind]: list } as SiteContent, 'A sorrend mentve.');
  }

  async function restore(entry: HistoryEntry) {
    if (!data) return;
    if (!window.confirm(`Visszaállítja a(z) ${fmt(entry.at)} változatot? Ez új mentésként kerül a honlapra.`)) return;
    await save(data.content, 'Visszaállítva.', { restore: entry.id });
  }

  async function logout() {
    await fetch('/api/szerkeszto/kilepes', { method: 'POST' }).catch(() => null);
    window.location.reload();
  }

  function startEdit(kind: Kind, item: AnyItem | null) {
    setMessage(null);
    setPreviewed(null);
    setServerErrors([]);
    setEditing({ kind, item: item ? (JSON.parse(JSON.stringify(item)) as AnyItem) : kind === 'news' ? blankNews() : blankProgram(), isNew: !item });
    window.scrollTo({ top: 0 });
  }

  if (loadError) {
    return (
      <div className="mt-6 space-y-4">
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-base text-red-900">{loadError}</p>
        <button type="button" className={btnPrimary} onClick={() => void load()}>Újrapróbálás</button>
      </div>
    );
  }
  if (!data) return <p className="mt-6 text-base text-slate-700" role="status">Betöltés...</p>;

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <span>Belépve: <strong>{editor}</strong></span>
        <button type="button" className={btnSecondary} onClick={() => void logout()}>Kilépés</button>
      </div>

      {!data.storeConfigured && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
          A tároló még nincs beállítva, ezért most csak böngészni lehet, menteni nem.
        </p>
      )}

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`rounded-2xl border p-4 text-base ${message.kind === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}>
          {message.text}
        </p>
      )}

      {savedDraft && !editing && (
        <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-base text-blue-900">Van egy mentetlen piszkozata: <strong>{savedDraft.item.title || '(cím nélkül)'}</strong></p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={btnPrimary} onClick={() => { setEditing(savedDraft); setSavedDraft(null); }}>Folytatás</button>
            <button type="button" className={btnSecondary} onClick={() => { writeDraft(null); setSavedDraft(null); }}>Elvetés</button>
          </div>
        </div>
      )}

      {editing ? (
        <ItemForm
          key={editing.item.id}
          editing={editing}
          editor={editor}
          errors={[...errors, ...serverErrors]}
          update={update}
          busy={busy}
          canSave={canSave}
          previewShown={previewed === itemKey}
          onPreview={() => setPreviewed(itemKey)}
          onSave={() => void saveEditing()}
          onCancel={() => { setEditing(null); setPreviewed(null); writeDraft(null); }}
          onMessage={setMessage}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Szerkesztendő tartalom">
            {([['news', 'Hírek'], ['programs', 'Programok'], ['history', 'Előzmények']] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className={`${btn} px-2 ${tab === id ? 'bg-blue-700 text-white' : 'border border-slate-300 bg-white text-slate-900'}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'history' ? (
            <ul className="space-y-3">
              {data.history.length === 0 && <li className="text-base text-slate-700">Még nincs mentett változat.</li>}
              {data.history.map((h, i) => (
                <li key={h.id} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-base font-bold text-slate-900">{fmt(h.at)}{i === 0 && ' (jelenlegi)'}</p>
                  <p className="text-sm text-slate-700">{h.editor}: {h.summary}</p>
                  {i > 0 && (
                    <button type="button" className={btnSecondary} disabled={busy || !data.storeConfigured} onClick={() => void restore(h)}>
                      Visszaállítás
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              <button type="button" className={`${btnPrimary} w-full`} disabled={!data.storeConfigured} onClick={() => startEdit(tab, null)}>
                {tab === 'news' ? 'Új hír' : 'Új program'}
              </button>
              <ul className="space-y-3">
                {(data.content[tab] as AnyItem[]).map((item, i, list) => (
                  <li key={item.id} className={`space-y-3 rounded-2xl border p-4 ${item.hidden ? 'border-dashed border-slate-300 bg-slate-100' : 'border-slate-200 bg-white'}`}>
                    <div>
                      <p className="text-base font-bold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-700">
                        {item.date}
                        {item.hidden && <span className="font-bold"> | rejtett, a honlapon nem látszik</span>}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className={btnSecondary} disabled={busy || !data.storeConfigured} onClick={() => startEdit(tab, item)}>Szerkesztés</button>
                      <button type="button" className={btnSecondary} disabled={busy || !data.storeConfigured} onClick={() => void toggleHidden(tab, item)}>
                        {item.hidden ? 'Közzététel' : 'Elrejtés'}
                      </button>
                      <button type="button" className={btnSecondary} disabled={busy || i === 0 || !data.storeConfigured} onClick={() => void move(tab, i, -1)} aria-label={`Feljebb: ${item.title}`}>Feljebb</button>
                      <button type="button" className={btnSecondary} disabled={busy || i === list.length - 1 || !data.storeConfigured} onClick={() => void move(tab, i, 1)} aria-label={`Lejjebb: ${item.title}`}>Lejjebb</button>
                      <button type="button" className={`${btnDanger} col-span-2`} disabled={busy || !data.storeConfigured} onClick={() => void remove(tab, item)}>Törlés</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, value, max, onChange, type = 'text', multiline = false, hint }: {
  label: string; value: string; max?: number; onChange: (v: string) => void; type?: string; multiline?: boolean; hint?: string;
}) {
  const id = useId();
  const described = [hint && `${id}-hint`, max && `${id}-count`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-slate-900">{label}</label>
      {hint && <span id={`${id}-hint`} className="block text-xs text-slate-600">{hint}</span>}
      {multiline ? (
        <textarea id={id} aria-describedby={described} value={value} maxLength={max} rows={6} onChange={(e) => onChange(e.target.value)} className={`${inputCls} py-2`} />
      ) : (
        <input id={id} aria-describedby={described} type={type} value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
      {max && <span id={`${id}-count`} className="block text-right text-xs text-slate-600">{value.length} / {max} karakter</span>}
    </div>
  );
}

function ItemForm({ editing, editor, errors, update, busy, canSave, previewShown, onPreview, onSave, onCancel, onMessage }: {
  editing: Editing; editor: string; errors: ValidationError[]; update: (p: Partial<NewsItem> & Partial<ProgramItem>) => void;
  busy: boolean; canSave: boolean; previewShown: boolean; onPreview: () => void; onSave: () => void; onCancel: () => void;
  onMessage: (m: { kind: 'ok' | 'error'; text: string } | null) => void;
}) {
  const { kind, item } = editing;
  const news = kind === 'news' ? (item as NewsItem) : null;
  const program = kind === 'programs' ? (item as ProgramItem) : null;
  const [uploading, setUploading] = useState(false);
  // the declaration comes BEFORE the file: without the tick no photo can be chosen or uploaded
  const [ticked, setTicked] = useState(!!item.image?.childPhotoDeclaration);

  async function onFile(file: File | undefined) {
    if (!file) return;
    // belt and braces: the input is disabled until the box is ticked, and a change event that gets
    // through anyway (assistive tools, scripts) must not upload either
    if (!ticked) {
      onMessage({ kind: 'error', text: ERROR_TEXT.declaration_required });
      return;
    }
    setUploading(true);
    onMessage(null);
    try {
      const { blob, width, height } = await resizeForUpload(file);
      if (blob.size > MAX_BYTES) {
        onMessage({ kind: 'error', text: ERROR_TEXT.too_large });
        return;
      }
      const res = await fetch('/api/szerkeszto/feltoltes', { method: 'POST', headers: { 'Content-Type': 'image/jpeg', [DECLARATION_HEADER]: '1' }, body: blob });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        onMessage({ kind: 'error', text: ERROR_TEXT[body?.error] ?? 'A kép feltöltése nem sikerült.' });
        return;
      }
      // who and when is written again by the server when the content is saved
      update({
        image: {
          url: body.url, alt: item.image?.alt ?? '', width: body.width ?? width, height: body.height ?? height,
          childPhotoDeclaration: { declaredBy: editor, at: new Date().toISOString() },
        },
      });
    } catch {
      onMessage({ kind: 'error', text: 'A képet nem sikerült feldolgozni vagy feltölteni.' });
    } finally {
      setUploading(false);
    }
  }

  const setHighlight = (i: number, v: string) => update({ highlights: item.highlights.map((h, j) => (j === i ? v : h)) });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-900">
        {editing.isNew ? (news ? 'Új hír' : 'Új program') : 'Szerkesztés'}
      </h2>

      {program && (
        <label className="block space-y-1">
          <span className="block text-sm font-bold text-slate-900">Kategória</span>
          <select value={program.category} onChange={(e) => update({ category: e.target.value as ProgramCategory })} className={inputCls}>
            {PROGRAM_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
          </select>
        </label>
      )}
      <Field label="Cím" value={item.title} max={LIMITS.title} onChange={(v) => update({ title: v })} />
      <Field label="Címke" hint="Például: Közösségi Élet • Beszámoló" value={item.badge} max={LIMITS.badge} onChange={(v) => update({ badge: v })} />
      <Field label="Időpont, ahogy a honlapon megjelenik" hint="Például: 2024. szeptember 28." value={item.date} max={LIMITS.date} onChange={(v) => update({ date: v })} />
      <Field label="Közzététel dátuma" type="date" value={item.publishedAt} onChange={(v) => update({ publishedAt: v })} />
      <Field label={program ? 'Helyszín' : 'Helyszín (nem kötelező)'} value={item.location} max={LIMITS.location} onChange={(v) => update({ location: v })} />
      {news && <Field label="Előadó (nem kötelező)" value={news.speaker} max={LIMITS.speaker} onChange={(v) => update({ speaker: v })} />}
      <Field label="Leírás" value={item.description} max={LIMITS.description} multiline onChange={(v) => update({ description: v })} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-slate-900">Kiemelt pontok (legfeljebb {LIMITS.highlights})</legend>
        {item.highlights.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input aria-label={`${i + 1}. pont`} value={h} maxLength={LIMITS.highlight} onChange={(e) => setHighlight(i, e.target.value)} className={inputCls} />
            <button type="button" className={btnSecondary} aria-label={`${i + 1}. pont törlése`} onClick={() => update({ highlights: item.highlights.filter((_, j) => j !== i) })}>Törlés</button>
          </div>
        ))}
        {item.highlights.length < LIMITS.highlights && (
          <button type="button" className={btnSecondary} onClick={() => update({ highlights: [...item.highlights, ''] })}>Új pont</button>
        )}
      </fieldset>

      {news && (
        <>
          <label className="flex min-h-11 items-center gap-3 text-base text-slate-900">
            <input type="checkbox" className="h-6 w-6" checked={news.featured} onChange={(e) => update({ featured: e.target.checked })} />
            Kiemelt hír (a nagy sávban jelenik meg a Hírek oldal tetején)
          </label>
          <Field label="Gomb szövege (nem kötelező)" value={news.actionText} max={LIMITS.actionText} onChange={(v) => update({ actionText: v })} />
          <Field label="Gomb linkje" hint='https:// kezdetű cím, vagy a honlapon belüli útvonal, például /kapcsolat' value={news.actionHref} max={LIMITS.href} onChange={(v) => update({ actionHref: v })} />
          <Field label="Űrlap linkje (nem kötelező)" hint="https:// kezdetű cím" value={news.googleFormHref ?? ''} max={LIMITS.href}
            onChange={(v) => update({ googleFormHref: v || undefined })} />
        </>
      )}

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <legend className="px-1 text-sm font-bold text-slate-900">Kép (nem kötelező)</legend>
        <label className="flex items-start gap-3 text-base text-slate-900">
          <input type="checkbox" className="mt-1 h-6 w-6 flex-shrink-0" checked={ticked || !!item.image} disabled={!!item.image || uploading}
            onChange={(e) => setTicked(e.target.checked)} />
          <span>{CHILD_PHOTO_DECLARATION_TEXT}</span>
        </label>
        {!item.image && !ticked && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Kép csak a nyilatkozat bejelölése után választható ki és tölthető fel. Nyilatkozat nélkül nem mentünk képet.</p>
        )}
        <label className="block">
          <span className="sr-only">Kép kiválasztása</span>
          <input type="file" accept="image/*" disabled={uploading || !ticked || !!item.image} onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }}
            className="block min-h-11 w-full text-base file:mr-3 file:min-h-11 file:rounded-xl file:border-0 file:bg-blue-700 file:px-4 file:font-bold file:text-white disabled:opacity-50" />
        </label>
        <p className="text-xs text-slate-600">Fénykép a telefon kamerájával vagy a galériából. Feltöltés előtt a böngésző kicsinyíti (legfeljebb 1600 képpont) és eltávolítja a rejtett adatokat, például a helyadatot.</p>
        {uploading && <p role="status" className="text-sm text-slate-700">Feltöltés folyamatban...</p>}
        {item.image && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image.url} alt="" width={item.image.width} height={item.image.height} className="h-auto max-h-60 w-auto rounded-xl border border-slate-200" />
            <Field label="A kép rövid leírása (látássérült látogatóknak)" value={item.image.alt} max={LIMITS.alt}
              onChange={(v) => update({ image: { ...item.image!, alt: v } })} />
            <p className="text-sm text-slate-700">A nyilatkozatot a mentéskor a nevével és az időponttal rögzítjük.</p>
            <button type="button" className={btnDanger} onClick={() => { update({ image: undefined }); setTicked(false); }}>Kép eltávolítása</button>
          </div>
        )}
      </fieldset>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {errors.map((e, i) => <li key={i}>{e.message}</li>)}
        </ul>
      )}

      <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-900">
        <input type="checkbox" className="mt-0.5 h-6 w-6 flex-shrink-0" checked={item.hidden} onChange={(e) => update({ hidden: e.target.checked })} />
        <span>
          <span className="font-bold">{HIDDEN_TOGGLE_LABEL}</span>
          <span className="block text-sm text-slate-700">{HIDDEN_TOGGLE_HINT}</span>
        </span>
      </label>

      {previewShown && (
        <section aria-label="Előnézet" className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">Előnézet: így jelenik meg a honlapon</h3>
          {item.hidden && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Ez az elem rejtett: így nézne ki, de most nem jelenik meg a honlapon.</p>}
          {news && LEZARULT_ESEMENYEK.has(news.id) && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Ez az esemény lezárult: a honlapon a korábbi hírek között jelenik meg, kiemelés és regisztráció nélkül.</p>}
          {news ? (publicNews(news).featured ? <NewsFeaturedCard item={publicNews(news)} /> : <NewsCard item={publicNews(news)} />) : <ProgramCard program={program!} />}
        </section>
      )}

      <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 py-3">
        <button type="button" className={`${btnSecondary} min-h-14 text-lg`} disabled={errors.length > 0 || busy} onClick={onPreview}>Előnézet</button>
        <button type="button" className={`${btnPrimary} min-h-14 text-lg`} disabled={!canSave} onClick={onSave}>
          {busy ? 'Mentés...' : saveButtonText(item.hidden)}
        </button>
        <button type="button" className={`${btnSecondary} col-span-2`} disabled={busy} onClick={onCancel}>Mégse</button>
        {!previewShown && errors.length === 0 && <p className="col-span-2 text-center text-xs text-slate-600">A Mentés gomb az előnézet megtekintése után válik aktívvá.</p>}
      </div>
    </div>
  );
}
