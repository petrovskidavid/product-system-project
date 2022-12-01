import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ToastContainer, toast } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import AuthorizedOrders from "./AuthorizedOrders"
import OrderDetails from "../../../components/OrderDetails"
import "../../../assets/css/WorkstationsPage.css"


export default function WorkstationsPage() {

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
            nav("/emp/workstations")
        }
    }, [nav])

    return(
        <div>
        <Navbar />
        <ToastContainer floatingTime={6000} />
        {location.pathname === "/emp/workstations" && <AuthorizedOrders />}
        {location.pathname === "/emp/workstations/order-details" && <OrderDetails />}
        </div>
    )
}