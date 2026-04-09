import { useParams, Link, useNavigate } from "react-router";
import { sellers, products } from "../data/mockData";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { Star, MessageCircle, ArrowLeft, MapPin, Clock } from "lucide-react";

export function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const seller = sellers.find(s => s.id === id);
  const sellerProducts = products.filter(p => p.sellerId === id);

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl mb-4">Seller not found</h1>
        <Link to="/browse">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (<div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl">
              {seller.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl mb-2">{seller.name}</h1>
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{seller.rating}</span>
                  <span className="text-gray-500">rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{seller.totalSales.toLocaleString()}</span>
                  <span className="text-gray-500">sales</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="size-4" />
                  <span>Responds {seller.responseTime}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4 max-w-2xl">{seller.bio}</p>
              <div className="text-sm text-gray-500 mb-6">
                Member since {seller.memberSince}
              </div>
              <Button>
                <MessageCircle className="size-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Items from this seller ({sellerProducts.length})</h2>
        </div>

        {sellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500">No items available from this seller</p>
          </div>
        )}
      </div>
    </div>
  );
}
