import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import CheckoutForm from "./CheckoutForm"


/**
 * Creates the customer checkout page with the form, order summary, and error message container.
 * 
 * @returns The customer checkout page
 */
export default function CheckoutPage() {

    const nav = useNavigate() //< Holds functions to be able to navigate to different pages

    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null) {
            // Checks if a customer is not logged in, and redirects to the login page if so

            nav("/")
        }
    }, [nav])

    toast.warning("Do NOT provide your real shipping and credit card information! This is a demo website!")

    return (
        <div>
            <Navbar />
            <ToastContainer floatingTime={5000} />
            <CheckoutForm />
        </div>
    )
}