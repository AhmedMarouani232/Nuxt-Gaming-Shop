import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Flame, Gift, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function Deals() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) => products.filter(product => 
      product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
    ),
  });

  const topDeals = products
    .map(product => ({
      ...product,
      discountPercentage: Math.round(
        ((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100
      )
    }))
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 3);

  const dealCategories = [
    {
      title: "Gaming Peripherals",
      description: "Mice, keyboards, and headsets",
      products: products.filter(p => ['Gaming Mice', 'Keyboards', 'Headsets'].includes(p.category)),
      icon: "🎮"
    },
    {
      title: "Components & PCs",
      description: "Graphics cards and pre-built systems",
      products: products.filter(p => ['Components', 'Pre-built PCs'].includes(p.category)),
      icon: "💻"
    },
    {
      title: "Games & Software",
      description: "Latest games and applications",
      products: products.filter(p => ['PS5 Games', 'PS4 Games', 'Software'].includes(p.category)),
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900/20 to-orange-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Gaming Deals
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Incredible savings on premium gaming gear. Limited time offers on the latest
            technology and accessories.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-red-600 px-4 py-2 text-lg animate-pulse" data-testid="deal-badge">
              🔥 Up to 40% OFF
            </Badge>
            <Badge className="bg-orange-600 px-4 py-2 text-lg" data-testid="shipping-badge">
              📦 Free Shipping $50+
            </Badge>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Deals Spotlight */}
        {topDeals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Flame className="h-8 w-8 mr-3 text-red-400" />
              Hottest Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDeals.map((product) => (
                <Card key={product.id} className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-bold">
                    -{product.discountPercentage}%
                  </div>
                  <CardContent className="p-6">
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2" data-testid={`hot-deal-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white" data-testid={`hot-deal-price-${product.id}`}>
                          ${product.price}
                        </span>
                        <span className="text-gray-400 line-through ml-2" data-testid={`hot-deal-original-${product.id}`}>
                          ${product.originalPrice}
                        </span>
                      </div>
                      <Badge className="bg-red-600">
                        Save ${(parseFloat(product.originalPrice!) - parseFloat(product.price)).toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Deal Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <Gift className="h-8 w-8 mr-3 text-orange-400" />
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dealCategories.map((category) => (
              <Card key={category.title} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 mb-4">{category.description}</p>
                  <Badge variant="outline" className="text-orange-400 border-orange-400 mb-4">
                    {category.products.length} deals available
                  </Badge>
                  <div className="mt-4">
                    {category.products.length > 0 ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          // Filter products by category on home page
                          window.location.href = `/?category=${encodeURIComponent(category.products[0].category)}`;
                        }}
                        data-testid={`browse-category-${category.title.toLowerCase().replace(' ', '-')}`}
                      >
                        Browse Deals
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        No Deals Available
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Deals */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingDown className="h-8 w-8 mr-3 text-green-400" />
              All Deals
              <span className="text-gray-400 text-lg font-normal ml-2" data-testid="deals-count">
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
            <div className="text-center py-16" data-testid="no-deals">
              <Percent className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">No deals available</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Check back soon for amazing deals on gaming gear and accessories!
              </p>
              <Link href="/">
                <Button data-testid="shop-all-products">
                  Shop All Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="deals-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Deal Newsletter */}
        <section className="mt-16 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-lg p-8 border border-red-500/30">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Never Miss a Deal</h2>
            <p className="text-gray-300 mb-6">Subscribe to get exclusive deals and early access to sales</p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-l-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                data-testid="deal-newsletter-email"
              />
              <Button className="bg-red-600 hover:bg-red-700 rounded-l-none" data-testid="deal-newsletter-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
