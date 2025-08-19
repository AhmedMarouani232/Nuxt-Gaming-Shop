import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
              NexTech
            </h3>
            <p className="text-gray-400 mb-4">
              Your premier destination for gaming accessories, custom PCs, and the latest technology.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2" data-testid="social-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-home">
                    Gaming PCs
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-accessories">
                    Accessories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pre-orders">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-preorders">
                    Pre-Orders
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/deals">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-deals">
                    Deals
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-contact">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-support">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-returns">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-warranty">
                  Warranty
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-shipping">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-track">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Get the latest deals and product launches</p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-slate-700 border-slate-600 rounded-r-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-newsletter-email"
              />
              <Button className="rounded-l-none" data-testid="button-newsletter-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 NexTech. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
