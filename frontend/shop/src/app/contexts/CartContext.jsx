import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart, addToCartApi, updateCartItem, removeCartItem, clearCartApi } from "../lib/api";
import { toast } from "sonner";
import { API_ROOT_URL } from "../lib/config";

const CartContext = createContext(undefined);

function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_ROOT_URL}${imagePath}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  // Load cart from backend
  const loadCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getCart();
      if (!Array.isArray(data)) {
        console.error("GET /api/cart returned non-array:", data);
        return;
      }
      const mapped = data.map((ci) => ({
        id: ci.product?.id,
        cartItemId: ci.id,
        title: ci.product?.name || "Product",
        price: Number(ci.product?.price || 0),
        image: getImageUrl(ci.product?.imagePath),
        seller: "Ceylon3D",
        quantity: ci.quantity,
      }));
      setItems(mapped);
    } catch (err) {
      console.error("Failed to load cart from server:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Listen for login/logout to refresh cart
  // "storage" fires from OTHER tabs; "auth-change" fires from THIS tab
  useEffect(() => {
    const reload = () => loadCart();
    const onStorage = (e) => {
      if (e.key === "token") reload();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", reload);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", reload);
    };
  }, [loadCart]);

  const addToCart = async (item) => {
    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your cart");
      throw new Error("Not logged in");
    }
    try {
      await addToCartApi(item.id, 1);
      await loadCart();
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart (API) Details:", err, err.stack);
      toast.error(err.message || "Failed to add to cart. Please try again.");
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    const cartItem = items.find((i) => i.id === productId);
    if (!isLoggedIn() || !cartItem?.cartItemId) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    try {
      await removeCartItem(cartItem.cartItemId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove cart item (API):", err);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const cartItem = items.find((i) => i.id === productId);
    if (!isLoggedIn() || !cartItem?.cartItemId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      return;
    }
    try {
      await updateCartItem(cartItem.cartItemId, quantity);
      await loadCart();
    } catch (err) {
      console.error("Failed to update cart item (API):", err);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const clearCart = async () => {
    if (isLoggedIn()) {
      try {
        await clearCartApi();
      } catch (err) {
        console.error("Failed to clear cart (API):", err);
        toast.error("Failed to clear cart. Please try again.");
        return;
      }
    }
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
