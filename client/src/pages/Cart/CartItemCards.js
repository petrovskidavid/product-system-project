import { useEffect, useState } from "react"
import Axios from "axios";
import CartItemCard from "../../components/CartItemCard"
import "../../assets/css/StorePage.css"

export default function CartItemCards() {

    const [cartItemsData, setCartItemsData] = useState([]) //< Holds the list of all the products
    const [productsData, setProductsData] = useState([]) //< Holds the list of all the products
    const [retrievedProducts, setRetrievedProducts] = useState(false)
    const [retrievedCartItems, setRetrievedCartItems] = useState(false)
    let cartItemCards
    let totalItems = 0
    let totalPrice = 0

    // Only calls once per render of the component
    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getProducts").then((res) => {
            setProductsData(res.data)
            setRetrievedProducts(true)
        })

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getCart?email=" + localStorage.getItem("customerEmail")).then((res) => {
            setCartItemsData(res.data)
            setRetrievedCartItems(true)
        })

    }, [])


    if(retrievedCartItems && retrievedProducts){
        // Filters through all the products
        cartItemCards = cartItemsData.map((cartItem) => {

            let productInCart = productsData.find(product => cartItem.ProductID === product.number)

            totalItems += cartItem.Quantity
            totalPrice += (productInCart.price * cartItem.Quantity)

            // Loops through all the above filtered products and creates product cards for each
            return (
                <CartItemCard 
                    key={cartItem.ProductID}
                    productID={cartItem.ProductID}
                    img={productInCart.pictureURL}
                    description={productInCart.description}
                    weight={productInCart.weight}
                    price={productInCart.price}
                    quantity={productInCart.Quantity}
                    selectedQuantity={cartItem.Quantity}
                    orderID={cartItem.OrderID}
                />
            )
        })
    }
    


    return (
        <div className="cart">
            <div className="checkout-container">
                <div className="checkout-label">
                    <span className="bold">Cart Total ({totalItems} Items):</span> ${totalPrice.toFixed(2)}
                </div>

                <button className="checkout-button">Checkout</button>
            </div>

            <div className="cart-item-cards-container">
                {cartItemCards}
            </div>
        </div>
    )
}