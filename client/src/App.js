import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import StorePage from "./pages/StorePage"
import './App.css';

export default function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}