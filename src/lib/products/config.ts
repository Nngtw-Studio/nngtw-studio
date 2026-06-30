/** Future products architecture — not exposed in navigation until populated */
export const PRODUCT_CATEGORIES = {
  games: { label: "Games", enabled: false },
  applications: { label: "Applications", enabled: false },
  "digital-assets": { label: "Digital Assets", enabled: false },
  "developer-tools": { label: "Developer Tools", enabled: false },
  merchandise: { label: "Merchandise", enabled: false },
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;

export function getEnabledProductCategories() {
  return Object.entries(PRODUCT_CATEGORIES)
    .filter(([, config]) => config.enabled)
    .map(([key, config]) => ({ slug: key as ProductCategory, ...config }));
}

/** Route exists but returns 404 until category is enabled */
export function isProductCategoryEnabled(category: string): boolean {
  return category in PRODUCT_CATEGORIES &&
    PRODUCT_CATEGORIES[category as ProductCategory].enabled;
}
