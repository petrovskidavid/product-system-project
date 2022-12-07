import { useEffect, useState } from "react"
import Axios from "axios";
import SearchField from "../../../components/SearchField"
import ProductCard from "../../../components/ProductCard"


/**
 * Creates a list of all the product cards that match the search query for the receiving page.
 * 
 * @returns A list of product card components for the receiving page
 */
export default function ReceivingProductCards() {

    const [productsData, setProductsData] = useState([]) //< Holds the list of all the products
    const [searchQuery, setSearchQuery] = useState("")   //< Holds the search query provided by the user


    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getProducts").then((res) => {
            setProductsData(res.data)
        })
    }, [])


    // Updates the search query as the user types
    const searchProducts = (event) => {
        setSearchQuery(event.target.value)
    }


    // Filters through all the products
    const productCards = productsData.filter((searchResults) => {
        console.log(searchQuery)
        if (searchQuery === ""){

            // Empty query, returns all the products
            return searchResults

        } else if(parseInt(searchResults.ProductID) === parseInt(searchQuery)){

            // Returns all the products have the matching product ID
            return searchResults

        } else if (searchResults.description.toLowerCase().includes(searchQuery.toLowerCase())){

            // Returns all the products that match the search query string
            return searchResults
        } 

        return null //< Fixes warnings

    }).map((product) => {

        // Loops through all the above filtered products and creates product cards for each
        return (
            <ProductCard 
                key={product.number}
                productID={product.number}
                img={product.pictureURL}
                description={product.description}
                weight={product.weight}
                price={product.price}
                quantity={product.Quantity}
            />
        )
    })


    return (
        <div className="receiving">
            <div className="receiving-label">
                <span className="bold">Receiving Desk:</span> Products
            </div>
            <SearchField placeholder="Search by Number or Description" onChange={searchProducts}/>
            <div className="product-cards-container">
                {productCards}
            </div>
        </div>
    )
}