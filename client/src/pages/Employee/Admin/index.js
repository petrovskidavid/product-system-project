import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import Orders from "./Orders"
import WeightBrackets from "./WeightBrackets"

export default function AdminPage() {

    const location = useLocation()
    const nav = useNavigate() //< Used to redirect client

    useEffect(() => {
        if(localStorage.getItem("employeeID") === null)
        {
            nav("/emp/login")
        }
    }, [nav])

    return(
        <div>
        <Navbar />
        <ToastContainer floatingTime={5000} />
        {location.pathname === "/emp/admin/weight-brackets" && <WeightBrackets />}
        {location.pathname === "/emp/admin" && <Orders />}
        </div>
    )
}