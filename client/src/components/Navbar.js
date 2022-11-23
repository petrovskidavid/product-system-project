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
                    <Dropdown.Item href="#/action-1">View Cart</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">View Orders</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/">Logout</Dropdown.Item>
                </DropdownButton>
            }
            
        </div>
    )
}