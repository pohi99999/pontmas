"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { szamlalo } from '@/lib/mozgas';

// Reveals the [data-mozgas] elements of a page once each, when they come on screen, while <html> has
// "pm-mozgas" (set by MOZGAS_SCRIPT only when motion is allowed). If the visitor switches on "Lágy mód"
// or "Mozgáscsökkentés", or the device asks for reduced motion, everything jumps to its final state.
const DURATION = 1100;

function showAll() {
  document.documentElement.classList.remove('pm-mozgas');
  // a transition already running keeps its old duration in CSS: end it here, so the switch is immediate
  document.getAnimations().forEach((a) => { try { a.finish(); } catch {} });
  document.querySelectorAll<HTMLElement>('[data-szamlal]').forEach((el) => { el.textContent = el.dataset.vegso ?? el.textContent; });
}

function countUp(el: HTMLElement, isOff: () => boolean) {
  const to = Number(el.dataset.szamlal), from = Number(el.dataset.tol ?? 0), suffix = el.dataset.utotag ?? '';
  const start = performance.now();
  const step = (now: number) => {
    if (isOff()) { el.textContent = el.dataset.vegso ?? `${to}${suffix}`; return; }
    const v = szamlalo(from, to, now - start, DURATION);
    el.textContent = `${v}${suffix}`;
    if (v !== to) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function MozgasKapu() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mozgasKesz = '1';
    if (!root.classList.contains('pm-mozgas')) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isOff = () => reduce.matches || !!document.querySelector('.sensory-friendly, .reduced-motion') || !root.classList.contains('pm-mozgas');

    // A fully clipped element (the ink before it is drawn) never intersects, so such elements are watched
    // through their parent; the parent's entry reveals them.
    const byWatch = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        for (const el of byWatch.get(e.target) ?? []) {
          el.classList.add('pm-latszik');
          if (el.dataset.szamlal) countUp(el, isOff);
        }
        io.unobserve(e.target);
      }
    }, { threshold: 0.15 });
    document.querySelectorAll<HTMLElement>('[data-mozgas]').forEach((el) => {
      const watch = el.dataset.mozgas === 'iv' && el.parentElement ? el.parentElement : el;
      byWatch.set(watch, [...(byWatch.get(watch) ?? []), el]);
    });
    byWatch.forEach((_, watch) => io.observe(watch));

    // switched off while the page is open: final state at once
    const stop = () => { if (isOff()) { io.disconnect(); showAll(); } };
    const mo = new MutationObserver(stop);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
    reduce.addEventListener('change', stop);
    return () => { io.disconnect(); mo.disconnect(); reduce.removeEventListener('change', stop); };
  }, [pathname]);
  return null;
}
