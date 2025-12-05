// Menu theme configurations
export type MenuTheme = 'elegant' | 'default' | 'simple';

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
  categoryStyle: string;
  itemSpacing: string;
}

export const themes: Record<MenuTheme, ThemeConfig> = {
  elegant: {
    name: 'Elegant',
    description: 'Michelin-stijl, verfijnd en luxueus',
    headerBg: 'bg-stone-900',
    headerText: 'text-stone-100',
    bodyBg: 'bg-stone-50',
    cardBg: 'bg-white',
    titleFont: 'font-serif italic tracking-wide',
    bodyFont: 'font-serif text-stone-600',
    accentColor: 'text-amber-700',
    borderStyle: 'border-b border-stone-200',
    priceStyle: 'text-stone-800 font-light',
    categoryStyle: 'text-center uppercase tracking-[0.3em] text-stone-400 text-sm border-b border-stone-200 pb-2',
    itemSpacing: 'py-6',
  },
  default: {
    name: 'Standaard',
    description: 'Moderne en professionele uitstraling',
    headerBg: 'bg-primary',
    headerText: 'text-primary-foreground',
    bodyBg: 'bg-background',
    cardBg: 'bg-card',
    titleFont: 'font-serif',
    bodyFont: '',
    accentColor: 'text-primary',
    borderStyle: 'border border-border rounded-lg',
    priceStyle: 'bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm',
    categoryStyle: 'text-xl font-semibold text-foreground',
    itemSpacing: 'py-4',
  },
  simple: {
    name: 'Simpel',
    description: 'Eenvoudig en overzichtelijk',
    headerBg: 'bg-white border-b',
    headerText: 'text-stone-800',
    bodyBg: 'bg-white',
    cardBg: 'bg-white',
    titleFont: 'font-sans font-medium',
    bodyFont: 'font-sans text-stone-500 text-sm',
    accentColor: 'text-stone-700',
    borderStyle: '',
    priceStyle: 'text-stone-600',
    categoryStyle: 'text-lg font-medium text-stone-700 border-b border-stone-100 pb-1',
    itemSpacing: 'py-3',
  },
};

export const getTheme = (themeName: string | null | undefined): ThemeConfig => {
  if (themeName && themes[themeName as MenuTheme]) {
    return themes[themeName as MenuTheme];
  }
  return themes.default;
};
