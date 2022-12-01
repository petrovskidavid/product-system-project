import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../components/Navbar"
import CheckoutForm from "./CheckoutForm"

export default function CheckoutPage() {

    const nav = useNavigate() //< Used to redirect client

    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null)
        {
            nav("/")
        }
    }, [nav])

    return (
        <div>
            <Navbar />
            <ToastContainer floatingTime={5000} />
            <CheckoutForm />
        </div>
    )
}