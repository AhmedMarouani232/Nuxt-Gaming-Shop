import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Package, Settings, LogOut, ArrowLeft } from "lucide-react";
import type { Order } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Please log in to access your dashboard</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to view your account information.</p>
              <Link href="/login">
                <Button data-testid="login-to-dashboard">
                  Login to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'processing':
        return 'bg-blue-600';
      case 'shipped':
        return 'bg-purple-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-white font-medium" data-testid="user-name">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username
                    }
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white font-medium" data-testid="user-email">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Username</label>
                  <p className="text-white font-medium" data-testid="user-username">
                    {user?.username}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Member Since</label>
                  <p className="text-white font-medium" data-testid="user-member-since">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" data-testid="manage-account">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    data-testid="logout-button"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="h-6 w-6 mr-2" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-slate-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-orders">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
                    <Link href="/">
                      <Button data-testid="start-shopping-dashboard">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="p-4 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors"
                        data-testid={`order-${order.id}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium" data-testid={`order-id-${order.id}`}>
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h4>
                            <p className="text-gray-400 text-sm" data-testid={`order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)} data-testid={`order-status-${order.id}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-white font-semibold mt-1" data-testid={`order-total-${order.id}`}>
                              ${order.total}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {order.items.slice(0, 3).map((item, index) => (
                              <span key={index} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                                {item.productName} (x{item.quantity})
                              </span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                                +{order.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                          <div className="text-sm text-gray-400">
                            <span>Subtotal: ${order.subtotal}</span>
                            <span className="mx-2">•</span>
                            <span>Tax: ${order.tax}</span>
                            <span className="mx-2">•</span>
                            <span>Shipping: ${order.shipping}</span>
                          </div>
                          <Button variant="outline" size="sm" data-testid={`view-order-${order.id}`}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
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
}
