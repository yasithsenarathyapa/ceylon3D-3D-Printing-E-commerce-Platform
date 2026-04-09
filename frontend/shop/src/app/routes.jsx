import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { SellerProfile } from "./pages/SellerProfile";
import { MyAccount } from "./pages/MyAccount";
import { NotFound } from "./pages/NotFound";
import { AdminDashboard } from "./pages/AdminDashboard";
import { STLUpload } from "./pages/STLUpload";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Home /> },
      { path: "browse", element: <ProtectedRoute><Browse /></ProtectedRoute> },
      { path: "product/:id", element: <ProtectedRoute><ProductDetail /></ProtectedRoute> },
      { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: "seller/:id", element: <ProtectedRoute><SellerProfile /></ProtectedRoute> },
      { path: "account", Component: MyAccount },
      { path: "admin", element: <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute> },
      { path: "upload", element: <ProtectedRoute><STLUpload /></ProtectedRoute> },
      { path: "*", Component: NotFound },
    ],
  },
]);
