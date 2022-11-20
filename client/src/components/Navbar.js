import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/Navbar.css"

export default function Navbar() {

    const nav = useNavigate() //< Used to redirect client
    const location = useLocation()
    let showLogout = true

    const logout = () => {
        nav("/")
    }

    if(location.pathname === "/" || location.pathname === "/signup")
        showLogout = false

    return (
        <div className="navbar">
            <header>
                <br />
                <br />
                This will be the navbar
            </header>
            {showLogout && <button className="logout-btn" onClick={logout}>Log Out</button>}
        </div>
    )
}