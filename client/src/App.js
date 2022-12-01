import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogInPage from "./pages/LogIn"
import SignUpPage from "./pages/SignUp"
import StorePage from "./pages/Store"
import CartPage from "./pages/Cart"
import OrdersPage from "./pages/Orders"
import CheckoutPage from "./pages/Checkout"
import AdminPage from "./pages/Employee/Admin"
import ReceivingPage from "./pages/Employee/Receiving"
import WorkstationsPage from "./pages/Employee/Workstations"
import './assets/css/App.css';

export default function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage type="customer"/>} />
          <Route path="/emp/login" element={<LogInPage type="employee" />} />
          <Route path="/emp/admin" element={<AdminPage />} />
          <Route path="/emp/admin/weight-brackets" element={<AdminPage />} />
          <Route path="/emp/admin/order-details" element={<AdminPage />} />
          <Route path="/emp/receiving" element={<ReceivingPage />} />
          <Route path="/emp/workstations" element={<WorkstationsPage />} />
          <Route path="/emp/workstations/order-details" element={<WorkstationsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/details" element={<OrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}