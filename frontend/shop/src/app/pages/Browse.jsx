import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { categories } from "../data/mockData";
import { getAllProducts } from "../lib/api";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export function Browse() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q");

  // Redirect to upload page if custom orders category is selected
  useEffect(() => {
    if (categoryParam === "custom") {
      navigate("/upload");
    }
  }, [categoryParam, navigate]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (queryParam) {
      const query = queryParam.toLowerCase();
      filtered = filtered.filter(
        p =>
          (p.name || "").toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by price
    filtered = filtered.filter(
      p => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return filtered;
  }, [products, queryParam, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filterPanel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="size-4 rounded border-gray-300 accent-black cursor-pointer"
              />
              <span className="text-sm">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={30000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>LKR {priceRange[0]}</span>
            <span>LKR {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 30000]);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl mb-2">
              {queryParam
                ? `Search results for "${queryParam}"`
                : "All Items"}
            </h1>
            <p className="text-gray-600">{filteredProducts.length} items found</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden">
                  <SlidersHorizontal className="size-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {filterPanel}
                </div>
              </SheetContent>
            </Sheet>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2 flex-1 sm:flex-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden sm:block w-64 flex-shrink-0">
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              {filterPanel}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No items found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 30000]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
