import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  calculateStlCost,
  createProduct,
  deleteProduct,
  deleteStlOrder,
  downloadStlOrderFile,
  getAllProducts,
  getAdminShopOrders,
  getAdminStlOrders,
  updateAdminShopOrderStatus,
  updateAdminStlOrderStatus,
  updateProduct,
  updateShopOrderTracking,
  updateStlOrderPrice,
} from "../lib/api";
import { toast } from "sonner";
import { categories } from "../data/mockData";
import {
  Calculator,
  Printer,
  ShoppingCart,
  PlusCircle,
  Package,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "calculator", label: "Cost Calculator", icon: Calculator },
  { id: "stl-orders", label: "STL Orders", icon: Printer },
  { id: "shop-orders", label: "Shop Orders", icon: ShoppingCart },
  { id: "add-product", label: "Add Product", icon: PlusCircle },
  { id: "products", label: "Manage Products", icon: Package },
];

const SHOP_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STL_STATUSES = ["PENDING_QUOTE", "QUOTED", "CONFIRMED", "PRINTING", "READY", "DELIVERED", "CANCELLED"];
const STL_MATERIALS = ["PLA", "PLA+", "ABS", "ABS+"];

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopOrders, setShopOrders] = useState([]);
  const [stlOrders, setStlOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Calculator state (per PDF formula)
  const [calculator, setCalculator] = useState({
    printTimeHours: "0",
    printTimeMinutes: "0",
    weightGrams: "",
    material: "PLA",
    supportStructures: false,
  });
  const [costBreakdown, setCostBreakdown] = useState(null);

  // STL order price calculator modal
  const [pricingOrderId, setPricingOrderId] = useState(null);
  const [pricingCalc, setPricingCalc] = useState({
    printTimeHours: "0",
    printTimeMinutes: "0",
    weightGrams: "",
    material: "PLA",
    supportStructures: false,
  });
  const [pricingResult, setPricingResult] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Product management state
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editFileInputRef = useRef(null);

  const authUser = useMemo(() => {
    const value = localStorage.getItem("authUser");
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }, []);

  const isAdmin = Boolean(authUser?.roles?.includes("ROLE_ADMIN"));
  const hasToken = Boolean(localStorage.getItem("token"));

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load products";
      toast.error(message);
    }
  };

  const loadData = async () => {
    setLoadingOrders(true);
    try {
      const [shop, stl] = await Promise.all([getAdminShopOrders(), getAdminStlOrders()]);
      setShopOrders(shop);
      setStlOrders(stl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load admin data";
      toast.error(message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (hasToken && isAdmin) {
      loadData();
      loadProducts();
    }
  }, [hasToken, isAdmin]);

  const onShopStatusChange = async (orderId, status) => {
    try {
      await updateAdminShopOrderStatus(orderId, status);
      toast.success("Shop order status updated");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Status update failed";
      toast.error(message);
    }
  };

  const onTrackingUpdate = async (orderId, trackingNumber) => {
    try {
      await updateShopOrderTracking(orderId, trackingNumber);
      toast.success("Tracking number updated");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update tracking number";
      toast.error(message);
    }
  };

  const onStlStatusChange = async (orderId, status) => {
    try {
      await updateAdminStlOrderStatus(orderId, status);
      toast.success("STL order status updated");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Status update failed";
      toast.error(message);
    }
  };

  const onDeleteStlOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this STL order? This will also remove the uploaded file.")) return;
    try {
      await deleteStlOrder(orderId);
      toast.success("STL order deleted");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete STL order";
      toast.error(message);
    }
  };

  const onDownloadStlFile = async (orderId) => {
    try {
      await downloadStlOrderFile(orderId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "File download failed";
      toast.error(message);
    }
  };

  const onCalculate = async (event) => {
    event.preventDefault();

    try {
      const result = await calculateStlCost({
        printTimeHours: Number(calculator.printTimeHours),
        printTimeMinutes: Number(calculator.printTimeMinutes),
        weightGrams: Number(calculator.weightGrams),
        material: calculator.material,
        supportStructures: calculator.supportStructures,
      });
      setCostBreakdown(result);
      toast.success("Cost calculated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cost calculation failed";
      toast.error(message);
    }
  };

  const onPricingCalculate = async () => {
    try {
      const result = await calculateStlCost({
        printTimeHours: Number(pricingCalc.printTimeHours),
        printTimeMinutes: Number(pricingCalc.printTimeMinutes),
        weightGrams: Number(pricingCalc.weightGrams),
        material: pricingCalc.material,
        supportStructures: pricingCalc.supportStructures,
      });
      setPricingResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cost calculation failed";
      toast.error(message);
    }
  };

  const onConfirmPrice = async () => {
    if (!pricingOrderId || !pricingResult) return;
    try {
      await updateStlOrderPrice(pricingOrderId, pricingResult.sellingPrice, {
        printTimeHours: Number(pricingCalc.printTimeHours),
        printTimeMinutes: Number(pricingCalc.printTimeMinutes),
        weightGrams: Number(pricingCalc.weightGrams),
        material: pricingCalc.material,
        supportStructures: pricingCalc.supportStructures,
      });
      toast.success("Price set and order status updated to QUOTED");
      setPricingOrderId(null);
      setPricingResult(null);
      setPricingCalc({ printTimeHours: "0", printTimeMinutes: "0", weightGrams: "", material: "PLA", supportStructures: false });
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to set price";
      toast.error(message);
    }
  };

  const onCreateProduct = async (event) => {
    event.preventDefault();

    if (!productForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!productForm.price || isNaN(Number(productForm.price)) || Number(productForm.price) <= 0) {
      toast.error("Price must be a valid positive number");
      return;
    }
    if (!productForm.stock || isNaN(Number(productForm.stock)) || Number(productForm.stock) < 0 || !Number.isInteger(Number(productForm.stock))) {
      toast.error("Stock must be a valid whole number (0 or more)");
      return;
    }
    if (!productForm.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!productForm.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", productForm.name.trim());
      formData.append("description", productForm.description.trim());
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("category", productForm.category);
      if (productImage) {
        formData.append("image", productImage);
      }

      await createProduct(formData);

      toast.success("Product created");
      setProductForm({ name: "", description: "", price: "", stock: "", category: "" });
      setProductImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product creation failed";
      toast.error(message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      category: product.category || "",
    });
    setEditImage(null);
    setEditImagePreview(product.imagePath || null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onUpdateProduct = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;

    if (!editForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!editForm.price || isNaN(Number(editForm.price)) || Number(editForm.price) <= 0) {
      toast.error("Price must be a valid positive number");
      return;
    }
    if (!editForm.stock || isNaN(Number(editForm.stock)) || Number(editForm.stock) < 0 || !Number.isInteger(Number(editForm.stock))) {
      toast.error("Stock must be a valid whole number (0 or more)");
      return;
    }
    if (!editForm.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!editForm.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("description", editForm.description.trim());
      formData.append("price", editForm.price);
      formData.append("stock", editForm.stock);
      formData.append("category", editForm.category);
      if (editImage) {
        formData.append("image", editImage);
      }

      await updateProduct(editingProduct.id, formData);
      toast.success("Product updated");
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product update failed";
      toast.error(message);
    }
  };

  const onDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product deletion failed";
      toast.error(message);
    }
  };

  if (!hasToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in as admin to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You are logged in, but your account does not have admin access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                {item.label}
                {item.id === "stl-orders" && stlOrders.length > 0 && (
                  <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">{stlOrders.length}</span>
                )}
                {item.id === "shop-orders" && shopOrders.length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{shopOrders.length}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <Button onClick={loadData} disabled={loadingOrders} className="w-full" variant="outline">
            {loadingOrders ? "Loading..." : "Refresh Data"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection("stl-orders")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Printer className="w-6 h-6 text-purple-600" /></div>
                    <div>
                      <p className="text-2xl font-bold">{stlOrders.length}</p>
                      <p className="text-sm text-gray-500">STL Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection("shop-orders")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <p className="text-2xl font-bold">{shopOrders.length}</p>
                      <p className="text-sm text-gray-500">Shop Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection("products")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"><Package className="w-6 h-6 text-green-600" /></div>
                    <div>
                      <p className="text-2xl font-bold">{products.length}</p>
                      <p className="text-sm text-gray-500">Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection("stl-orders")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg"><Printer className="w-6 h-6 text-yellow-600" /></div>
                    <div>
                      <p className="text-2xl font-bold">{stlOrders.filter(o => o.status === "PENDING_QUOTE").length}</p>
                      <p className="text-sm text-gray-500">Pending Quotes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Calculator Section */}
        {activeSection === "calculator" && (
        <Card>
          <CardHeader>
            <CardTitle>3D Print Cost Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCalculate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Print Time (Hours)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded-md px-3 py-2"
                    value={calculator.printTimeHours}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, printTimeHours: e.target.value }))}
                    placeholder="Hours"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Print Time (Minutes)</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    className="w-full border rounded-md px-3 py-2"
                    value={calculator.printTimeMinutes}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, printTimeMinutes: e.target.value }))}
                    placeholder="Minutes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.1"
                    className="w-full border rounded-md px-3 py-2"
                    value={calculator.weightGrams}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, weightGrams: e.target.value }))}
                    placeholder="Weight in grams"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={calculator.material}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, material: e.target.value }))}
                  >
                    {STL_MATERIALS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calculator.supportStructures}
                    onChange={(e) => setCalculator((prev) => ({ ...prev, supportStructures: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Support Structures (+ LKR 100.00)</span>
                </label>
                <Button type="submit">Calculate Cost</Button>
              </div>
            </form>
            {costBreakdown && (
              <div className="mt-4 bg-gray-50 border rounded-md p-4">
                <h4 className="font-semibold mb-2">Cost Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <p>Material Cost: <span className="font-medium">LKR {costBreakdown.materialCost.toFixed(2)}</span></p>
                  <p>Machine Cost: <span className="font-medium">LKR {costBreakdown.machineCost.toFixed(2)}</span></p>
                  <p>Energy Cost: <span className="font-medium">LKR {costBreakdown.energyCost.toFixed(2)}</span></p>
                  <p>Labor Cost: <span className="font-medium">LKR {costBreakdown.laborCost.toFixed(2)}</span></p>
                  <p>Support Cost: <span className="font-medium">LKR {costBreakdown.supportCost.toFixed(2)}</span></p>
                  <p>Total Cost: <span className="font-medium">LKR {costBreakdown.totalCost.toFixed(2)}</span></p>
                </div>
                <p className="mt-3 text-lg font-bold text-green-700">
                  Selling Price (1.5× markup) {costBreakdown.sellingPrice.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* STL Orders Section */}
        {(activeSection === "stl-orders") && (
          <Card>
            <CardHeader>
              <CardTitle>STL Orders ({stlOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[700px] overflow-auto">
              {stlOrders.length === 0 && <p className="text-gray-600">No STL orders yet.</p>}
              {stlOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-3 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">Order #{order.id} · {order.material} · x{order.quantity}</p>
                      <p className="text-sm text-gray-600">{order.customerName || "Unknown"} ({order.customerEmail || "no-email"})</p>
                      <p className="text-sm text-gray-600">
                        File: {order.fileName}
                        <button
                          type="button"
                          onClick={() => onDownloadStlFile(order.id)}
                          className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          ⬇ Download
                        </button>
                      </p>
                      {order.phone && <p className="text-sm text-gray-600">Phone: {order.phone}</p>}
                      {order.note && (
                        <div className="mt-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                          <p className="text-xs font-medium text-amber-700">Customer Note:</p>
                          <p className="text-sm text-amber-900 whitespace-pre-line">{order.note}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">LKR {Number(order.estimatedPrice).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === "PENDING_QUOTE" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "QUOTED" ? "bg-blue-100 text-blue-800" :
                        order.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" :
                        order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>{order.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(event) => onStlStatusChange(order.id, event.target.value)}
                    >
                      {STL_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPricingOrderId(order.id);
                        setPricingCalc({
                          printTimeHours: "0",
                          printTimeMinutes: "0",
                          weightGrams: "",
                          material: order.material || "PLA",
                          supportStructures: false,
                        });
                        setPricingResult(null);
                      }}
                    >
                      Calculate Price
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteStlOrder(order.id)}
                    >
                      Delete
                    </Button>
                    <span className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Shop Orders Section */}
        {(activeSection === "shop-orders") && (
          <Card>
            <CardHeader>
              <CardTitle>Shop Orders ({shopOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[700px] overflow-auto">
              {shopOrders.length === 0 && <p className="text-gray-600">No shop orders yet.</p>}
              {shopOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-3 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        Order #{order.id}
                        {order.category === "STL" && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">3D Print</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">{order.user?.fullName || order.user?.email || "Unknown user"}</p>
                      {order.shippingAddress && (
                        <p className="text-xs text-gray-500 whitespace-pre-line mt-1">{order.shippingAddress}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">LKR {Number(order.totalAmount || 0).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                        order.status === "SHIPPED" ? "bg-purple-100 text-purple-800" :
                        order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                        order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>{order.status}</span>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (<div className="border-t pt-2 mt-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Items:</p>
                      {order.items.map((item) => (
                        <p key={item.id} className="text-sm text-gray-700">
                          {item.productName || "Product"} × {item.quantity} — LKR {Number(item.unitPrice).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(event) => onShopStatusChange(order.id, event.target.value)}
                    >
                      {SHOP_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 border-t pt-2 mt-1">
                    <input
                      type="text"
                      className="border rounded-md px-2 py-1 text-sm flex-1"
                      placeholder="Enter tracking number"
                      defaultValue={order.trackingNumber || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onTrackingUpdate(order.id, e.target.value.trim());
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.target.closest(".flex").querySelector("input");
                        onTrackingUpdate(order.id, input.value.trim());
                      }}
                    >
                      Set Tracking
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add Product Section */}
        {activeSection === "add-product" && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={productForm.name}
                onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Product name"
                required
              />
              <input
                type="number"
                step="0.01"
                min={0.01}
                className="w-full border rounded-md px-3 py-2"
                value={productForm.price}
                onChange={(event) => {
                  const val = event.target.value;
                  if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                    setProductForm((prev) => ({ ...prev, price: val }));
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                placeholder="Price (LKR)"
                required
              />
              <input
                type="number"
                min={0}
                step={1}
                className="w-full border rounded-md px-3 py-2"
                value={productForm.stock}
                onChange={(event) => {
                  const val = event.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setProductForm((prev) => ({ ...prev, stock: val }));
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                }}
                placeholder="Stock"
                required
              />
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={productForm.category}
                onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
                  </div>
                )}
              </div>
              <textarea
                className="md:col-span-2 w-full border rounded-md px-3 py-2 min-h-[120px]"
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Description"
                required
              />
              <div className="md:col-span-2">
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}

        {/* Manage Products Section */}
        {activeSection === "products" && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-gray-600">No products found.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-2">Image</th>
                      <th className="py-2 px-2">Name</th>
                      <th className="py-2 px-2">Category</th>
                      <th className="py-2 px-2">Price (LKR)</th>
                      <th className="py-2 px-2">Stock</th>
                      <th className="py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">
                          {product.imagePath ? (
                            <img
                              src={product.imagePath}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </td>
                        <td className="py-2 px-2 font-medium">{product.name}</td>
                        <td className="py-2 px-2 text-sm text-gray-600">
                          {categories.find(c => c.id === product.category)?.name || product.category || "—"}
                        </td>
                        <td className="py-2 px-2">{Number(product.price).toFixed(2)}</td>
                        <td className="py-2 px-2">{product.stock}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(product)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => onDeleteProduct(product.id)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Product #{editingProduct.id}</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >&times;</button>
              </div>
              <form onSubmit={onUpdateProduct} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0.01}
                      className="w-full border rounded-md px-3 py-2"
                      value={editForm.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                          setEditForm((prev) => ({ ...prev, price: val }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="w-full border rounded-md px-3 py-2"
                      value={editForm.stock}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          setEditForm((prev) => ({ ...prev, stock: val }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white"
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full border rounded-md px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {editImagePreview && (
                    <div className="mt-2">
                      <img src={editImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Price Calculator Modal for STL Orders */}
        {pricingOrderId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Calculate Price — STL Order #{pricingOrderId}</h3>
                <button
                  onClick={() => { setPricingOrderId(null); setPricingResult(null); }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >×</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Print Time (Hours)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded-md px-3 py-2"
                    value={pricingCalc.printTimeHours}
                    onChange={(e) => setPricingCalc((prev) => ({ ...prev, printTimeHours: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Print Time (Minutes)</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    className="w-full border rounded-md px-3 py-2"
                    value={pricingCalc.printTimeMinutes}
                    onChange={(e) => setPricingCalc((prev) => ({ ...prev, printTimeMinutes: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.1"
                    className="w-full border rounded-md px-3 py-2"
                    value={pricingCalc.weightGrams}
                    onChange={(e) => setPricingCalc((prev) => ({ ...prev, weightGrams: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={pricingCalc.material}
                    onChange={(e) => setPricingCalc((prev) => ({ ...prev, material: e.target.value }))}
                  >
                    {STL_MATERIALS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pricingCalc.supportStructures}
                  onChange={(e) => setPricingCalc((prev) => ({ ...prev, supportStructures: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Support Structures (+ LKR 100.00)</span>
              </label>

              <Button onClick={onPricingCalculate} className="w-full bg-blue-600 hover:bg-blue-700">
                Calculate Price
              </Button>

              {pricingResult && (
                <div className="bg-gray-50 border rounded-md p-4 space-y-2">
                  <h4 className="font-semibold">Cost Breakdown</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <p>Material Cost: <b>LKR {pricingResult.materialCost.toFixed(2)}</b></p>
                    <p>Machine Cost: <b>LKR {pricingResult.machineCost.toFixed(2)}</b></p>
                    <p>Energy Cost: <b>LKR {pricingResult.energyCost.toFixed(2)}</b></p>
                    <p>Labor Cost: <b>LKR {pricingResult.laborCost.toFixed(2)}</b></p>
                    <p>Support Cost: <b>LKR {pricingResult.supportCost.toFixed(2)}</b></p>
                    <p>Total Cost: <b>LKR {pricingResult.totalCost.toFixed(2)}</b></p>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    Selling Price: LKR {pricingResult.sellingPrice.toFixed(2)}
                  </p>
                  <Button onClick={onConfirmPrice} className="w-full bg-green-600 hover:bg-green-700">
                    Confirm & Set Price for Order #{pricingOrderId}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
