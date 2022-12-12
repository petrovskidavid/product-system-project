import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar"
import CartItemCards from "./CartItemCards";
import "../../../assets/css/CartPage.css"


/**
 * Creates the customers cart page with all the items in their cart.
 * 
 * @returns The customers cart page
 */
export default function CartPage() {

    const nav = useNavigate() //< Holds functions to be able to navigate to different pages

    useEffect(() => {
        if(localStorage.getItem("customerEmail") === null) {
            // Checks if a customer is not logged in, and redirects to the login page if so
            
            nav("/")
        }
    }, [nav])

    
    return (
        <div>
            <Navbar />
            <CartItemCards />
        </div>
    )
}