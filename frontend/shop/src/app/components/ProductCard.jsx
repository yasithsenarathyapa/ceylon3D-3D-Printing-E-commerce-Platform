import { Link } from "react-router";
import { Star, TruckIcon } from "lucide-react";
import { Card } from "./ui/card";
import { categories } from "../data/mockData";
import { API_ROOT_URL } from "../lib/config";

function getImageUrl(product) {
  // Support both mock data (product.image) and API data (product.imagePath)
  const src = product.image || product.imagePath;
  if (!src) return null;
  // If it starts with /api, prefix with backend URL
  if (src.startsWith("/api")) {
    return `${API_ROOT_URL}${src}`;
  }
  return src;
}

export function ProductCard({ product }) {
  const title = product.title || product.name || "Untitled";
  const imageUrl = getImageUrl(product);
  const categoryInfo = categories.find(c => c.id === product.category);

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>
        <div className="p-4">
          {categoryInfo && (
            <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 mb-2">
              {categoryInfo.icon} {categoryInfo.name}
            </span>
          )}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {title}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
              {product.reviews != null && <span className="text-sm text-gray-500">({product.reviews})</span>}
            </div>
          )}
          <p className="text-xl font-semibold mb-2">LKR {Number(product.price).toFixed(2)}</p>
          {product.shipping === "Free shipping" && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TruckIcon className="size-4" />
              <span>Free shipping</span>
            </div>
          )}
          {product.stock != null && product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
