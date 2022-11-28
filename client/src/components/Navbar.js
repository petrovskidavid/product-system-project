import { useNavigate, useLocation } from "react-router-dom"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { FaBars } from "react-icons/fa"
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import "../assets/css/Navbar.css"


export default function Navbar() {

    const nav = useNavigate() //< Used to redirect client
    const location = useLocation()
    let showDropdown = true


    if(location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/emp/login")
        showDropdown = false


    return (
        <div className="navbar">
            <header className="navbar-title">
                This will be the navbar
            </header>
            {
                showDropdown 
                &&
                <DropdownButton className="dropdown-basic-button" title={<FaBars className="dropdown-icon"/>} size="sm">
                    {location.pathname === "/cart" && <Dropdown.Item href="/store">View Products</Dropdown.Item>}
                    {(location.pathname === "/store" || location.pathname === "/checkout") && <Dropdown.Item href="/cart">View Cart</Dropdown.Item>}
                    {location.pathname === "/emp/admin/weight-brackets" && <Dropdown.Item href="/emp/admin">View Orders</Dropdown.Item>}
                    {location.pathname === "/emp/admin" && <Dropdown.Item href="/emp/admin/weight-brackets">View Brackets</Dropdown.Item>}
                    <Dropdown.Item href="#/action-2">View Orders</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/">Logout</Dropdown.Item>
                </DropdownButton>
            }
            
        </div>
    )
}