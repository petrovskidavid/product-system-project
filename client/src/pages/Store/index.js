import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"
import ProductCards from "./ProductCards"

export default function StorePage() {

    const nav = useNavigate() //< Used to redirect client

    useEffect(() => {
        if(localStorage.getItem("user") === null)
        {
            nav("/")
        }
    }, [])

    return (
        <div>
            <Navbar />
            <ProductCards />
        </div>
    )
}