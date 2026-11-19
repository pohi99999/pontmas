// The contact form's brake against bursts: 5 messages per address in 10 minutes. It lives in the
// server's memory, so it is per server instance: enough against a script hammering one instance, not a
// hard global limit.
//
// The data notice (/adatkezeles) says the brake keeps the sender's IP address in memory for AT MOST 10
// minutes. So an address is forgotten the moment its last counted message leaves the window: when it is
// looked at again (its list is empty, the key goes), and by a timer of its own if it never comes back. A
// refused message adds nothing, so it does not keep the address any longer.
//
// It lives here, not in the route file, because a Next route file may export only its handlers, and the
// tests need to see what is held (holds()).

export const WINDOW_MS = 10 * 60_000;
export const MAX = 5;

const hits = new Map<string, number[]>();

/** Drops what left the window; an address with nothing left is forgotten. Returns what is left. */
function prune(ip: string, now: number): number[] {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length === 0) hits.delete(ip);
  else hits.set(ip, recent);
  return recent;
}

/** True when this address already sent MAX messages in the window; otherwise counts this one. */
export function limited(ip: string): boolean {
  const now = Date.now();
  const recent = prune(ip, now);
  if (recent.length >= MAX) return true;
  hits.set(ip, [...recent, now]);
  // When this message leaves the window the address is looked at again, even if it never comes back.
  // unref: the timer does not keep the process alive.
  const timer = setTimeout(() => prune(ip, Date.now()), WINDOW_MS);
  (timer as { unref?: () => void }).unref?.();
  return false;
}

/** Whether the brake holds this address now. For the tests: what the data notice promises is measured on it. */
export function holds(ip: string): boolean {
  return hits.has(ip);
}
