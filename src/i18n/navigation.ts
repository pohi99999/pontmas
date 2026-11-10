import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware Link and hooks: <Link href="/autizmus"> goes to /autizmus in Hungarian and to
// /en/autizmus in English. The language switcher (Lumen) uses usePathname() + <Link locale="en">.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
