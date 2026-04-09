import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Package, Heart, Settings, CreditCard, MapPin, Bell, LogOut, RefreshCcw, Printer, Pencil, X, Check, Menu, User, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { toast } from "sonner";
import { login, register, getMyOrders, getMyStlOrders, confirmStlOrder, updateMyStlOrder } from "../lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

const USER_NAV_ITEMS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "stl-orders", label: "3D Print Orders", icon: Printer },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: Settings },
];

export function MyAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stlOrders, setStlOrders] = useState([]);
  const [stlOrdersLoading, setStlOrdersLoading] = useState(false);
  const [editingStlId, setEditingStlId] = useState(null);
  const [editStlForm, setEditStlForm] = useState({ material: "", quantity: 1, note: "" });
  const [activeSection, setActiveSection] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedStl, setExpandedStl] = useState(null);

  const user = useMemo(() => {
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

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const loadOrders = async () => {
    if (!localStorage.getItem("token")) return;
    setOrdersLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      // silently fail – user may not be logged in
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadStlOrders = async () => {
    if (!localStorage.getItem("token")) return;
    setStlOrdersLoading(true);
    try {
      const data = await getMyStlOrders();
      setStlOrders(data);
    } catch {
      // silently fail
    } finally {
      setStlOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      loadStlOrders();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    const authKeys = [
      "token",
      "authToken",
      "accessToken",
      "jwt",
      "user",
      "authUser",
      "refreshToken",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    toast.success("You have been logged out");
    navigate("/");
    window.location.reload();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await login(normalizedEmail, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Login successful");
      navigate("/account");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordHasUppercase = /[A-Z]/.test(password);
  const passwordHasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordMinLength = password.length >= 8;
  const passwordIsValid = passwordHasUppercase && passwordHasSymbol && passwordMinLength;

  const handleRegister = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }
    if (!passwordMinLength) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!passwordHasUppercase) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!passwordHasSymbol) {
      toast.error("Password must contain at least one special character (!@#$%^&* etc.)");
      return;
    }
    setLoading(true);
    try {
      const data = await register(fullName, normalizedEmail, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Account created and logged in");
      navigate("/account");
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (<div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl mb-6">My Account</h1>

          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="bg-white p-1">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border rounded-md px-3 py-2"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="p-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border rounded-md px-3 py-2"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      minLength={8}
                    />
                    {password.length > 0 && (
                      <div className="mt-2 space-y-1 text-xs">
                        <div className={`flex items-center gap-1 ${passwordMinLength ? 'text-green-600' : 'text-red-500'}`}>
                          <span>{passwordMinLength ? '✓' : '✗'}</span>
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordHasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                          <span>{passwordHasUppercase ? '✓' : '✗'}</span>
                          <span>At least one uppercase letter (A-Z)</span>
                        </div>
                        <div className={`flex items-center gap-1 ${passwordHasSymbol ? 'text-green-600' : 'text-red-500'}`}>
                          <span>{passwordHasSymbol ? '✓' : '✗'}</span>
                          <span>At least one special character (!@#$%^&* etc.)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button type="submit" disabled={loading || !passwordIsValid}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {USER_NAV_ITEMS.map((item) => {
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
                {item.id === "orders" && orders.length > 0 && (
                  <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
                {item.id === "stl-orders" && stlOrders.length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{stlOrders.length}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="size-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">My Account</h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Orders Section */}
          {activeSection === "orders" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Orders</h2>
                <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadOrders} disabled={ordersLoading}>
                <RefreshCcw className={`size-4 mr-1 ${ordersLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            {ordersLoading && orders.length === 0 && (
              <Card className="p-12 text-center">
                <RefreshCcw className="size-10 text-purple-400 mx-auto mb-3 animate-spin" />
                <p className="text-gray-500">Loading your orders...</p>
              </Card>
            )}
            {!ordersLoading && orders.length === 0 && (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="size-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">When you place an order, it will appear here so you can track its progress.</p>
                <Link to="/browse">
                  <Button className="bg-purple-600 hover:bg-purple-700">Browse Products</Button>
                </Link>
              </Card>
            )}
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusConfig = {
                PENDING: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: Clock, label: "Pending", progress: 25 },
                PROCESSING: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: Package, label: "Processing", progress: 50 },
                SHIPPED: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: Truck, label: "Shipped", progress: 75 },
                DELIVERED: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle, label: "Delivered", progress: 100 },
                CANCELLED: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: XCircle, label: "Cancelled", progress: 0 },
              };
              const status = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order header - always visible */}
                  <button
                    className="w-full text-left p-4 sm:p-5"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`shrink-0 w-11 h-11 rounded-xl ${status.bg} ${status.border} border flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${status.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          {order.category === "STL" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">3D Print</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">LKR {Number(order.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                        <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="shrink-0 text-gray-400 ml-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {order.status !== "CANCELLED" && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span>Placed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${status.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
                      {/* Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="pt-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                                    <Package className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{item.productName || "Product"}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">LKR {Number(item.unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shipping & Tracking */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.shippingAddress && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">Tracking Number</p>
                            <p className="text-sm font-mono font-semibold text-purple-700">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          )}

          {/* STL Orders Section */}
          {activeSection === "stl-orders" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">3D Print Orders</h2>
                <p className="text-sm text-gray-500 mt-1">{stlOrders.length} order{stlOrders.length !== 1 ? "s" : ""}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadStlOrders} disabled={stlOrdersLoading}>
                <RefreshCcw className={`size-4 mr-1 ${stlOrdersLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            {stlOrdersLoading && stlOrders.length === 0 && (
              <Card className="p-12 text-center">
                <RefreshCcw className="size-10 text-blue-400 mx-auto mb-3 animate-spin" />
                <p className="text-gray-500">Loading 3D print orders...</p>
              </Card>
            )}
            {!stlOrdersLoading && stlOrders.length === 0 && (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="size-10 text-blue-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No 3D print orders yet</h2>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Upload an STL file from the landing page to get a quote for 3D printing.</p>
              </Card>
            )}
            {stlOrders.map((order) => {
              const isExpanded = expandedStl === order.id;
              const stlStatusConfig = {
                PENDING_QUOTE: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: Clock, label: "Pending Quote", step: 0 },
                QUOTED: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: FileText, label: "Quoted", step: 1 },
                CONFIRMED: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: Check, label: "Confirmed", step: 2 },
                PRINTING: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: Printer, label: "Printing", step: 3 },
                READY: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", icon: Package, label: "Ready", step: 4 },
                DELIVERED: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle, label: "Delivered", step: 5 },
                CANCELLED: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: XCircle, label: "Cancelled", step: -1 },
              };
              const stlSteps = ["Quote", "Quoted", "Confirmed", "Printing", "Ready", "Delivered"];
              const status = stlStatusConfig[order.status] || stlStatusConfig.PENDING_QUOTE;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <button
                    className="w-full text-left p-4 sm:p-5"
                    onClick={() => setExpandedStl(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`shrink-0 w-11 h-11 rounded-xl ${status.bg} ${status.border} border flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${status.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">3D Print #{order.id}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs font-medium text-gray-500">{order.material || "PLA"}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">×{order.quantity || 1}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {order.estimatedPrice ? (
                          <p className="font-bold text-green-700">LKR {Number(order.estimatedPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Awaiting quote</p>
                        )}
                        <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="shrink-0 text-gray-400 ml-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Step progress (not for cancelled) */}
                    {status.step >= 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          {stlSteps.map((s) => <span key={s}>{s}</span>)}
                        </div>
                        <div className="flex gap-1">
                          {stlSteps.map((s, i) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                              i <= status.step ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-100"
                            }`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Quoted - confirm action (shown even when collapsed) */}
                  {order.status === "QUOTED" && !isExpanded && (
                    <div className="border-t border-blue-100 bg-blue-50 px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-blue-700">
                        Quoted at <span className="font-bold">LKR {Number(order.estimatedPrice).toFixed(2)}</span> — accept?
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await confirmStlOrder(order.id);
                            toast.success("Order confirmed! It will now be processed.");
                            loadStlOrders();
                          } catch (err) {
                            toast.error(err.message || "Failed to confirm order");
                          }
                        }}
                      >
                        <Check className="size-4 mr-1" />
                        Confirm
                      </Button>
                    </div>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
                      {/* Edit form for PENDING_QUOTE */}
                      {order.status === "PENDING_QUOTE" && editingStlId === order.id && (
                        <div className="pt-4">
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-amber-800">Edit Order Details</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Material</label>
                                <select
                                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                  value={editStlForm.material}
                                  onChange={(e) => setEditStlForm((prev) => ({ ...prev, material: e.target.value }))}
                                >
                                  <option value="PLA">PLA</option>
                                  <option value="PLA+">PLA+</option>
                                  <option value="ABS">ABS</option>
                                  <option value="ABS+">ABS+</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                <input
                                  type="number"
                                  min={1}
                                  className="w-full border rounded-lg px-3 py-2 text-sm"
                                  value={editStlForm.quantity}
                                  onChange={(e) => setEditStlForm((prev) => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
                              <textarea
                                className="w-full border rounded-lg px-3 py-2 text-sm min-h-[60px]"
                                value={editStlForm.note}
                                onChange={(e) => setEditStlForm((prev) => ({ ...prev, note: e.target.value }))}
                                placeholder="Any special instructions..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700"
                                onClick={async () => {
                                  try {
                                    await updateMyStlOrder(order.id, editStlForm);
                                    toast.success("Order updated successfully");
                                    setEditingStlId(null);
                                    loadStlOrders();
                                  } catch (err) {
                                    toast.error(err.message || "Failed to update order");
                                  }
                                }}
                              >
                                <Check className="size-3 mr-1" />
                                Save Changes
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingStlId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quoted - Confirm action (expanded view) */}
                      {order.status === "QUOTED" && (
                        <div className="pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-blue-800">Price Quote Ready</p>
                              <p className="text-sm text-blue-600 mt-0.5">
                                Your quoted price is <span className="font-bold">LKR {Number(order.estimatedPrice).toFixed(2)}</span>
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={async () => {
                                try {
                                  await confirmStlOrder(order.id);
                                  toast.success("Order confirmed! It will now be processed.");
                                  loadStlOrders();
                                } catch (err) {
                                  toast.error(err.message || "Failed to confirm order");
                                }
                              }}
                            >
                              <Check className="size-4 mr-1" />
                              Accept & Confirm
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Order details grid */}
                      {editingStlId !== order.id && (
                        <div className="pt-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Details</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">Material</p>
                              <p className="text-sm font-medium text-gray-800 mt-0.5">{order.material || "PLA"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">Quantity</p>
                              <p className="text-sm font-medium text-gray-800 mt-0.5">{order.quantity || 1}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase">File</p>
                              <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{order.fileName ? order.fileName.replace(/^[a-f0-9-]+-/, "") : "—"}</p>
                            </div>
                            {order.weightGrams != null && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase">Weight</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.weightGrams}g</p>
                              </div>
                            )}
                            {(order.printTimeHours != null || order.printTimeMinutes != null) && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase">Print Time</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.printTimeHours || 0}h {order.printTimeMinutes || 0}m</p>
                              </div>
                            )}
                            {order.supportStructures != null && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase">Supports</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.supportStructures ? "Yes" : "No"}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Note */}
                      {order.note && editingStlId !== order.id && (
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-[10px] font-semibold text-amber-500 uppercase">Your Note</p>
                          <p className="text-sm text-gray-700 mt-0.5">{order.note}</p>
                        </div>
                      )}

                      {/* Edit button for pending orders */}
                      {order.status === "PENDING_QUOTE" && editingStlId !== order.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingStlId(order.id);
                            setEditStlForm({
                              material: order.material || "PLA",
                              quantity: order.quantity || 1,
                              note: order.note || "",
                            });
                          }}
                        >
                          <Pencil className="size-3 mr-1" />
                          Edit Order
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          )}

          {/* Wishlist Section */}
          {activeSection === "wishlist" && (
          <div className="space-y-4">
            <Card className="p-8 text-center">
              <Heart className="size-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save items you love for later</p>
              <Link to="/browse">
                <Button>Discover Items</Button>
              </Link>
            </Card>
          </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Shipping Addresses</h2>
              <p className="text-gray-600 mb-4">No saved addresses</p>
              <Button variant="outline">
                <MapPin className="size-4 mr-2" />
                Add Address
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Payment Methods</h2>
              <p className="text-gray-600 mb-4">No saved payment methods</p>
              <Button variant="outline">
                <CreditCard className="size-4 mr-2" />
                Add Payment Method
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl mb-4">Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" defaultChecked />
                  <div>
                    <div className="font-medium">Order updates</div>
                    <div className="text-sm text-gray-600">Get notified about your order status</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" defaultChecked />
                  <div>
                    <div className="font-medium">Promotional emails</div>
                    <div className="text-sm text-gray-600">Receive deals and special offers</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="size-4" />
                  <div>
                    <div className="font-medium">New arrivals</div>
                    <div className="text-sm text-gray-600">Be the first to know about new products</div>
                  </div>
                </label>
              </div>
              <Button className="mt-4">Save Preferences</Button>
            </Card>
          </div>
          )}

        </div>
      </main>
    </div>
  );
}
