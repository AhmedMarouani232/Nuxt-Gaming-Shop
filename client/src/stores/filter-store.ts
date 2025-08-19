import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  selectedCategories: string[];
  selectedBrands: string[];
  availability: 'all' | 'inStock' | 'preOrder';
  minRating: number;
  showDealsOnly: boolean;
  selectedFeatures: string[];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  setAvailability: (availability: 'all' | 'inStock' | 'preOrder') => void;
  setMinRating: (rating: number) => void;
  setShowDealsOnly: (show: boolean) => void;
  toggleFeature: (feature: string) => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  searchQuery: '',
  priceRange: [0, 5000],
  selectedCategories: [],
  selectedBrands: [],
  availability: 'all',
  minRating: 0,
  showDealsOnly: false,
  selectedFeatures: [],
  sortBy: 'featured',
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriceRange: (range) => set({ priceRange: range }),
  toggleCategory: (category) => {
    const categories = get().selectedCategories;
    const isSelected = categories.includes(category);
    set({
      selectedCategories: isSelected
        ? categories.filter(c => c !== category)
        : [...categories, category]
    });
  },
  toggleBrand: (brand) => {
    const brands = get().selectedBrands;
    const isSelected = brands.includes(brand);
    set({
      selectedBrands: isSelected
        ? brands.filter(b => b !== brand)
        : [...brands, brand]
    });
  },
  setAvailability: (availability) => set({ availability }),
  setMinRating: (rating) => set({ minRating: rating }),
  setShowDealsOnly: (show) => set({ showDealsOnly: show }),
  toggleFeature: (feature) => {
    const features = get().selectedFeatures;
    const isSelected = features.includes(feature);
    set({
      selectedFeatures: isSelected
        ? features.filter(f => f !== feature)
        : [...features, feature]
    });
  },
  setSortBy: (sort) => set({ sortBy: sort }),
  clearFilters: () => set({
    searchQuery: '',
    priceRange: [0, 5000],
    selectedCategories: [],
    selectedBrands: [],
    availability: 'all',
    minRating: 0,
    showDealsOnly: false,
    selectedFeatures: [],
    sortBy: 'featured',
  }),
}));
