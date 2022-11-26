import { useLocation } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import Orders from "./Orders"
import WeightBrackets from "./WeightBrackets"

export default function AdminPage() {

    const location = useLocation()

    return(
        <div>
        <Navbar />
        {location.pathname === "/emp/admin/weight-brackets" && <WeightBrackets />}
        {location.pathname === "/emp/admin" && <Orders />}
        </div>
    )
}