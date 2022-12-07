import { useLocation } from "react-router-dom"
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { FaBars } from "react-icons/fa"
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import "../assets/css/Navbar.css"
import logo from "../assets/img/logo.png"


/**
 * Creates the navigation bar at the top of the page.
 * 
 * @param props.showDropdown Tells the component if the dropdown menu should be visible or not
 *  
 * @returns The navigation bar component
 */
export default function Navbar(props) {

    const location = useLocation()                                     //< Holds infromation about the current url
    let showDropdown = props.showDropdown === undefined ? true : false //< Checks if the dropdown menu should be shown or not


    return (
        <div className="navbar">
            <header className="navbar-title">
                <img src={logo} alt="logo" width="80" height="80" /> <span className="store-name">Muffler Man</span>
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