import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import AuthorizedOrders from "./AuthorizedOrders"
import OrderDetails from "../../../components/OrderDetails"
import "../../../assets/css/WorkstationsPage.css"


/**
 * Creates the workstations page where workstation employees can see all the orders that are waiting to be fullfilled,
 * view more details about each order, and then ship them out.
 * 
 * @returns The workstations page
 */
export default function WorkstationsPage() {

    const location = useLocation()                                                       //< Holds infromation about the current url
    const nav = useNavigate()                                                            //< Holds functions to be able to navigate to different pages
    const shippedOrder = new URLSearchParams(window.location.search).get("shippedOrder") //< Holds the GET parametes of the current url


    useEffect(() => {
        if(localStorage.getItem("employeeID") === null) {
            // Checks if an employee is not logged in, and redirects to the login page if so

            nav("/emp/login")
        }

        // Checks if an order has been shipped out by looking at the GET parameters
        if(shippedOrder){
            
            // Displays a success message with information about the order that has been shipped
            toast.success("Order " + shippedOrder + " has been successfully shipped!")

            // Clears the GET parameters
            nav("/emp/workstations")
        }
    })


    return(
        <div>
        <Navbar />
        <ToastContainer floatingTime={6000} />
        {location.pathname === "/emp/workstations" && <AuthorizedOrders />}
        {location.pathname === "/emp/workstations/order-details" && <OrderDetails />}
        </div>
    )
}