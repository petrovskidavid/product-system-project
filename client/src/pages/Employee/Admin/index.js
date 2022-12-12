import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import AllOrders from "./AllOrders"
import OrderDetails from "../../../components/OrderDetails"
import WeightBrackets from "./WeightBrackets"
import "../../../assets/css/AdminPage.css"


/**
 * Creates the administators page where they initially view all the orders and are able to search through them,
 * and upon request they are able to view the weight brackets table and update it as well.
 * 
 * @returns The administators pages
 */
export default function AdminPage() {

    const location = useLocation() //< Holds infromation about the current url
    const nav = useNavigate()      //< Holds functions to be able to navigate to different pages
    let adminDisplay               //< Holds what to display on the administrators page

    useEffect(() => {
        if(localStorage.getItem("employeeID") === null) {
            // Checks if an employee is not logged in, and redirects to the login page if so

            nav("/emp/login")
        }
    }, [nav])
    
    
    if(location.pathname === "/emp/admin/weight-brackets") {

        adminDisplay = (
            <div>
                <Navbar />
                <ToastContainer floatingTime={6000} />
                <WeightBrackets />
            </div>
        )
    
    } else if (location.pathname === "/emp/admin") {

        adminDisplay = (
            <div>
                <Navbar />
                <ToastContainer floatingTime={6000} />
                <AllOrders />
            </div>
        )

    } else if (location.pathname === "/emp/admin/order-details") {

        adminDisplay = (
            <div>
                <Navbar showDropdown={false} />
                <ToastContainer floatingTime={6000} />
                <OrderDetails />
            </div>
        )
    }

    return adminDisplay
}