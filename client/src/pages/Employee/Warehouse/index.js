import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import AuthorizedOrders from "./AuthorizedOrders"
import OrderDetails from "../../../components/OrderDetails"
import "../../../assets/css/WarehousePage.css"


export default function WarehousePage() {

    const location = useLocation()
    const nav = useNavigate() //< Used to redirect client
    const shippedOrder = new URLSearchParams(window.location.search).get("shippedOrder")

    useEffect(() => {
        if(localStorage.getItem("employeeID") === null)
        {
            nav("/emp/login")
        }

        if(shippedOrder){
            toast.success("Order " + shippedOrder + " has been successfully shipped!")
            nav("/emp/warehouse")
        }
    }, [nav])

    return(
        <div>
        <Navbar />
        <ToastContainer floatingTime={6000} />
        {location.pathname === "/emp/warehouse" && <AuthorizedOrders />}
        {location.pathname === "/emp/warehouse/order-details" && <OrderDetails />}
        </div>
    )
}