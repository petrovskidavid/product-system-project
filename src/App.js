import { BrowserRouter, Routes, Route } from "react-router-dom"
import ErrorPage from "./pages/Error"
import LogInPage from "./pages/LogIn"
import SignUpPage from "./pages/SignUp"
import StorePage from "./pages/Customer/Store"
import CartPage from "./pages/Customer/Cart"
import OrdersPage from "./pages/Customer/Orders"
import CheckoutPage from "./pages/Customer/Checkout"
import AdminPage from "./pages/Employee/Admin"
import ReceivingPage from "./pages/Employee/Receiving"
import WorkstationsPage from "./pages/Employee/Workstations"
import './assets/css/App.css';


/**
 * The main application, it handles all the routing and displays the corresponding page depenending on the url.
 * 
 * @returns The corresponding page for the requested route/url
 */
export default function App() {
  
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
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