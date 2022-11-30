import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"

export default function ReceivingPage() {

    const nav = useNavigate() //< Used to redirect client

    useEffect(() => {
        if(localStorage.getItem("employeeID") === null)
        {
            nav("/emp/login")
        }
    }, [nav])


    return (
        <div>
            <Navbar />
            <ToastContainer floatingTime={5000} />
            This is the receiving page
        </div>
    )
}