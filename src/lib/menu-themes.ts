// Menu theme configurations
export type MenuTheme = 'default' | 'classic' | 'modern';

export interface ThemeConfig {
  name: string;
  description: string;
  headerBg: string;
  headerText: string;
  bodyBg: string;
  cardBg: string;
  titleFont: string;
  bodyFont: string;
  accentColor: string;
  borderStyle: string;
  priceStyle: string;
}

export const themes: Record<MenuTheme, ThemeConfig> = {
  default: {
    name: 'Standaard',
    description: 'Schone, moderne uitstraling',
    headerBg: 'bg-primary',
    headerText: 'text-primary-foreground',
    bodyBg: 'bg-background',
    cardBg: 'bg-card',
    titleFont: 'font-serif',
    bodyFont: '',
    accentColor: 'text-primary',
    borderStyle: 'border border-border',
    priceStyle: 'bg-secondary text-secondary-foreground',
  },
  classic: {
    name: 'Klassiek',
    description: 'Elegant en tijdloos',
    headerBg: 'bg-amber-900',
    headerText: 'text-amber-50',
    bodyBg: 'bg-amber-50',
    cardBg: 'bg-white',
    titleFont: 'font-serif italic',
    bodyFont: 'font-serif',
    accentColor: 'text-amber-800',
    borderStyle: 'border-2 border-amber-200',
    priceStyle: 'bg-amber-100 text-amber-900',
  },
  modern: {
    name: 'Modern',
    description: 'Strak en minimalistisch',
    headerBg: 'bg-zinc-900',
    headerText: 'text-zinc-50',
    bodyBg: 'bg-zinc-50',
    cardBg: 'bg-white',
    titleFont: 'font-sans font-bold uppercase tracking-wide',
    bodyFont: 'font-sans',
    accentColor: 'text-zinc-900',
    borderStyle: 'border-0 shadow-md',
    priceStyle: 'bg-zinc-900 text-zinc-50',
  },
};

export const getTheme = (themeName: string | null | undefined): ThemeConfig => {
  if (themeName && themeName in themes) {
    return themes[themeName as MenuTheme];
  }
  return themes.default;
};