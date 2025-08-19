import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Link } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X } from "lucide-react";

export function CartModal() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    setItems, 
    updateQuantity, 
    removeItem,
    getTotalPrice 
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items from server
  const { data: serverCartItems } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  // Sync server cart with local state
  useEffect(() => {
    if (serverCartItems && Array.isArray(serverCartItems)) {
      setItems(serverCartItems);
    }
  }, [serverCartItems, setItems]);

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

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (!isAuthenticated) {
    return (
      <Sheet open={isOpen} onOpenChange={closeCart}>
        <SheetContent className="bg-slate-800 border-slate-700 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-400 mb-4">Please log in to view your cart</p>
            <Link href="/login">
              <Button onClick={closeCart} data-testid="cart-login-button">
                Login
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="bg-slate-800 border-slate-700 text-white w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            Shopping Cart
            <Badge variant="secondary" data-testid="cart-item-count-modal">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-400 mb-4" data-testid="empty-cart-message">Your cart is empty</p>
            <Button onClick={closeCart} data-testid="continue-shopping-button">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-4 p-2 border border-slate-700 rounded"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img 
                    src={item.product.imageUrls[0]} 
                    alt={item.product.name}
                    className="w-16 h-12 object-cover rounded"
                    data-testid={`cart-item-image-${item.id}`}
                  />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium" data-testid={`cart-item-name-${item.id}`}>
                      {item.product.name}
                    </h4>
                    <p className="text-gray-400 text-xs" data-testid={`cart-item-price-${item.id}`}>
                      ${item.product.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={updateQuantityMutation.isPending}
                      className="h-8 w-8 p-0"
                      data-testid={`cart-decrease-${item.id}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-white w-8 text-center" data-testid={`cart-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updateQuantityMutation.isPending}
                      className="h-8 w-8 p-0"
                      data-testid={`cart-increase-${item.id}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeItemMutation.isPending}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      data-testid={`cart-remove-${item.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-slate-700 pt-4 space-y-2">
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
              <Separator className="bg-slate-700" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-white">Total:</span>
                <span className="text-white" data-testid="cart-total">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2 pt-4">
                <Link href="/checkout">
                  <Button 
                    className="w-full" 
                    onClick={closeCart}
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={closeCart}
                  data-testid="continue-shopping-button-cart"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
