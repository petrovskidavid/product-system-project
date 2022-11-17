import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogInPage from "./pages/LogIn"
import SignUpPage from "./pages/SignUp"
import StorePage from "./pages/Store"
import './assets/css/App.css';

export default function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}