// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: "Basis",
    productIds: ["prod_TY8YjSp56UfCvH", "prod_TY8YRqbGHQQEL0"],
    features: [
      "Onbeperkt menu's aanmaken",
      "QR-codes genereren",
      "Meerdere templates",
      "Real-time aanpassingen",
      "Onbeperkt categorieën",
      "Afbeeldingen uploaden",
    ],
  },
  pro: {
    name: "Pro",
    productIds: ["prod_TY9h8WNr3r36TZ", "prod_TY9iuwNnHskHUB"],
    features: [
      "Alles van Basis",
      "Meertalige menu's (NL, EN, DE, FR)",
      "Vertalingen beheren",
      "Taalkeuzeschakelaar voor gasten",
    ],
  },
  ordering: {
    name: "Bestellen",
    productIds: ["prod_TYAfzP0Dw0QUCD"],
    features: [
      "Alles van Basis & Pro",
      "Meertalige menu's (NL, EN, DE, FR)",
      "Online bestellingen ontvangen",
      "Afhalen & bezorging",
      "Bestellingendashboard",
      "Betaling met iDEAL, contant of pin",
      "Bereidingstijden instellen",
      "Bestelstatus beheren",
    ],
  },
} as const;

export const PLANS = {
  basic_monthly: {
    tier: "basic" as const,
    name: "Basis Maandelijks",
    price: 9,
    priceId: "price_1Sb2GyLmpOLDgj0k9mSaNNtE",
    productId: "prod_TY8YjSp56UfCvH",
    interval: "maand",
    description: "Flexibel en maandelijks opzegbaar",
  },
  basic_yearly: {
    tier: "basic" as const,
    name: "Basis Jaarlijks",
    price: 95,
    priceId: "price_1Sb2HKLmpOLDgj0kedsYM3Pe",
    productId: "prod_TY8YRqbGHQQEL0",
    interval: "jaar",
    description: "Bespaar 12%",
    savings: "Bespaar €13",
  },
  pro_monthly: {
    tier: "pro" as const,
    name: "Pro Maandelijks",
    price: 14.95,
    priceId: "price_1Sb3ONLmpOLDgj0kTNKRYjNy",
    productId: "prod_TY9h8WNr3r36TZ",
    interval: "maand",
    description: "Inclusief meertalige menu's",
  },
  pro_yearly: {
    tier: "pro" as const,
    name: "Pro Jaarlijks",
    price: 149,
    priceId: "price_1Sb3OkLmpOLDgj0knvpeq4Rk",
    productId: "prod_TY9iuwNnHskHUB",
    interval: "jaar",
    description: "Bespaar 17%",
    savings: "Bespaar €30",
  },
  ordering_monthly: {
    tier: "ordering" as const,
    name: "Bestellen Maandelijks",
    price: 29.50,
    priceId: "price_1Sb4JmLmpOLDgj0kJJo4LAHj",
    productId: "prod_TYAfzP0Dw0QUCD",
    interval: "maand",
    description: "Extra module voor online bestellingen",
    isAddon: true,
  },
};

export const SUPPORTED_LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"];
export type SubscriptionTier = "basic" | "pro" | "ordering" | null;

export function getTierFromProductId(productId: string | null): SubscriptionTier {
  if (!productId) return null;
  if (SUBSCRIPTION_TIERS.ordering.productIds.includes(productId as any)) return "ordering";
  if (SUBSCRIPTION_TIERS.pro.productIds.includes(productId as any)) return "pro";
  if (SUBSCRIPTION_TIERS.basic.productIds.includes(productId as any)) return "basic";
  return null;
}

export function hasOrderingSubscription(productIds: string[]): boolean {
  return productIds.some(id => SUBSCRIPTION_TIERS.ordering.productIds.includes(id as any));
}
