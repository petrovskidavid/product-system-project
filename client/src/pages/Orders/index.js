import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../components/Navbar"
import OrderCards from "./OrderCards"
import OrderDetails from "../../components/OrderDetails"
import "../../assets/css/OrdersPage.css"

export default function OrdersPage() {

    const nav = useNavigate() //< Used to redirect client
    const location = useLocation()

    const authorizationNumber = new URLSearchParams(window.location.search)
       

    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null)
        {
            nav("/")
        }

        if(authorizationNumber.get("auth")){
            toast.success("Your order was successfully placed! An email with the authorization code " + authorizationNumber.get("auth") + " has been sent to your email.")
            nav("/orders")
        }
    }, [nav])


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