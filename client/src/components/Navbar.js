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


    if(location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/emp/login" || location.pathname === "/orders/details" || location.pathname === "/emp/admin/order-details" || location.pathname === "/emp/workstations/order-details")
        showDropdown = false


    return (
        <div className="navbar">
            <header className="navbar-title">
                Muffler Man
            </header>
            {
                showDropdown 
                &&
                <DropdownButton className="dropdown-basic-button" title={<FaBars className="dropdown-icon"/>} size="sm">
                    {(location.pathname === "/cart" || location.pathname === "/orders") && <Dropdown.Item href="/store">View Products</Dropdown.Item>}
                    {(location.pathname === "/store" || location.pathname === "/checkout" || location.pathname === "/orders") && <Dropdown.Item href="/cart">View Cart</Dropdown.Item>}
                    {(location.pathname === "/store" || location.pathname === "/checkout" || location.pathname === "/cart") && <Dropdown.Item href="/orders">View Orders</Dropdown.Item>}
                    {location.pathname === "/emp/admin/weight-brackets" && <Dropdown.Item href="/emp/admin">View Orders</Dropdown.Item>}
                    {location.pathname === "/emp/admin" && <Dropdown.Item href="/emp/admin/weight-brackets">View Brackets</Dropdown.Item>}
                    {(location.pathname !== "/emp/receiving" && location.pathname !== "/emp/workstations") && <Dropdown.Divider />}
                    <Dropdown.Item href={location.pathname.includes("/emp") ? "/emp/login" : "/"}>Logout</Dropdown.Item>
                </DropdownButton>
            }
        </div>
    )
}