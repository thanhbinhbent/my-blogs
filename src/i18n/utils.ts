import { defaultLang, ui, type Lang, type UiKey } from './ui';

function base(): string {
  return (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
}

export function withBase(path: string): string {
  return base() + path;
}

export function getLangFromUrl(url: URL): Lang {
  const b = base();
  const path = b && url.pathname.startsWith(b) ? url.pathname.slice(b.length) || '/' : url.pathname;
  const [, first] = path.split('/');
  if (first === 'vi') return 'vi';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey) {
    return (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key];
  };
}

export function getLocalePath(path: string, lang: Lang): string {
  if (lang === 'en') return withBase(path);
  const clean = path === '/' ? '' : path;
  return withBase(`/vi${clean}`);
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en';
}

export function getAlternatePath(currentPath: string, lang: Lang): string {
  const b = base();
  const path = b && currentPath.startsWith(b) ? currentPath.slice(b.length) || '/' : currentPath;
  if (lang === 'vi') {
    return withBase('/vi' + (path === '/' ? '' : path));
  }
  return withBase(path.replace(/^\/vi/, '') || '/');
}
