import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../../components/Navbar"
import ProductCards from "./ProductCards"


/**
 * Creates the store front page where there is a search bar to search through the products and there
 * is a list of all the products with their details. 
 * 
 * The customer is able to add these products to their cart.
 * 
 * @returns The store front page
 */
export default function StorePage() {

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
            <ToastContainer floatingTime={6000} />
            <ProductCards />
        </div>
    )
}