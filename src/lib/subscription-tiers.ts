// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Gratis",
    productIds: [] as string[],
    features: [
      "1 restaurant",
      "1 menukaart",
      "1 taal (Nederlands)",
      "QR-code genereren",
      "Real-time aanpassingen",
      "Onbeperkt categorieën & gerechten",
    ],
  },
  pro: {
    name: "Pro",
    productIds: ["prod_TY9h8WNr3r36TZ", "prod_TY9iuwNnHskHUB"],
    features: [
      "Onbeperkt restaurants",
      "Onbeperkt menukaarten",
      "4 talen (NL, EN, DE, FR)",
      "Vertalingen beheren",
      "Taalkeuzeschakelaar voor gasten",
      "QR-codes genereren",
      "Afbeeldingen uploaden",
    ],
  },
  ordering: {
    name: "Bestellen",
    productIds: ["prod_TYAfzP0Dw0QUCD"],
    features: [
      "Alles van Pro",
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
  pro_yearly: {
    tier: "pro" as const,
    name: "Pro Jaarlijks",
    price: 150,
    priceId: "price_1Sb3OkLmpOLDgj0knvpeq4Rk",
    productId: "prod_TY9iuwNnHskHUB",
    interval: "jaar",
    description: "4 talen, onbeperkt restaurants & menu's",
  },
  ordering_yearly: {
    tier: "ordering" as const,
    name: "Bestellen Jaarlijks",
    price: 450,
    priceId: "price_1Sb4JmLmpOLDgj0kJJo4LAHj",
    productId: "prod_TYAfzP0Dw0QUCD",
    interval: "jaar",
    description: "Alles van Pro + online bestellingen",
  },
};

export const SUPPORTED_LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"];
export type SubscriptionTier = "free" | "pro" | "ordering" | null;

export function getTierFromProductId(productId: string | null): SubscriptionTier {
  if (!productId) return "free";
  if (SUBSCRIPTION_TIERS.ordering.productIds.includes(productId as any)) return "ordering";
  if (SUBSCRIPTION_TIERS.pro.productIds.includes(productId as any)) return "pro";
  return "free";
}

export function hasOrderingSubscription(productIds: string[]): boolean {
  return productIds.some(id => SUBSCRIPTION_TIERS.ordering.productIds.includes(id as any));
}
