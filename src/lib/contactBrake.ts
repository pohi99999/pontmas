// The contact form's brake against bursts: 5 messages per address in 10 minutes. It lives in the
// server's memory, so it is per server instance: enough against a script hammering one instance, not a
// hard global limit.
//
// The data notice (/adatkezeles) says the brake keeps the sender's IP address in memory for AT MOST 10
// minutes. So an address is forgotten the moment its last counted message leaves the window: when it is
// looked at again (its list is empty, the key goes), and by a timer of its own if it never comes back. A
// refused message adds nothing, so it does not keep the address any longer.
//
// A real timer may fire a millisecond before Date.now() says the message is a full window old (measured
// by the Ellenőr, 8187: 13-18 percent with a 300 ms window). Such a timer finds the message still inside
// the window; it then waits again for the time that is left, so an early firing is never the last look.
//
// It lives here, not in the route file, because a Next route file may export only its handlers, and the
// tests need to see what is held (holds()) and to run the same code with a short window (createBrake).

export const WINDOW_MS = 10 * 60_000;
export const MAX = 5;

export type Brake = {
  /** True when this address already sent `max` messages in the window; otherwise counts this one. */
  limited(ip: string): boolean;
  /** Whether the brake holds this address now. */
  holds(ip: string): boolean;
};

export function createBrake({ windowMs, max }: { windowMs: number; max: number }): Brake {
  const hits = new Map<string, number[]>();

  /** Drops what left the window; an address with nothing left is forgotten. Returns what is left. */
  const prune = (ip: string, now: number): number[] => {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
    return recent;
  };

  /** Looks at the address again after `delay`; while something is left, again when the oldest leaves the window. */
  const lookAgain = (ip: string, delay: number) => {
    const timer = setTimeout(() => {
      const now = Date.now();
      const left = prune(ip, now);
      if (left.length > 0) lookAgain(ip, left[0] + windowMs - now);
    }, Math.max(1, delay));
    // unref: the timer does not keep the process alive.
    (timer as { unref?: () => void }).unref?.();
  };

  return {
    limited(ip) {
      const now = Date.now();
      const recent = prune(ip, now);
      if (recent.length >= max) return true;
      hits.set(ip, [...recent, now]);
      lookAgain(ip, windowMs);
      return false;
    },
    holds: (ip) => hits.has(ip),
  };
}

const brake = createBrake({ windowMs: WINDOW_MS, max: MAX });

/** The contact form's brake, as the route uses it. */
export const limited = (ip: string): boolean => brake.limited(ip);
/** Whether the contact form's brake holds this address now. For the tests. */
export const holds = (ip: string): boolean => brake.holds(ip);
