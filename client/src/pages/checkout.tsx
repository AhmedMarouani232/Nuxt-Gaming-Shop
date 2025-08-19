import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CreditCard, Shield, Truck } from "lucide-react";
import type { CartItem, Product } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('VITE_STRIPE_PUBLIC_KEY not found. Payment functionality will be limited.');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ total, cartItems }: { total: number; cartItems: Array<CartItem & { product: Product }> }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { clearCart } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Payment succeeded, create the order
      const subtotal = cartItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      );
      const tax = subtotal * 0.08;
      const shipping = subtotal > 50 ? 0 : 9.99;
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        status: 'processing',
      };

      createOrderMutation.mutate(orderData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-700 p-4 rounded-lg">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </h3>
        <PaymentElement />
      </div>
      
      <Button 
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || createOrderMutation.isPending}
        data-testid="complete-payment-button"
      >
        {createOrderMutation.isPending ? "Processing..." : `Complete Payment - $${total.toFixed(2)}`}
      </Button>
      
      <div className="flex items-center justify-center text-sm text-gray-400">
        <Shield className="h-4 w-4 mr-2" />
        Your payment information is secure and encrypted
      </div>
    </form>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<Array<CartItem & { product: Product }>>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const subtotal = cartItems.reduce((total, item) => 
    total + (parseFloat(item.product.price) * item.quantity), 0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (cartItems.length === 0 && !isLoading) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      setLocation("/cart");
      return;
    }

    if (cartItems.length > 0) {
      // Create PaymentIntent as soon as we have cart items
      apiRequest("POST", "/api/create-payment-intent", { amount: total })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error(data.message || "Failed to initialize payment");
          }
        })
        .catch((error) => {
          toast({
            title: "Payment initialization failed",
            description: error.message || "Unable to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated, cartItems, total, isLoading, setLocation, toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-gray-400 mb-6">Please log in to proceed with checkout.</p>
              <Link href="/login">
                <Button data-testid="login-to-checkout">
                  Login to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded mb-8 w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-64 bg-slate-700 rounded"></div>
                <div className="h-32 bg-slate-700 rounded"></div>
              </div>
              <div className="h-96 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some gaming gear to your cart before checking out.</p>
              <Link href="/">
                <Button data-testid="continue-shopping-checkout">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret && stripePromise) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
          </div>
        </div>
      </div>
    );
  }

  const CheckoutContent = () => (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center space-x-4"
                      data-testid={`checkout-item-${item.id}`}
                    >
                      <img 
                        src={item.product.imageUrls[0]} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium" data-testid={`checkout-item-name-${item.id}`}>
                          {item.product.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold" data-testid={`checkout-item-total-${item.id}`}>
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-slate-700 my-6" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white" data-testid="checkout-subtotal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white" data-testid="checkout-tax">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white" data-testid="checkout-shipping">
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
                    <span className="text-white" data-testid="checkout-total">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Standard shipping: 3-5 business days</p>
                  <p>• Express shipping: 1-2 business days (additional fee)</p>
                  <p>• Free shipping on orders over $50</p>
                  <p>• Order tracking available after shipment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {!stripePromise ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Payment Configuration Required</h3>
                    <p className="text-gray-400 mb-6">
                      Payment processing is not configured. Please contact support to complete your purchase.
                    </p>
                    <div className="space-y-4">
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        VITE_STRIPE_PUBLIC_KEY required
                      </Badge>
                      <div>
                        <Button variant="outline" data-testid="contact-support">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm total={total} cartItems={cartItems} />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-400">Initializing payment...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );

  return <CheckoutContent />;
}
