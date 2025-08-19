import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, Minus, Plus, X, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import type { CartItem, Product } from "@shared/schema";

export default function Cart() {
  const { isAuthenticated } = useAuthStore();
  const { setItems, updateQuantity, removeItem } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<Array<CartItem & { product: Product }>>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cartItems) {
      setItems(cartItems);
    }
  }, [cartItems, setItems]);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    updateQuantity(id, newQuantity);
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    removeItemMutation.mutate(id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your cart</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to manage your shopping cart.</p>
              <Link href="/login">
                <Button data-testid="login-to-view-cart">
                  Login to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((total, item) => 
    total + (parseFloat(item.product.price) * item.quantity), 0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4">
                          <div className="h-20 w-20 bg-slate-700 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-cart">
                    <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 mb-6">Add some gaming gear to get started!</p>
                    <Link href="/">
                      <Button data-testid="start-shopping-button">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-4 p-4 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors"
                        data-testid={`cart-item-${item.id}`}
                      >
                        <Link href={`/products/${item.product.id}`}>
                          <img 
                            src={item.product.imageUrls[0]} 
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            data-testid={`cart-item-image-${item.id}`}
                          />
                        </Link>
                        
                        <div className="flex-1">
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="text-white font-medium hover:text-blue-400 transition-colors cursor-pointer" data-testid={`cart-item-name-${item.id}`}>
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-400 text-sm">{item.product.brand}</p>
                          <p className="text-white font-semibold" data-testid={`cart-item-price-${item.id}`}>
                            ${item.product.price}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending}
                            className="h-8 w-8 p-0"
                            data-testid={`decrease-quantity-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-white w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateQuantityMutation.isPending}
                            className="h-8 w-8 p-0"
                            data-testid={`increase-quantity-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-semibold" data-testid={`item-total-${item.id}`}>
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isPending}
                            className="text-red-400 hover:text-red-300 mt-1"
                            data-testid={`remove-item-${item.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white" data-testid="cart-subtotal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white" data-testid="cart-tax">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white" data-testid="cart-shipping">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">
                      Free shipping on orders over $50
                    </p>
                  )}
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-white" data-testid="cart-total">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Link href="/checkout">
                      <Button className="w-full" size="lg" data-testid="proceed-to-checkout">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full" data-testid="continue-shopping">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
