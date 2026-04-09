import { Outlet, Link, useNavigate } from "react-router";
import { Search, ShoppingCart, User, Menu, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function Layout() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const authUserRaw = localStorage.getItem("authUser");
  let isAdmin = false;
  if (authUserRaw) {
    try {
      isAdmin = Boolean(JSON.parse(authUserRaw)?.roles?.includes("ROLE_ADMIN"));
    } catch {
      isAdmin = false;
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (<div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Package className="size-8 text-blue-600" />
              <span className="text-xl font-semibold">Ceylon<span className="text-blue-600"> 3D</span></span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden md:flex">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for 3D printed items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="size-5 text-gray-400" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="size-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="pb-4 md:hidden">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for 3D printed items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="size-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="border-t py-3 overflow-x-auto">
            <div className="flex gap-6 text-sm">
              <a href="http://localhost:3000/" className="hover:text-blue-600 whitespace-nowrap">
                Back to Ceylon 3D
              </a>
              <Link to="/browse" className="hover:text-blue-600 whitespace-nowrap">
                All Items
              </Link>
              <Link to="/browse?category=miniatures" className="hover:text-blue-600 whitespace-nowrap">
                Miniatures
              </Link>
              <Link to="/browse?category=prototypes" className="hover:text-blue-600 whitespace-nowrap">
                Prototypes
              </Link>
              <Link to="/browse?category=art" className="hover:text-blue-600 whitespace-nowrap">
                Art & Decor
              </Link>
              <Link to="/browse?category=functional" className="hover:text-blue-600 whitespace-nowrap">
                Functional Parts
              </Link>
              <Link to="/browse?category=custom" className="hover:text-blue-600 whitespace-nowrap">
                Custom Orders
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="size-6 text-blue-500" />
                <span className="text-lg font-semibold text-white">PrintBay</span>
              </div>
              <p className="text-sm">Your marketplace for custom 3D printed items. Quality prints from trusted sellers worldwide.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/browse" className="hover:text-white">Browse All</Link></li>
                <li><Link to="/browse?category=miniatures" className="hover:text-white">Miniatures</Link></li>
                <li><Link to="/browse?category=prototypes" className="hover:text-white">Prototypes</Link></li>
                <li><Link to="/browse?category=art" className="hover:text-white">Art & Decor</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Sell</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Start Selling</a></li>
                <li><a href="#" className="hover:text-white">Seller Guide</a></li>
                <li><a href="#" className="hover:text-white">Fees & Pricing</a></li>
                <li><a href="#" className="hover:text-white">Seller Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Buyer Protection</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2026 PrintBay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
