import { BrowserRouter, Routes, Route } from "react-router-dom"
import LogInPage from "./pages/LogInPage"
import SignUpPage from "./pages/SignUpPage"
import StorePage from "./pages/StorePage"
import './App.css';

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