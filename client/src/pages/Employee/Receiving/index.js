import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import ReceivingProductCards from "./RecevingProductCards";


/**
 * Creates the receiving page where the receiving employee can view all the products and update their quantity in the inventory.
 * 
 * @returns The receiving page
 */
export default function ReceivingPage() {

    const nav = useNavigate() //< Holds functions to be able to navigate to different pages

    useEffect(() => {
        if(localStorage.getItem("employeeID") === null) {
            // Checks if an employee is not logged in, and redirects to the login page if so

            nav("/emp/login")
        }
    }, [nav])


    return (
        <div>
            <Navbar />
            <ToastContainer floatingTime={6000} />
            <ReceivingProductCards />
        </div>
    )
}