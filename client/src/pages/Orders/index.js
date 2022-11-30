import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../components/Navbar"
import OrderCards from "./OrderCards"
import "../../assets/css/OrdersPage.css"

export default function OrdersPage() {

    const nav = useNavigate() //< Used to redirect client

    const authorizationNumber = new URLSearchParams(window.location.search)
       

    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null)
        {
            nav("/")
        }

        if(authorizationNumber.get("auth")){
            toast.success("Your order was successfully placed! An email with the authorization code " + authorizationNumber.get("auth") + " has been sent to you.")
            nav("/orders")
        }
    }, [nav])


    return (
        <div>
            <Navbar />
            <ToastContainer floatingTime={5000} />
            <OrderCards />
        </div>
    )
}