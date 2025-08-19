import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Gaming-themed background with multiple gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-purple-500/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-5 duration-700">
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Next-Gen Gaming
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Starts Here
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 animate-in slide-in-from-bottom-5 duration-700 delay-100">
          Discover premium gaming accessories, custom PCs, and the latest releases. 
          <br className="hidden sm:block" />
          Elevate your gaming experience with NexTech.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in slide-in-from-bottom-5 duration-700 delay-200">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 font-semibold transition-all transform hover:scale-105"
            onClick={() => setLocation("/?category=Pre-built PCs")}
            data-testid="button-shop-gaming-pcs"
          >
            Shop Gaming PCs
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 font-semibold transition-all transform hover:scale-105"
            onClick={() => setLocation("/?category=Gaming Mice")}
            data-testid="button-view-accessories"
          >
            View Accessories
          </Button>
        </div>

        {/* Featured promotion banner */}
        <div className="mt-12 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-700 delay-300">
          <p className="text-red-300 font-semibold" data-testid="promotion-banner">
            🔥 BLACK FRIDAY SALE: Up to 40% off gaming peripherals + FREE shipping!
          </p>
        </div>
      </div>
    </section>
  );
}
