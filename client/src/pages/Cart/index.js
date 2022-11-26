import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"
import CartItemCards from "./CartItemCards";
import "../../assets/css/CartPage.css"

export default function CartPage() {

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
            <CartItemCards />
        </div>
    )
}