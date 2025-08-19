import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function PreOrders() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) => products.filter(product => product.isPreOrder),
  });

  const upcomingReleases = products
    .filter(product => product.releaseDate)
    .sort((a, b) => new Date(a.releaseDate!).getTime() - new Date(b.releaseDate!).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-yellow-900/20 to-orange-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Pre-Orders
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Be the first to get your hands on the latest gaming gear. 
            Reserve your favorites before they hit the shelves.
          </p>
          <Badge className="bg-yellow-600 text-black px-4 py-2 text-lg" data-testid="preorder-badge">
            🚀 Early Access Available
          </Badge>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Releases Timeline */}
        {upcomingReleases.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-yellow-400" />
              Upcoming Releases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingReleases.map((product) => (
                <Card key={product.id} className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-yellow-600 text-black">
                        Coming Soon
                      </Badge>
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2" data-testid={`upcoming-product-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-semibold" data-testid={`upcoming-release-date-${product.id}`}>
                        {product.releaseDate ? 
                          new Date(product.releaseDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'TBA'
                        }
                      </span>
                      <span className="text-white font-bold" data-testid={`upcoming-price-${product.id}`}>
                        ${product.price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Pre-Order Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              All Pre-Orders
              <span className="text-gray-400 text-lg font-normal ml-2" data-testid="preorder-count">
                ({products.length} products)
              </span>
            </h2>
            <Link href="/">
              <Button variant="outline" data-testid="browse-all-products">
                Browse All Products
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16" data-testid="no-preorders">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">No pre-orders available</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Check back soon for exciting new products available for pre-order!
              </p>
              <Link href="/">
                <Button data-testid="shop-current-products">
                  Shop Current Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="preorder-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Pre-Order Info */}
        <section className="mt-16 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg p-8 border border-yellow-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Pre-Order Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
              <p className="text-gray-300">Be among the first to experience the latest gaming technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Exclusive Bonuses</h3>
              <p className="text-gray-300">Receive special pre-order bonuses and limited edition items</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Priority Shipping</h3>
              <p className="text-gray-300">Get your order shipped as soon as it becomes available</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
