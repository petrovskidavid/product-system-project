import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import OrderCards from "./OrderCards"
import OrderDetails from "../../../components/OrderDetails"
import "../../../assets/css/OrdersPage.css"


/**
 * Creates the order history page for the customer, and also displays the order details page
 * when the customer clicks to view more details about their order.
 * 
 * @returns The order history page, and the order details page whenever a customer views more details
 */
export default function OrdersPage() {

    const nav = useNavigate()      //< Holds functions to be able to navigate to different pages
    const location = useLocation() //< Holds infromation about the current url

    const authorizationNumber = new URLSearchParams(window.location.search) //< Holds the GET parametes of the current url
    
    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null) {
            // Checks if a customer is not logged in, and redirects to the login page if so

            nav("/")
        }

        // Checks if the url has any GET parameters
        if(authorizationNumber.get("auth")) {

            // Displays a success message that the order transaction was processed
            toast.success("Your order was successfully placed! An email with the authorization code " + authorizationNumber.get("auth") + " has been sent to your email.")

            // Clears the GET parameters
            nav("/orders")
        }
    })


    return (
        <div>
            {location.pathname === "/orders" ? 
                                (
                                    <div>
                                        <Navbar />
                                        <ToastContainer floatingTime={9000} />
                                        <OrderCards />
                                    </div>
                                ) 
                                : 
                                (
                                    <div>
                                        <Navbar showDropdown={false}/>
                                        <ToastContainer floatingTime={9000} />
                                        <OrderDetails />
                                    </div>    
                                )
            }
        </div>
    )
}