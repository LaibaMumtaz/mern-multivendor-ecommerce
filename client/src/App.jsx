import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import ChatWidget from './components/ai/ChatWidget';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Home from './pages/customer/Home';

// Pages (to be implemented)
import Cart from './pages/customer/Cart';
import VendorDashboard from './pages/vendor/Dashboard';
import AddProduct from './pages/vendor/AddProduct';
import Sales from './pages/vendor/Sales';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/ProductList';
import ProductDetail from './pages/customer/Product';
import VendorStore from './pages/customer/VendorStore';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import Orders from './pages/customer/Orders';

import Profile from './pages/customer/Profile';
import SellerLanding from './pages/customer/SellerLanding';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sell" element={<SellerLanding />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/vendors/:id" element={<VendorStore />} />

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Dashboard Layout for Vendor/Admin */}
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['Vendor', 'Admin']} />}>
                <Route element={<DashboardLayout children={<Outlet />} />}>
                  <Route path="/vendor" element={<VendorDashboard />} />
                  <Route path="/vendor/add-product" element={<AddProduct />} />
                  <Route path="/vendor/sales" element={<Sales />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProductList />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
