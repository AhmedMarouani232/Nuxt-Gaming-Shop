import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/stores/filter-store";
import { Filter } from "lucide-react";

const categories = [
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
];

const brands = [
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
];

const features = [
  "RGB Lighting",
  "Wireless",
  "Mechanical",
  "Ergonomic",
  "High-Res Audio",
  "Ray Tracing",
  "G-SYNC",
  "HDR10"
];

export function ProductFilters() {
  const {
    searchQuery,
    priceRange,
    selectedCategories,
    selectedBrands,
    availability,
    minRating,
    showDealsOnly,
    selectedFeatures,
    setSearchQuery,
    setPriceRange,
    toggleCategory,
    toggleBrand,
    setAvailability,
    setMinRating,
    setShowDealsOnly,
    toggleFeature,
    clearFilters,
  } = useFilterStore();

  return (
    <Card className="bg-slate-800/95 backdrop-blur-md border-slate-700 sticky top-24">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-400" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div>
          <Label className="text-gray-300 mb-2">Search Products</Label>
          <Input
            type="text"
            placeholder="Product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white focus:ring-blue-500"
            data-testid="filter-search"
          />
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-gray-300 mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}+
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={5000}
            step={50}
            className="mt-2"
            data-testid="filter-price-range"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Label className="text-gray-300 mb-2">Category</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  data-testid={`filter-category-${category.toLowerCase().replace(' ', '-')}`}
                />
                <Label 
                  htmlFor={`category-${category}`} 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <Label className="text-gray-300 mb-2">Brand</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                  data-testid={`filter-brand-${brand.toLowerCase()}`}
                />
                <Label 
                  htmlFor={`brand-${brand}`} 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="text-gray-300 mb-2">Availability</Label>
          <RadioGroup value={availability} onValueChange={(value: any) => setAvailability(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" data-testid="filter-availability-all" />
              <Label htmlFor="all" className="text-sm text-gray-300">All Products</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inStock" id="inStock" data-testid="filter-availability-instock" />
              <Label htmlFor="inStock" className="text-sm text-gray-300">In Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preOrder" id="preOrder" data-testid="filter-availability-preorder" />
              <Label htmlFor="preOrder" className="text-sm text-gray-300">Pre-Order</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-gray-300 mb-2">Minimum Rating</Label>
          <RadioGroup value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} data-testid={`filter-rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="text-sm text-gray-300 flex items-center">
                  <span className="text-yellow-400">
                    {"★".repeat(rating)}{"☆".repeat(5-rating)}
                  </span>
                  <span className="ml-1">{rating}+ Stars</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Deals Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deals-only"
            checked={showDealsOnly}
            onCheckedChange={(checked) => setShowDealsOnly(checked as boolean)}
            data-testid="filter-deals-only"
          />
          <Label htmlFor="deals-only" className="text-sm text-gray-300">
            Show Deals Only
          </Label>
        </div>

        {/* Features */}
        <div>
          <Label className="text-gray-300 mb-2">Features</Label>
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                  data-testid={`filter-feature-${feature.toLowerCase().replace(' ', '-')}`}
                />
                <Label 
                  htmlFor={`feature-${feature}`} 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
