import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { TruckIcon, Shield, Package, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { API_BASE_URL, API_ROOT_URL } from "../lib/config";

function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("/api")) {
    return `${API_ROOT_URL}${imagePath}`;
  }
  return imagePath;
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link to="/browse">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.imagePath);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        title: product.name,
        price: Number(product.price),
        image: imageUrl,
        seller: "Ceylon3D",
      });
    } catch {
      // error toast is shown by CartContext
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart({
        id: product.id,
        title: product.name,
        price: Number(product.price),
        image: imageUrl,
        seller: "Ceylon3D",
      });
      navigate("/cart");
    } catch {
      // error toast is shown by CartContext
    }
  };

  return (<div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/browse" className="text-gray-500 hover:text-gray-700">Browse</Link>
          <span className="text-gray-400">/</span>
          <span>{product.name}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">No image</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl mb-4">{product.name}</h1>

            <div className="text-4xl mb-6">LKR {Number(product.price).toFixed(2)}</div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="size-5" />
                <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl mb-3">About this item</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <Separator className="my-6" />

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleBuyNow} className="w-full" disabled={product.stock <= 0}>
                Buy It Now
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToCart} className="w-full" disabled={product.stock <= 0}>
                Add to Cart
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900">
                <Shield className="size-5" />
                <span className="font-medium">Buyer Protection</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">
                Full refund if the item is not as described or if it doesn't arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
