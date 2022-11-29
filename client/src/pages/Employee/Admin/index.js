import { useLocation } from "react-router-dom"
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import Orders from "./Orders"
import WeightBrackets from "./WeightBrackets"

export default function AdminPage() {

    const location = useLocation()

    return(
        <div>
        <Navbar />
        <ToastContainer floatingTime={5000} />
        {location.pathname === "/emp/admin/weight-brackets" && <WeightBrackets />}
        {location.pathname === "/emp/admin" && <Orders />}
        </div>
    )
}