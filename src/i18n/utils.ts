import { defaultLang, ui, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'vi') return 'vi';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey) {
    return (ui[lang] as any)[key] ?? (ui[defaultLang] as any)[key];
  };
}

export function getLocalePath(path: string, lang: Lang): string {
  if (lang === 'en') return path;
  const clean = path === '/' ? '' : path;
  return `/vi${clean}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en';
}

export function getAlternatePath(currentPath: string, lang: Lang): string {
  if (lang === 'vi') {
    // currently on EN → switch to VI
    return `/vi${currentPath === '/' ? '' : currentPath}`;
  }
  // currently on VI → strip /vi prefix
  return currentPath.replace(/^\/vi/, '') || '/';
}
