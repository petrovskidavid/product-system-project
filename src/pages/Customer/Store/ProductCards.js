import { useEffect, useState } from "react"
import Axios from "axios";
import SearchField from "../../../components/SearchField"
import ProductCard from "../../../components/ProductCard"


/**
 * Creates a list of all the product cards of the current products that the store offers.
 * 
 * @returns A list of all the product card components for the current products the store offers
 */
export default function ProductCards() {

    const [productsData, setProductsData] = useState([]) //< Holds the list of all the products
    const [searchQuery, setSearchQuery] = useState("")   //< Holds the search query provided by the user


    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get(process.env.REACT_APP_API_URL + "/api/getProducts").then((res) => {
            setProductsData(res.data)
        })
    }, [])


    // Updates the search query as the user types
    const searchProducts = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filters through all the products
    const productCards = productsData.filter((searchResults) => {

        if (searchQuery === "")
        {
            // Empty query, returns all the products
            return searchResults

        } else if (searchResults.description.toLowerCase().includes(searchQuery.toLowerCase())){
            
            // Checks to see if any part of the serach query can be found in the products description and returns the matching ones
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
        <div className="store">
            <SearchField placeholder="Search by Description" onChange={searchProducts}/>
            <div className="product-cards-container">
                {productCards}
            </div>
        </div>
    )
}