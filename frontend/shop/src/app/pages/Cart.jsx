import { Link } from "react-router";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { placeOrder } from "../lib/api";

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    deliveryAddress: "",
    city: "",
  });

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.deliveryAddress || !deliveryInfo.city) {
      toast.error("Please fill all delivery details");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place an order");
      return;
    }

    try {
      const shippingAddress = `${deliveryInfo.fullName}\n${deliveryInfo.phone}\n${deliveryInfo.deliveryAddress}\n${deliveryInfo.city}`;
      const orderItems = items.map((item) => ({
        productName: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      await placeOrder(shippingAddress, orderItems);
      clearCart();
      setShowCheckout(false);
      setDeliveryInfo({ fullName: "", phone: "", deliveryAddress: "", city: "" });
      toast.success("Order placed successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="size-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start adding some amazing 3D printed items!</p>
          <Link to="/browse">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-6">
                <div className="flex gap-4">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">Sold by {item.seller}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>LKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg mb-6">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">LKR {totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full mb-3" size="lg" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </Button>
              <Link to="/browse">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {showCheckout && (
                <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3 border rounded-lg p-4">
                  <h3 className="font-semibold">Delivery Information</h3>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Full Name"
                    value={deliveryInfo.fullName}
                    onChange={(event) => setDeliveryInfo((prev) => ({ ...prev, fullName: event.target.value }))}
                    required
                  />
                  <input
                    type="tel"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Phone Number"
                    value={deliveryInfo.phone}
                    onChange={(event) => setDeliveryInfo((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                  />
                  <textarea
                    className="w-full border rounded-md px-3 py-2 min-h-[90px]"
                    placeholder="Delivery Address"
                    value={deliveryInfo.deliveryAddress}
                    onChange={(event) => setDeliveryInfo((prev) => ({ ...prev, deliveryAddress: event.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="City"
                    value={deliveryInfo.city}
                    onChange={(event) => setDeliveryInfo((prev) => ({ ...prev, city: event.target.value }))}
                    required
                  />

                  <div className="rounded-md border bg-gray-50 p-3">
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-gray-600">Cash on Delivery (COD) only</p>
                  </div>

                  <Button type="submit" className="w-full">Place Order (COD)</Button>
                </form>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                <p className="text-blue-900">
                  <strong>Free shipping</strong> on all orders. All items are backed by our buyer protection guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
