import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
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

    addToCartMutation.mutate(product.id);
  };

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
            className={`h-4 w-4 ${
              i < fullStars 
                ? "fill-yellow-400 text-yellow-400" 
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            data-testid={`product-image-${product.id}`}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs font-semibold" data-testid={`product-sale-badge-${product.id}`}>
              SALE
            </Badge>
          )}
          {product.isPreOrder && (
            <Badge className="bg-yellow-500 text-black text-xs font-semibold" data-testid={`product-preorder-badge-${product.id}`}>
              PRE-ORDER
            </Badge>
          )}
          {!product.inStock && !product.isPreOrder && (
            <Badge variant="secondary" className="text-xs font-semibold" data-testid={`product-outofstock-badge-${product.id}`}>
              OUT OF STOCK
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          {renderStars(product.rating || "0")}
          <span className="text-gray-400 text-sm ml-2" data-testid={`product-reviews-${product.id}`}>
            ({product.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white" data-testid={`product-price-${product.id}`}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through" data-testid={`product-original-price-${product.id}`}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || (!product.inStock && !product.isPreOrder)}
            className={`transition-colors ${
              product.isPreOrder 
                ? "bg-yellow-600 hover:bg-yellow-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {addToCartMutation.isPending 
              ? "Adding..." 
              : product.isPreOrder 
                ? "Pre-Order" 
                : "Add to Cart"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
