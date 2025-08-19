import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/hero/hero-section";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <HeroSection />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 lg:min-w-80 lg:flex-shrink-0 mb-8 lg:mb-0">
            <ProductFilters />
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1 lg:min-w-0">
            <ProductGrid />
          </div>
        </div>
      </main>
      
      {/* Featured Sections */}
      <section className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gaming Console Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Gaming Consoles & Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* PS5 Games */}
              <div className="bg-slate-700 rounded-lg p-6 text-center hover:bg-slate-600 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="PlayStation 5" 
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h3 className="text-xl font-semibold text-white mb-2">PS5 Collection</h3>
                <p className="text-gray-300 mb-4">Latest PlayStation 5 games and accessories</p>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  onClick={() => window.location.href = "/?category=PS5 Games"}
                  data-testid="shop-ps5-button"
                >
                  Shop PS5
                </button>
              </div>

              {/* Xbox Series X */}
              <div className="bg-slate-700 rounded-lg p-6 text-center hover:bg-slate-600 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Xbox Series X" 
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h3 className="text-xl font-semibold text-white mb-2">Xbox Series X|S</h3>
                <p className="text-gray-300 mb-4">Next-gen Xbox games and Game Pass titles</p>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  onClick={() => window.location.href = "/?category=Consoles"}
                  data-testid="shop-xbox-button"
                >
                  Shop Xbox
                </button>
              </div>

              {/* Nintendo Switch */}
              <div className="bg-slate-700 rounded-lg p-6 text-center hover:bg-slate-600 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Nintendo Switch" 
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h3 className="text-xl font-semibold text-white mb-2">Nintendo Switch</h3>
                <p className="text-gray-300 mb-4">Portable gaming with exclusive Nintendo titles</p>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  onClick={() => window.location.href = "/?category=Consoles"}
                  data-testid="shop-switch-button"
                >
                  Shop Switch
                </button>
              </div>
            </div>
          </div>

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-8 border border-purple-500/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offers</h2>
              <p className="text-gray-300 mb-6">Don't miss out on these exclusive gaming deals</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Bundle Deal</h3>
                  <p className="text-gray-300 mb-4">Gaming mouse + keyboard + headset combo</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">$199.99</span>
                    <span className="text-gray-400 line-through">$299.99</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">Free Shipping</h3>
                  <p className="text-gray-300 mb-4">On all orders over $50 this weekend</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-cyan-400">Free</span>
                    <span className="text-gray-400 line-through">$9.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
