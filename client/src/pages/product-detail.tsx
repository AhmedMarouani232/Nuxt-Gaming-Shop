import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Product } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product/product-card";
import { useAuthStore } from "@/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) => {
      if (!product) return [];
      return products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 3);
    },
    enabled: !!product,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cart", {
        productId: id,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars 
                ? "fill-yellow-400 text-yellow-400" 
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-gray-400">
          {ratingNum} ({product.reviewCount} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imageUrls[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                data-testid="product-main-image"
              />
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.isPreOrder && (
                <Badge className="bg-yellow-500 text-black absolute top-4 right-4">
                  PRE-ORDER
                </Badge>
              )}
            </div>
            
            {product.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    className={`h-20 w-20 object-cover rounded cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-blue-500' 
                        : 'hover:opacity-80'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    data-testid={`product-thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-gray-400">
                  {product.brand}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4" data-testid="product-title">
                {product.name}
              </h1>
              <div className="mb-4">
                {renderStars(product.rating)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-white" data-testid="product-price">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through" data-testid="product-original-price">
                  ${product.originalPrice}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">
                  Save {discountPercentage}%
                </Badge>
              )}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed" data-testid="product-description">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <Badge className="bg-green-600">
                  ✓ In Stock ({product.stockQuantity} available)
                </Badge>
              ) : product.isPreOrder ? (
                <Badge className="bg-yellow-600">
                  Pre-Order Available
                  {product.releaseDate && (
                    <span className="ml-2">
                      (Release: {new Date(product.releaseDate).toLocaleDateString()})
                    </span>
                  )}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {(product.inStock || product.isPreOrder) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-gray-300">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0"
                      data-testid="decrease-quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-medium" data-testid="quantity-display">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                      className="h-10 w-10 p-0"
                      data-testid="increase-quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className={`flex-1 ${
                      product.isPreOrder 
                        ? "bg-yellow-600 hover:bg-yellow-700" 
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {addToCartMutation.isPending 
                      ? "Adding..." 
                      : product.isPreOrder 
                        ? "Pre-Order Now" 
                        : "Add to Cart"
                    }
                  </Button>
                  <Button variant="outline" size="lg" className="px-6" data-testid="wishlist-button">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-blue-400 border-blue-400">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility */}
            {product.compatibility.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        {Object.keys(product.specifications).length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-16">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
