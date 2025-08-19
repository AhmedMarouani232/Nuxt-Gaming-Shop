import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./stores/auth-store";
import { useEffect } from "react";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Dashboard from "@/pages/dashboard";
import PreOrders from "@/pages/pre-orders";
import Deals from "@/pages/deals";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  
  const { data: authData } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (authData && typeof authData === 'object' && 'user' in authData) {
      setUser(authData.user as any);
    }
  }, [authData, setUser]);

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pre-orders" component={PreOrders} />
      <Route path="/deals" component={Deals} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
