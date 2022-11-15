import { useEffect, useState } from "react"
import Axios from "axios";
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"

export default function StorePage() {

    const [productsData, setProductsData] = useState([]) //< Holds the list of all the products

    // Only calls once per render of the component
    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getProducts").then((res) => {
            setProductsData(res.data)
        })
    }, [])

    // Loops through the data and creates a ProductCard for each product
    const productCards = productsData.map((product) => {
        return (
            <ProductCard 
                key={product.number}
                img={product.pictureURL}
                description={product.description}
                weight={product.weight}
                price={product.price}
                quantity={product.Quantity}
            />
        )
    })


    return (
        <div className="store">
            <Navbar />
            <div className="product-card-container">
                {productCards}
            </div>
        </div>
    )
}