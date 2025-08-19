import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { CartModal } from "@/components/cart/cart-modal";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useFilterStore } from "@/stores/filter-store";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalItems, openCart } = useCartStore();
  const { searchQuery, setSearchQuery } = useFilterStore();

  const totalItems = getTotalItems();

  const navLinks = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/deals", label: "Deals", active: location === "/deals" },
    { href: "/pre-orders", label: "Pre-Orders", active: location === "/pre-orders" },
    { href: "/contact", label: "Contact", active: location === "/contact" },
  ];

  return (
    <>
      <nav className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent cursor-pointer" data-testid="logo-nextech">
                  NexTech
                </h1>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        link.active 
                          ? "text-white bg-slate-700" 
                          : "text-gray-300 hover:text-blue-400"
                      }`} data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}>
                        {link.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            {location === "/" && (
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search gaming gear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 pl-10 focus:ring-2 focus:ring-blue-500"
                    data-testid="search-input"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openCart}
                className="relative text-gray-300 hover:text-white"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="cart-item-count"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-300 hover:text-white"
                    data-testid="button-dashboard"
                  >
                    <User className="h-6 w-6" />
                    <span className="ml-2 hidden sm:inline">
                      {user?.firstName || user?.username}
                    </span>
                  </Button>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" data-testid="button-login">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" data-testid="button-signup">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        link.active 
                          ? "text-white bg-slate-700" 
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-4 pb-3 border-t border-slate-700">
                    <div className="flex items-center px-5 space-x-3">
                      <Link href="/login">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid="mobile-button-login"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button 
                          className="w-full" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid="mobile-button-signup"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <CartModal />
    </>
  );
}
