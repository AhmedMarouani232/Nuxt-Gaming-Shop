// This file contains product categories and utility functions for the gaming e-commerce store
// The actual product data is seeded in server/storage.ts

export const PRODUCT_CATEGORIES = [
  "Gaming Mice",
  "Keyboards", 
  "Headsets",
  "Monitors",
  "Pre-built PCs",
  "Components",
  "Consoles",
  "Chairs",
  "Controllers",
  "Software",
  "PS5 Games",
  "PS4 Games"
] as const;

export const PRODUCT_BRANDS = [
  "Razer",
  "Corsair", 
  "SteelSeries",
  "ASUS",
  "NexTech",
  "SecretLab",
  "Sony",
  "Microsoft",
  "NVIDIA",
  "AMD",
  "Adobe",
  "Activision"
] as const;

export const PRODUCT_FEATURES = [
  "RGB Lighting",
  "Wireless",
  "Mechanical",
  "Ergonomic",
  "High-Res Audio",
  "Ray Tracing",
  "G-SYNC",
  "HDR10",
  "Retractable Mic",
  "Premium Drivers",
  "4-Way Lumbar",
  "Magnetic Cushions",
  "Cold-Cure Foam",
  "Haptic Feedback",
  "3D Audio",
  "Dual Character",
  "Open World",
  "DLSS 3",
  "AV1 Encoding",
  "Zen 4 Architecture",
  "5nm Process",
  "PCIe 5.0",
  "Textured Grips",
  "Hybrid D-pad",
  "All Adobe Apps",
  "Cloud Storage",
  "Regular Updates"
] as const;

export const COMPATIBILITY_PLATFORMS = [
  "PC",
  "Mac", 
  "PS5",
  "PS4",
  "Xbox",
  "Switch",
  "Console",
  "Universal"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductBrand = typeof PRODUCT_BRANDS[number];
export type ProductFeature = typeof PRODUCT_FEATURES[number];
export type CompatibilityPlatform = typeof COMPATIBILITY_PLATFORMS[number];

/**
 * Utility function to get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    "Gaming Mice": "Gaming Mice",
    "Keyboards": "Gaming Keyboards",
    "Headsets": "Gaming Headsets",
    "Monitors": "Gaming Monitors",
    "Pre-built PCs": "Gaming PCs",
    "Components": "PC Components",
    "Consoles": "Gaming Consoles",
    "Chairs": "Gaming Chairs",
    "Controllers": "Game Controllers",
    "Software": "Gaming Software",
    "PS5 Games": "PlayStation 5 Games",
    "PS4 Games": "PlayStation 4 Games"
  };
  
  return categoryMap[category] || category;
}

/**
 * Utility function to get platform icon/emoji
 */
export function getPlatformIcon(platform: string): string {
  const platformIcons: Record<string, string> = {
    "PC": "🖥️",
    "Mac": "🍎",
    "PS5": "🎮",
    "PS4": "🎮",
    "Xbox": "🎮",
    "Switch": "🎮",
    "Console": "🎮",
    "Universal": "🌐"
  };
  
  return platformIcons[platform] || "🎮";
}

/**
 * Utility function to determine if a product is on sale
 */
export function isProductOnSale(price: string, originalPrice?: string): boolean {
  if (!originalPrice) return false;
  return parseFloat(originalPrice) > parseFloat(price);
}

/**
 * Utility function to calculate discount percentage
 */
export function getDiscountPercentage(price: string, originalPrice: string): number {
  const current = parseFloat(price);
  const original = parseFloat(originalPrice);
  
  if (original <= current) return 0;
  
  return Math.round(((original - current) / original) * 100);
}

/**
 * Utility function to format price with currency
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toFixed(2)}`;
}

/**
 * Utility function to generate product URL slug
 */
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Categories grouped by type for better organization
 */
export const CATEGORY_GROUPS = {
  peripherals: ["Gaming Mice", "Keyboards", "Headsets", "Controllers"],
  hardware: ["Monitors", "Pre-built PCs", "Components", "Consoles"],
  accessories: ["Chairs", "Software"],
  games: ["PS5 Games", "PS4 Games"]
} as const;

/**
 * Get category group for a given category
 */
export function getCategoryGroup(category: string): keyof typeof CATEGORY_GROUPS | null {
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    if ((categories as readonly string[]).includes(category)) {
      return group as keyof typeof CATEGORY_GROUPS;
    }
  }
  return null;
}

/**
 * Filter configuration for the product filters component
 */
export const FILTER_CONFIG = {
  priceRange: {
    min: 0,
    max: 5000,
    step: 50
  },
  ratings: [5, 4, 3, 2, 1],
  sortOptions: [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest' }
  ]
} as const;
