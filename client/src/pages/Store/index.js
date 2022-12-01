import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-custom-alert"
import Navbar from "../../components/Navbar"
import ProductCards from "./ProductCards"

export default function StorePage() {

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
            <ToastContainer floatingTime={6000} />
            <ProductCards />
        </div>
    )
}