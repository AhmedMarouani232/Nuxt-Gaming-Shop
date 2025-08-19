import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { useFilterStore } from "@/stores/filter-store";
import { useMemo } from "react";
import type { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductGrid() {
  const { 
    searchQuery, 
    priceRange, 
    selectedCategories, 
    selectedBrands, 
    availability, 
    minRating, 
    showDealsOnly,
    selectedFeatures,
    sortBy,
    setSortBy 
  } = useFilterStore();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    // Availability filter
    if (availability === 'inStock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (availability === 'preOrder') {
      filtered = filtered.filter(product => product.isPreOrder);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => 
        parseFloat(product.rating) >= minRating
      );
    }

    // Deals only filter
    if (showDealsOnly) {
      filtered = filtered.filter(product => 
        product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
      );
    }

    // Features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product =>
        selectedFeatures.some(feature => 
          product.features.includes(feature)
        )
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, priceRange, selectedCategories, selectedBrands, availability, minRating, showDealsOnly, selectedFeatures, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort and Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">
          Gaming Products{" "}
          <span className="text-gray-400 text-sm font-normal" data-testid="product-count">
            ({filteredProducts.length} results)
          </span>
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-300">Sort by:</label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white" data-testid="sort-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured" data-testid="sort-featured">Featured</SelectItem>
              <SelectItem value="price-low" data-testid="sort-price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high" data-testid="sort-price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating" data-testid="sort-rating">Customer Rating</SelectItem>
              <SelectItem value="newest" data-testid="sort-newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12" data-testid="no-products-message">
          <p className="text-gray-400 text-lg">No products found matching your filters.</p>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
