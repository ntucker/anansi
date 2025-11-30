import { createContext, useContext } from 'react';

export interface NavigatorProperties {
  language: string;
  languages: readonly string[];
}

export const NavigatorContext = createContext<NavigatorProperties | undefined>(
  undefined,
);

export function useNavigator(): NavigatorProperties {
  const context = useContext(NavigatorContext);
  if (context === undefined) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
}

export function parseAcceptLanguage(header: string | undefined): {
  language: string;
  languages: readonly string[];
} {
  if (!header) {
    return { language: 'en', languages: ['en'] };
  }

  const parsed = header
    .split(',')
    .map(part => {
      const [lang, qPart] = part.trim().split(';');
      const q = qPart ? parseFloat(qPart.replace('q=', '')) : 1;
      return { lang: lang.trim(), q };
    })
    .sort((a, b) => b.q - a.q)
    .map(({ lang }) => lang);

  return {
    language: parsed[0] ?? 'en',
    languages: parsed.length > 0 ? parsed : ['en'],
  };
}
