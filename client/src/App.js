import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogInPage from "./pages/LogIn"
import SignUpPage from "./pages/SignUp"
import StorePage from "./pages/Store"
import CartPage from "./pages/Cart"
import './assets/css/App.css';

export default function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage type="customer"/>} />
          <Route path="/emp/login" element={<LogInPage type="employee" />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}